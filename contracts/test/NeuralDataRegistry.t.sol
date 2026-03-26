// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "forge-std/Test.sol";
import "../src/NeuralDataRegistry.sol";

/// @title NeuralDataRegistryTest
/// @notice Comprehensive tests for NeuralDataRegistry smart contract
contract NeuralDataRegistryTest is Test {
    NeuralDataRegistry public registry;
    address public owner;
    address public researcher;
    address public other;

    string constant TEST_CID = "QmTest123456789abcdefghijklmnopqrstuvwxyz";
    string constant TEST_CID_2 = "QmAnotherCID987654321zyxwvutsrqponmlkjihgfedcba";

    function setUp() public {
        registry = new NeuralDataRegistry();
        owner = address(1);
        researcher = address(2);
        other = address(3);

        // Fund test accounts
        vm.deal(owner, 10 ether);
        vm.deal(researcher, 10 ether);
        vm.deal(other, 10 ether);
    }

    /// @notice Test: uploadData stores CID and emits event
    function test_UploadData_StoresCidAndEmitsEvent() public {
        vm.startPrank(owner);

        // Expect event
        vm.expectEmit(true, false, false, true);
        emit NeuralDataRegistry.DataRegistered(owner, TEST_CID, block.timestamp);

        uint256 dataId = registry.uploadData(TEST_CID);

        // Verify dataId is 0 (first upload)
        assertEq(dataId, 0, "First data ID should be 0");

        vm.stopPrank();
    }

    /// @notice Test: uploadData increments counter for multiple uploads
    function test_UploadData_IncrementsCounter() public {
        vm.startPrank(owner);

        uint256 dataId1 = registry.uploadData(TEST_CID);
        uint256 dataId2 = registry.uploadData(TEST_CID_2);

        assertEq(dataId1, 0, "First data ID should be 0");
        assertEq(dataId2, 1, "Second data ID should be 1");

        vm.stopPrank();
    }

    /// @notice Test: getDataCount returns correct count
    function test_GetDataCount_ReturnsCorrectCount() public {
        vm.startPrank(owner);

        assertEq(registry.getDataCount(owner), 0, "Initial count should be 0");

        registry.uploadData(TEST_CID);
        assertEq(registry.getDataCount(owner), 1, "Count should be 1 after upload");

        registry.uploadData(TEST_CID_2);
        assertEq(registry.getDataCount(owner), 2, "Count should be 2 after second upload");

        vm.stopPrank();
    }

    /// @notice Test: getDataIdsByOwner returns correct IDs
    function test_GetDataIdsByOwner_ReturnsCorrectIds() public {
        vm.startPrank(owner);

        registry.uploadData(TEST_CID);
        registry.uploadData(TEST_CID_2);

        uint256[] memory dataIds = registry.getDataIdsByOwner(owner);

        assertEq(dataIds.length, 2, "Should have 2 data IDs");
        assertEq(dataIds[0], 0, "First ID should be 0");
        assertEq(dataIds[1], 1, "Second ID should be 1");

        vm.stopPrank();
    }

    /// @notice Test: getData returns correct data with access
    function test_GetData_ReturnsCorrectData() public {
        vm.startPrank(owner);

        registry.uploadData(TEST_CID);

        vm.stopPrank();

        // Owner can access their own data
        vm.prank(owner);
        NeuralDataRegistry.Data memory data = registry.getData(0);

        assertEq(data.cid, TEST_CID, "CID should match");
        assertEq(data.timestamp, block.timestamp, "Timestamp should match");
    }

    /// @notice Test: grantAccess sets permission and emits event
    function test_GrantAccess_SetsPermissionAndEmitsEvent() public {
        vm.startPrank(owner);

        // Expect event
        vm.expectEmit(true, true, false, true);
        emit NeuralDataRegistry.AccessGranted(owner, researcher);

        registry.grantAccess(researcher);

        // Verify access is granted
        assertTrue(registry.hasAccess(owner, researcher), "Access should be granted");

        vm.stopPrank();
    }

    /// @notice Test: grantAccess reverts for self-grant
    function test_GrantAccess_RevertsForSelfGrant() public {
        vm.prank(owner);

        vm.expectRevert("Cannot grant access to self");
        registry.grantAccess(owner);
    }

    /// @notice Test: grantAccess reverts for zero address
    function test_GrantAccess_RevertsForZeroAddress() public {
        vm.prank(owner);

        vm.expectRevert("Invalid researcher address");
        registry.grantAccess(address(0));
    }

    /// @notice Test: grantAccess reverts if already granted
    function test_GrantAccess_RevertsIfAlreadyGranted() public {
        vm.startPrank(owner);

        registry.grantAccess(researcher);

        vm.expectRevert("Access already granted");
        registry.grantAccess(researcher);

        vm.stopPrank();
    }

    /// @notice Test: revokeAccess removes permission and emits event
    function test_RevokeAccess_RemovesPermissionAndEmitsEvent() public {
        vm.startPrank(owner);

        // First grant access
        registry.grantAccess(researcher);

        // Expect event
        vm.expectEmit(true, true, false, true);
        emit NeuralDataRegistry.AccessRevoked(owner, researcher);

        registry.revokeAccess(researcher);

        // Verify access is revoked
        assertFalse(registry.hasAccess(owner, researcher), "Access should be revoked");

        vm.stopPrank();
    }

    /// @notice Test: revokeAccess reverts if not granted
    function test_RevokeAccess_RevertsIfNotGranted() public {
        vm.prank(owner);

        vm.expectRevert("Access not granted");
        registry.revokeAccess(researcher);
    }

    /// @notice Test: revokeAccess reverts for zero address
    function test_RevokeAccess_RevertsForZeroAddress() public {
        vm.prank(owner);

        vm.expectRevert("Invalid researcher address");
        registry.revokeAccess(address(0));
    }

    /// @notice Test: getData reverts when access denied (ACCESS-04)
    function test_GetData_RevertsWhenAccessDenied() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        vm.stopPrank();

        // Researcher tries to access without grant - should revert
        vm.prank(researcher);
        vm.expectRevert("Access denied");
        registry.getData(0);
    }

    /// @notice Test: getData succeeds when access granted
    function test_GetData_SucceedsWhenAccessGranted() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        registry.grantAccess(researcher);
        vm.stopPrank();

        // Researcher can now access
        vm.prank(researcher);
        NeuralDataRegistry.Data memory data = registry.getData(0);

        assertEq(data.cid, TEST_CID, "CID should match");
    }

    /// @notice Test: hasAccessToData returns true for owner
    function test_HasAccessToData_ReturnsTrueForOwner() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        vm.stopPrank();

        vm.prank(owner);
        bool hasAccess = registry.hasAccessToData(owner, owner);

        assertTrue(hasAccess, "Owner should have access to own data");
    }

    /// @notice Test: hasAccessToData returns true for granted researcher
    function test_HasAccessToData_ReturnsTrueForGrantedResearcher() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        registry.grantAccess(researcher);
        vm.stopPrank();

        vm.prank(researcher);
        bool hasAccess = registry.hasAccessToData(owner, researcher);

        assertTrue(hasAccess, "Granted researcher should have access");
    }

    /// @notice Test: hasAccessToData returns false for non-granted researcher
    function test_HasAccessToData_ReturnsFalseForNonGrantedResearcher() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        vm.stopPrank();

        vm.prank(other);
        bool hasAccess = registry.hasAccessToData(owner, other);

        assertFalse(hasAccess, "Non-granted researcher should not have access");
    }

    /// @notice Test: getDataByOwnerPaginated returns correct data
    function test_GetDataByOwnerPaginated_ReturnsCorrectData() public {
        vm.startPrank(owner);

        registry.uploadData(TEST_CID);
        registry.uploadData(TEST_CID_2);

        vm.stopPrank();

        // Get all data
        vm.prank(owner);
        NeuralDataRegistry.Data[] memory data = registry.getDataByOwnerPaginated(owner, 0, 10);

        assertEq(data.length, 2, "Should return 2 records");
        assertEq(data[0].cid, TEST_CID, "First CID should match");
        assertEq(data[1].cid, TEST_CID_2, "Second CID should match");
    }

    /// @notice Test: getDataByOwnerPaginated with offset and limit
    function test_GetDataByOwnerPaginated_WithOffsetAndLimit() public {
        vm.startPrank(owner);

        // Upload 5 records
        for (uint256 i = 0; i < 5; i++) {
            registry.uploadData(string.concat(TEST_CID, vm.toString(i)));
        }

        vm.stopPrank();

        // Get 2 records starting from index 2
        vm.prank(owner);
        NeuralDataRegistry.Data[] memory data = registry.getDataByOwnerPaginated(owner, 2, 2);

        assertEq(data.length, 2, "Should return 2 records");
    }

    /// @notice Test: getAllAccessibleData returns owner's data
    function test_GetAllAccessibleData_ReturnsOwnersData() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        vm.stopPrank();

        vm.prank(owner);
        (uint256[] memory dataIds, NeuralDataRegistry.Data[] memory dataList) = registry.getAllAccessibleData(owner);

        assertEq(dataIds.length, 1, "Should have 1 data ID");
        assertEq(dataList.length, 1, "Should have 1 data record");
        assertEq(dataList[0].cid, TEST_CID, "CID should match");
    }

    /// @notice Test: getAllAccessibleData returns granted data
    function test_GetAllAccessibleData_ReturnsGrantedData() public {
        vm.startPrank(owner);
        registry.uploadData(TEST_CID);
        registry.grantAccess(researcher);
        vm.stopPrank();

        vm.prank(researcher);
        (uint256[] memory dataIds, NeuralDataRegistry.Data[] memory dataList) = registry.getAllAccessibleData(researcher);

        assertEq(dataIds.length, 1, "Should have 1 accessible data ID");
        assertEq(dataList.length, 1, "Should have 1 accessible data record");
    }

    /// @notice Test: Multiple owners and researchers
    function test_MultipleOwnersAndResearchers() public {
        // Owner 1 uploads data
        vm.prank(owner);
        registry.uploadData(TEST_CID);

        // Owner 2 uploads data
        vm.prank(other);
        registry.uploadData(TEST_CID_2);

        // Owner 1 grants access to researcher
        vm.prank(owner);
        registry.grantAccess(researcher);

        // Researcher can access owner 1's data
        vm.prank(researcher);
        NeuralDataRegistry.Data memory data1 = registry.getData(0);
        assertEq(data1.cid, TEST_CID, "Should access owner 1's data");

        // Researcher cannot access owner 2's data
        vm.prank(researcher);
        vm.expectRevert("Access denied");
        registry.getData(1);

        // Owner 2 can access their own data
        vm.prank(other);
        NeuralDataRegistry.Data memory data2 = registry.getData(1);
        assertEq(data2.cid, TEST_CID_2, "Owner 2 should access their data");
    }
}
