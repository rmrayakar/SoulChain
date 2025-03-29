// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
    Interfaces for external token standards.
*/
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

/*
    Minimal soul-bound token (SBT) implementation.
*/
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

/*
    Main DigitalWill contract – supports multiple wills per user, multiple beneficiaries, 
    multiple oracle addresses for death verification, and both on-chain and off-chain assets.
    Once a majority of designated oracles verify death, asset distribution occurs automatically.
*/
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
    
    // Note: Nested mappings require the will to be stored in contract storage.
    struct Will {
        uint256 id;
        address owner;
        Beneficiary[] beneficiaries;
        Asset[] assets;
        bool deathVerified;
        bool assetsTransferred;
        address[] deathOracles;   // List of oracle addresses specified by the will creator.
        uint256 deathApprovalCount;
        uint256 deathApprovalThreshold; // Majority threshold = (n / 2) + 1
        mapping(address => bool) deathApprovals; // Track which oracle has already approved.
    }
    
    // Mapping from will ID to Will.
    mapping(uint256 => Will) public wills;
    // Mapping from owner address to a list of their will IDs.
    mapping(address => uint256[]) public ownerWills;
    
    uint256 public willCounter;
    address public admin;
    uint256 public constant MAX_BENEFICIARIES = 10;
    
    event WillCreated(address indexed owner, uint256 indexed willId);
    event OracleApprovalReceived(uint256 indexed willId, address indexed oracle);
    event DeathVerified(uint256 indexed willId);
    event AssetsClaimed(uint256 indexed willId);
    event OffChainAssetClaim(uint256 indexed willId, address beneficiary, string metadataURI);
    event WillRevoked(address indexed owner, uint256 indexed willId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    constructor() payable {
        admin = msg.sender;
    }
    
    /*
       Create a new will with beneficiaries, assets, and designated oracle addresses.
       Returns the new will's ID.
    */
    function createWill(
        address[] calldata _beneficiaries,
        uint256[] calldata _shares,
        Asset[] calldata _assets,
        address[] calldata _oracles
    ) external payable returns (uint256) {
        require(_beneficiaries.length > 0, "No beneficiaries specified");
        require(_beneficiaries.length <= MAX_BENEFICIARIES, "Too many beneficiaries");
        require(_beneficiaries.length == _shares.length, "Beneficiaries and shares count mismatch");
        require(_oracles.length > 0, "At least one oracle required");

        uint256 totalShares = 0;
        willCounter++;
        uint256 newWillId = willCounter;
        
        // Initialize the will.
        // We use a storage pointer to create the will in storage.
        Will storage newWill = wills[newWillId];
        newWill.id = newWillId;
        newWill.owner = msg.sender;
        newWill.deathVerified = false;
        newWill.assetsTransferred = false;
        
        // Add beneficiaries and validate shares.
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
            totalShares += _shares[i];
            newWill.beneficiaries.push(Beneficiary(_beneficiaries[i], _shares[i]));
        }
        require(totalShares == 100000, "Total shares must sum to 100000 (100%)");

        // Set oracle addresses.
        for (uint256 i = 0; i < _oracles.length; i++) {
            require(_oracles[i] != address(0), "Invalid oracle address");
            newWill.deathOracles.push(_oracles[i]);
        }
        // Set majority threshold (floor(n/2)+1).
        newWill.deathApprovalThreshold = (newWill.deathOracles.length / 2) + 1;
        
        // Process assets.
        for (uint i = 0; i < _assets.length; i++) {
            Asset memory asset = _assets[i];
            if (asset.assetType == AssetType.ETH) {
                // For ETH, ensure sufficient ETH is sent.
                require(msg.value >= asset.amount, "Insufficient ETH sent");
                // ETH is kept in the contract.
            } else if (asset.assetType == AssetType.ERC20 || asset.assetType == AssetType.ERC721) {
                require(asset.tokenAddress != address(0), "Invalid token address");
                if (asset.assetType == AssetType.ERC20) {
                    bool success = IERC20(asset.tokenAddress).transferFrom(msg.sender, address(this), asset.amount);
                    require(success, "ERC20 transfer failed");
                } else if (asset.assetType == AssetType.ERC721) {
                    // For ERC721, require that only a single beneficiary with 100% share is specified.
                    require(_beneficiaries.length == 1 && _shares[0] == 100000, "ERC721 tokens require a sole beneficiary with full share");
                    IERC721(asset.tokenAddress).safeTransferFrom(msg.sender, address(this), asset.tokenId);
                }
            }
            // For OffChain assets, simply store the asset.
            newWill.assets.push(asset);
        }
        
        // Track the will for the owner.
        ownerWills[msg.sender].push(newWillId);
        mint(msg.sender);
        emit WillCreated(msg.sender, newWillId);
        return newWillId;
    }
    
    /*
       Designated oracles call this function to verify death for a specific will.
       Once the threshold is reached, the will is marked as deceased and assets are distributed automatically.
    */
    function oracleVerifyDeath(uint256 _willId) external {
        Will storage userWill = wills[_willId];
        require(userWill.owner != address(0), "Will does not exist");
        require(!userWill.deathVerified, "Death already verified");
        
        // Verify that msg.sender is one of the designated oracles.
        bool isDesignatedOracle = false;
        for (uint256 i = 0; i < userWill.deathOracles.length; i++) {
            if (userWill.deathOracles[i] == msg.sender) {
                isDesignatedOracle = true;
                break;
            }
        }
        require(isDesignatedOracle, "Caller is not a designated oracle");
        
        // Ensure this oracle hasn't already approved.
        require(!userWill.deathApprovals[msg.sender], "Oracle already approved");
        userWill.deathApprovals[msg.sender] = true;
        userWill.deathApprovalCount++;
        emit OracleApprovalReceived(_willId, msg.sender);
        
        // If approvals meet the threshold, mark death as verified and distribute assets.
        if (userWill.deathApprovalCount >= userWill.deathApprovalThreshold) {
            userWill.deathVerified = true;
            emit DeathVerified(_willId);
            _distributeAssets(_willId);
        }
    }
    
    /*
       Internal function to distribute assets automatically to all beneficiaries.
       ETH and ERC20 tokens are split proportionally based on beneficiary shares.
       ERC721 tokens can only be transferred if there is a sole beneficiary.
    */
    function _distributeAssets(uint256 _willId) internal {
        Will storage userWill = wills[_willId];
        require(userWill.deathVerified, "Death not verified");
        require(!userWill.assetsTransferred, "Assets already transferred");
        
        for (uint i = 0; i < userWill.assets.length; i++) {
            Asset memory asset = userWill.assets[i];
            if (asset.assetType == AssetType.ETH) {
                for (uint256 j = 0; j < userWill.beneficiaries.length; j++) {
                    uint256 allocatedETH = (asset.amount * userWill.beneficiaries[j].share) / 100000;
                    if (allocatedETH > 0) {
                        payable(userWill.beneficiaries[j].wallet).transfer(allocatedETH);
                    }
                }
            } else if (asset.assetType == AssetType.ERC20) {
                for (uint256 j = 0; j < userWill.beneficiaries.length; j++) {
                    uint256 allocatedTokens = (asset.amount * userWill.beneficiaries[j].share) / 100000;
                    if (allocatedTokens > 0) {
                        bool success = IERC20(asset.tokenAddress).transfer(userWill.beneficiaries[j].wallet, allocatedTokens);
                        require(success, "ERC20 transfer failed");
                    }
                }
            } else if (asset.assetType == AssetType.ERC721) {
                // ERC721 tokens must be transferred to the sole beneficiary.
                require(userWill.beneficiaries.length == 1 && userWill.beneficiaries[0].share == 100000, "ERC721 tokens require sole beneficiary");
                IERC721(asset.tokenAddress).safeTransferFrom(address(this), userWill.beneficiaries[0].wallet, asset.tokenId);
            } else if (asset.assetType == AssetType.OffChain) {
                // Emit event for off-chain asset claim for each beneficiary.
                for (uint256 j = 0; j < userWill.beneficiaries.length; j++) {
                    emit OffChainAssetClaim(_willId, userWill.beneficiaries[j].wallet, asset.metadataURI);
                }
            }
        }
        userWill.assetsTransferred = true;
        emit AssetsClaimed(_willId);
    }
    
    /*
       Revoke a specific will if death has not been verified.
       All assets will be returned to the will owner.
    */
    function revokeWill(uint256 _willId) external {
        Will storage userWill = wills[_willId];
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
        
        // Remove the will by deleting from storage.
        delete wills[_willId];
        // Optionally, remove _willId from the ownerWills mapping (left as an exercise).
        emit WillRevoked(msg.sender, _willId);
    }
    
    function updateAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
    
    receive() external payable {}
    fallback() external payable {}  
}
