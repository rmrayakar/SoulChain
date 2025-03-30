// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}


contract SoulBoundToken {
    string public name = "WillSBT";
    string public symbol = "WILL";
    uint256 public tokenCounter;
    mapping(uint256 => address) public ownerOfToken;
    mapping(address => uint256) public tokenOfOwner;
    event Mint(address indexed to, uint256 tokenId);

    function mint(address to) internal returns (uint256) {
        tokenCounter += 1;
        uint256 newTokenId = tokenCounter;
        ownerOfToken[newTokenId] = to;
        tokenOfOwner[to] = newTokenId;
        emit Mint(to, newTokenId);
        return newTokenId;
    }
}


contract DigitalWill is SoulBoundToken {
    
    enum AssetType { ETH, ERC20, ERC721, OffChain }
    
    struct Asset {
        AssetType assetType;
        address tokenAddress; // For ERC20/ERC721 (not used for OffChain).
        uint256 tokenId;      // For ERC721 tokens.
        uint256 amount;       // For ETH and ERC20 tokens.
        string metadataURI;   // For off-chain assets.
    }
    
    struct Beneficiary {
        address wallet;  
        uint256 share;   // Share in basis points (total must equal 100000).
    }
    
    struct Will {
        address owner;
        Beneficiary[] beneficiaries;
        Asset[] assets;
        bool deathVerified;
        bool assetsTransferred;
    }
    
    mapping(address => Will) public wills;
    address public oracle;
    address public admin;
    uint256 public constant MAX_BENEFICIARIES = 10;
    
    event WillCreated(address indexed owner);
    event DeathVerified(address indexed owner);
    event AssetsClaimed(address indexed owner);
    event OffChainAssetClaim(address indexed owner, address beneficiary, string metadataURI);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized oracle");
        _;
    }
    
    constructor(address _oracle) payable {
        admin = msg.sender;
        oracle = _oracle;
    }
    
    
    function createWill(
        address[] calldata _beneficiaries,
        uint256[] calldata _shares,
        Asset[] calldata _assets
    ) external payable {
        require(_beneficiaries.length > 0, "No beneficiaries specified");
        require(_beneficiaries.length <= MAX_BENEFICIARIES, "Too many beneficiaries");
        require(wills[msg.sender].owner == address(0), "Will already exists");
        require(_beneficiaries.length == _shares.length, "Beneficiaries and shares count mismatch");

        uint256 totalShares = 0;
        Will storage newWill = wills[msg.sender];
        newWill.owner = msg.sender;
        newWill.deathVerified = false;
        newWill.assetsTransferred = false;

        
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
            totalShares += _shares[i];
            newWill.beneficiaries.push(Beneficiary(_beneficiaries[i], _shares[i]));
        }
        require(totalShares == 100000, "Total shares must sum to 100000 (100%)");

       
        for (uint i = 0; i < _assets.length; i++) {
            Asset memory asset = _assets[i];
            if (asset.assetType == AssetType.ETH) {
                
                require(msg.value >= asset.amount, "Insufficient ETH sent");
                
            } else if (asset.assetType == AssetType.ERC20 || asset.assetType == AssetType.ERC721) {
                require(asset.tokenAddress != address(0), "Invalid token address");
                if (asset.assetType == AssetType.ERC20) {
                    bool success = IERC20(asset.tokenAddress).transferFrom(msg.sender, address(this), asset.amount);
                    require(success, "ERC20 transfer failed");
                } else if (asset.assetType == AssetType.ERC721) {
                    IERC721(asset.tokenAddress).safeTransferFrom(msg.sender, address(this), asset.tokenId);
                }
            }
            
            newWill.assets.push(asset);
        }
        
        mint(msg.sender);
        emit WillCreated(msg.sender);
    }
    
    function updateDeathVerification(address _willOwner) public onlyOracle {
        Will storage userWill = wills[_willOwner];
        require(userWill.owner != address(0), "Will does not exist");
        require(!userWill.deathVerified, "Death already verified");
        userWill.deathVerified = true;
        emit DeathVerified(_willOwner);
    }
    
    function claimInheritance(address _willOwner) public {
        Will storage userWill = wills[_willOwner];
        require(userWill.owner != address(0), "Will does not exist");
        require(userWill.deathVerified, "Death not verified");
        require(!userWill.assetsTransferred, "Assets already transferred");
        
        
        bool isBeneficiary = false;
        uint256 callerShare;
        for (uint256 i = 0; i < userWill.beneficiaries.length; i++) {
            if (userWill.beneficiaries[i].wallet == msg.sender) {
                isBeneficiary = true;
                callerShare = userWill.beneficiaries[i].share;
                break;
            }
        }
        require(isBeneficiary, "Caller is not a beneficiary");
        
        
        for (uint i = 0; i < userWill.assets.length; i++) {
            Asset memory asset = userWill.assets[i];
            if (asset.assetType == AssetType.ETH) {
                uint256 allocatedETH = (asset.amount * callerShare) / 100000;
                if (allocatedETH > 0) {
                    payable(msg.sender).transfer(allocatedETH);
                }
            } else if (asset.assetType == AssetType.ERC20) {
                uint256 allocatedTokens = (asset.amount * callerShare) / 100000;
                if (allocatedTokens > 0) {
                    bool success = IERC20(asset.tokenAddress).transfer(msg.sender, allocatedTokens);
                    require(success, "ERC20 transfer failed");
                }
            } else if (asset.assetType == AssetType.ERC721) {
                require(callerShare == 100000, "ERC721 tokens must be claimed by sole beneficiary");
                IERC721(asset.tokenAddress).safeTransferFrom(address(this), msg.sender, asset.tokenId);
            } else if (asset.assetType == AssetType.OffChain) {
                emit OffChainAssetClaim(_willOwner, msg.sender, asset.metadataURI);
            }
        }
        userWill.assetsTransferred = true;
        emit AssetsClaimed(_willOwner);
    }
    
    function revokeWill() external {
        Will storage userWill = wills[msg.sender];
        require(userWill.owner == msg.sender, "Not will owner");
        require(!userWill.deathVerified, "Death already verified");
        
        for (uint i = 0; i < userWill.assets.length; i++) {
            Asset memory asset = userWill.assets[i];
            if (asset.assetType == AssetType.ETH) {
                payable(msg.sender).transfer(asset.amount);
            } else if (asset.assetType == AssetType.ERC20) {
                IERC20(asset.tokenAddress).transfer(msg.sender, asset.amount);
            } else if (asset.assetType == AssetType.ERC721) {
                IERC721(asset.tokenAddress).safeTransferFrom(address(this), msg.sender, asset.tokenId);
            }
        }
        delete wills[msg.sender];
    }
    
    function updateOracle(address _newOracle) external onlyAdmin {
        require(_newOracle != address(0), "Invalid oracle address");
        oracle = _newOracle;
    }
    
    function updateAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
    
    receive() external payable {}
    fallback() external payable {}  
}