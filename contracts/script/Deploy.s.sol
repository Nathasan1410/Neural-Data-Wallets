// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "forge-std/Script.sol";
import "../src/NeuralDataRegistry.sol";

/// @notice Deployment script for NeuralDataRegistry
/// @dev Run with: forge script script/Deploy.s.sol --rpc-url <RPC_URL> --broadcast --verify
contract Deploy is Script {
    function run() external returns (NeuralDataRegistry registry) {
        // Get deployer address from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcast
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contract
        registry = new NeuralDataRegistry();

        // Stop broadcast
        vm.stopBroadcast();

        // Output deployment info
        console.log("======================================");
        console.log("NeuralDataRegistry deployed!");
        console.log(string.concat("Network: ", vm.toString(block.chainid)));
        console.log(string.concat("Contract: ", vm.toString(address(registry))));
        console.log(string.concat("Deployer: ", vm.toString(msg.sender)));
        console.log("======================================");
    }
}
