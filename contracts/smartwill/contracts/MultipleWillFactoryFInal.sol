// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultipleWill2.sol"; 

contract DigitalWillFactory {
    
    address payable[] public deployedDigitalWills;
    
    event DigitalWillDeployed(address indexed deployer, address digitalWillAddress);
    event DeathVerifiedViaFactory(address indexed digitalWillAddress, uint256 indexed willId, address oracle);
    event WillRevokedViaFactory(address indexed digitalWillAddress, uint256 indexed willId, address owner);

    /**
     * @notice Deploys a new instance of the DigitalWill contract.
     * @dev If the DigitalWill constructor is payable, you can forward msg.value.
     * @return The address of the newly deployed DigitalWill contract.
     */
    function deployDigitalWill() external payable returns (address) {
        DigitalWill newWill = new DigitalWill{value: msg.value}();
        deployedDigitalWills.push(payable(address(newWill)));
        emit DigitalWillDeployed(msg.sender, address(newWill));
        return address(newWill);
    }
    
    /**
     * @notice Returns the total number of deployed DigitalWill contracts.
     */
    function getDeployedWillsCount() external view returns (uint256) {
        return deployedDigitalWills.length;
    }
    
    /**
     * @notice Forwards a call to create a new will on a specific DigitalWill contract.
     * @dev The DigitalWill contract's createWill function is payable and returns a will ID.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @return The new will's ID.
     */
    function createWillOnDigitalWill(
        address payable digitalWillAddress,
        address[] calldata _beneficiaries,
        uint256[] calldata _shares,
        DigitalWill.Asset[] calldata _assets,
        address[] calldata _oracles,
        string[] calldata _aadhaarNumbers
    ) external payable returns (uint256) {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        return DigitalWill(digitalWillAddress).createWill{value: msg.value}(
            _beneficiaries,
            _shares,
            _assets,
            _oracles,
            _aadhaarNumbers
        );
    }
    
    /**
     * @notice Forwards a call to verify death on a specific DigitalWill contract.
     * @dev This function calls oracleVerifyDeath on the target DigitalWill.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param willId The ID of the will to verify.
     */
    function verifyDeathViaFactory(address payable digitalWillAddress, uint256 willId) external {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        DigitalWill(digitalWillAddress).oracleVerifyDeath(willId);
        emit DeathVerifiedViaFactory(digitalWillAddress, willId, msg.sender);
    }
    
    /**
     * @notice Forwards a call to revoke a specific will on a DigitalWill contract.
     * @dev The DigitalWill contract's revokeWill function should verify msg.sender is the will owner.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param willId The ID of the will to revoke.
     */
    function revokeWillViaFactory(address payable digitalWillAddress, uint256 willId) external {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        DigitalWill(digitalWillAddress).revokeWill(willId);
        emit WillRevokedViaFactory(digitalWillAddress, willId, msg.sender);
    }
    
    /**
     * @notice Reads oracle information from a specific DigitalWill instance.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param willId The ID of the will.
     * @return An array of Oracle structs as defined in the DigitalWill contract.
     */
    function getWillOraclesFromDigitalWill(address payable digitalWillAddress, uint256 willId) external view returns (DigitalWill.Oracle[] memory) {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        return DigitalWill(digitalWillAddress).getWillOracles(willId);
    }
    
    /**
     * @notice Forwards a call to get the number of oracles for a specific will.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param willId The ID of the will.
     * @return The number of designated oracles.
     */
    function getOracleCountFromDigitalWill(address payable digitalWillAddress, uint256 willId) external view returns (uint256) {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        return DigitalWill(digitalWillAddress).getOracleCount(willId);
    }
    
    /**
     * @notice Forwards a call to get details about a particular oracle.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param willId The ID of the will.
     * @param oracleIndex The index of the oracle in the will's oracle list.
     * @return wallet The oracle's wallet address.
     * @return aadhaarNumber The oracle's Aadhaar number.
     * @return hasApproved Whether the oracle has already approved.
     */
    function getOracleDetailsFromDigitalWill(
        address payable digitalWillAddress,
        uint256 willId,
        uint256 oracleIndex
    ) external view returns (address wallet, string memory aadhaarNumber, bool hasApproved) {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        return DigitalWill(digitalWillAddress).getOracleDetails(willId, oracleIndex);
    }
    
    /**
     * @notice Forwards a call to update the admin of a specific DigitalWill instance.
     * @param digitalWillAddress The address of the DigitalWill instance.
     * @param newAdmin The new admin address.
     */
    function updateAdminOnDigitalWill(address payable digitalWillAddress, address newAdmin) external {
        require(digitalWillAddress != address(0), "Invalid DigitalWill address");
        DigitalWill(digitalWillAddress).updateAdmin(newAdmin);
    }
}
