// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

/// @title NeuralDataRegistry
/// @notice Smart contract for managing neural data ownership and researcher access control
/// @dev Stores IPFS CIDs linked to owner addresses with grant/revoke access pattern
contract NeuralDataRegistry {
    /// @notice Data structure for neural data records
    /// @param cid IPFS Content Identifier for the stored data
    /// @param timestamp Unix timestamp when data was registered
    /// @param metadata Optional additional data (reserved for future use)
    struct Data {
        string cid;
        uint256 timestamp;
        bytes metadata;
    }

    /// @notice Event emitted when new data is registered
    /// @param owner Address of the data owner
    /// @param cid IPFS Content Identifier
    /// @param timestamp Registration timestamp
    event DataRegistered(address indexed owner, string cid, uint256 timestamp);

    /// @notice Event emitted when access is granted to a researcher
    /// @param owner Data owner address
    /// @param researcher Researcher address granted access
    event AccessGranted(address indexed owner, address indexed researcher);

    /// @notice Event emitted when access is revoked from a researcher
    /// @param owner Data owner address
    /// @param researcher Researcher address whose access was revoked
    event AccessRevoked(address indexed owner, address indexed researcher);

    /// @notice Mapping of data ID to Data struct
    mapping(uint256 => Data) private _dataById;

    /// @notice Mapping of owner address to array of data IDs they own
    mapping(address => uint256[]) private _ownerDataIds;

    /// @notice Mapping of owner => researcher => hasAccess
    /// @dev Public for direct access from frontend
    mapping(address => mapping(address => bool)) public hasAccess;

    /// @notice Counter for generating unique data IDs
    uint256 private _dataCounter;

    /// @notice Mapping of data ID to owner address for efficient lookup
    mapping(uint256 => address) private _dataOwners;

    /// @notice Register new neural data with IPFS CID
    /// @param cid IPFS Content Identifier for the uploaded data
    /// @return dataId The unique ID assigned to this data record
    /// @dev Emits DataRegistered event for off-chain indexing
    function uploadData(string memory cid) external returns (uint256 dataId) {
        dataId = _dataCounter++;

        _dataById[dataId] = Data({
            cid: cid,
            timestamp: block.timestamp,
            metadata: new bytes(0)
        });

        _ownerDataIds[msg.sender] = _ownerDataIds[msg.sender];
        _ownerDataIds[msg.sender].push(dataId);
        _dataOwners[dataId] = msg.sender;

        emit DataRegistered(msg.sender, cid, block.timestamp);
    }

    /// @notice Grant access to a researcher for all owner's data
    /// @param researcher Address of the researcher to grant access to
    /// @dev Emits AccessGranted event
    function grantAccess(address researcher) external {
        require(researcher != address(0), "Invalid researcher address");
        require(researcher != msg.sender, "Cannot grant access to self");
        require(!hasAccess[msg.sender][researcher], "Access already granted");

        hasAccess[msg.sender][researcher] = true;
        emit AccessGranted(msg.sender, researcher);
    }

    /// @notice Revoke access from a researcher
    /// @param researcher Address of the researcher to revoke access from
    /// @dev Emits AccessRevoked event
    function revokeAccess(address researcher) external {
        require(researcher != address(0), "Invalid researcher address");
        require(hasAccess[msg.sender][researcher], "Access not granted");

        hasAccess[msg.sender][researcher] = false;
        emit AccessRevoked(msg.sender, researcher);
    }

    /// @notice Check if a researcher has access to owner's data
    /// @param user Address of the data owner
    /// @param researcher Address of the researcher
    /// @return true if researcher has access, false otherwise
    /// @dev Owner always has access to their own data
    function hasAccessToData(address user, address researcher) external view returns (bool) {
        return user == researcher || hasAccess[user][researcher];
    }

    /// @notice Get all data IDs owned by an address
    /// @param owner Address of the data owner
    /// @return Array of data IDs
    function getDataIdsByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerDataIds[owner];
    }

    /// @notice Get data record by ID with access control
    /// @param dataId ID of the data record
    /// @return Data struct with cid, timestamp, and metadata
    /// @dev Reverts if caller doesn't have access (ACCESS-04)
    function getData(uint256 dataId) external view returns (Data memory) {
        require(dataId < _dataCounter, "Data does not exist");

        // Find owner of this data
        address owner = _getOwnerByDataId(dataId);

        // Access control: owner or granted researcher only
        require(
            msg.sender == owner || hasAccess[owner][msg.sender],
            "Access denied"
        );

        return _dataById[dataId];
    }

    /// @notice Get count of data records owned by an address
    /// @param owner Address of the data owner
    /// @return Number of data records
    function getDataCount(address owner) external view returns (uint256) {
        return _ownerDataIds[owner].length;
    }

    /// @notice Get data records for owner with pagination
    /// @param owner Address of the data owner
    /// @param offset Starting index
    /// @param limit Maximum number of records to return
    /// @return Array of Data structs
    function getDataByOwnerPaginated(
        address owner,
        uint256 offset,
        uint256 limit
    ) external view returns (Data[] memory) {
        uint256[] memory dataIds = _ownerDataIds[owner];
        require(offset < dataIds.length || dataIds.length == 0, "Offset out of bounds");

        uint256 actualLimit = limit;
        if (offset + limit > dataIds.length) {
            actualLimit = dataIds.length - offset;
        }

        Data[] memory result = new Data[](actualLimit);
        for (uint256 i = 0; i < actualLimit; i++) {
            result[i] = _dataById[dataIds[offset + i]];
        }

        return result;
    }

    /// @notice Get all data accessible to a researcher
    /// @param researcher Address of the researcher
    /// @return dataIds Array of data IDs
    /// @return dataList Array of Data structs
    /// @dev Returns all data where researcher is owner OR has been granted access
    function getAllAccessibleData(
        address researcher
    ) external view returns (uint256[] memory dataIds, Data[] memory dataList) {
        // Collect all accessible data IDs first
        uint256[] memory tempIds = new uint256[](_dataCounter);
        uint256 count = 0;

        for (uint256 id = 0; id < _dataCounter; id++) {
            address owner = _getOwnerByDataId(id);
            if (owner == researcher || hasAccess[owner][researcher]) {
                tempIds[count] = id;
                count++;
            }
        }

        // Resize arrays to actual count
        dataIds = new uint256[](count);
        dataList = new Data[](count);

        for (uint256 i = 0; i < count; i++) {
            dataIds[i] = tempIds[i];
            dataList[i] = _dataById[tempIds[i]];
        }
    }

    /// @notice Internal helper to find owner of a data ID
    /// @param dataId The data ID to find owner for
    /// @return Owner address
    function _getOwnerByDataId(uint256 dataId) internal view returns (address) {
        require(dataId < _dataCounter, "Data does not exist");
        return _dataOwners[dataId];
    }
}
