# Architecture Patterns

**Domain:** Web3 dApp with IPFS storage and smart contract access control
**Researched:** 2026-03-26

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌──────────────────┐         ┌─────────────────────────────┐  │
│  │   Next.js App    │         │   Wallet Extension          │  │
│  │   (Frontend)     │◄───────►│   (MetaMask/Rabby)          │  │
│  │                  │         │                             │  │
│  │  - Wallet Hook   │         │  - Sign transactions        │  │
│  │  - IPFS Client   │         │  - Store private keys       │  │
│  │  - UI Components │         │                             │  │
│  └────────┬─────────┘         └─────────────────────────────┘  │
│           │                                                     │
│           │ 1. Upload EEG data                                  │
│           │    (JSON file)                                      │
│           ▼                                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │           IPFS Pinning Service (Pinata/Web3.Storage)       ││
│  │                                                            ││
│  │  - Receives file via HTTP API                              ││
│  │  - Returns CID (Content Identifier)                        ││
│  │  - Pins content for availability                           ││
│  └────────────────────────────────────────────────────────────┘│
│           │                                                     │
│           │ 2. Store CID + metadata                             │
│           │    (transaction)                                    │
│           ▼                                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │           Smart Contract (Base/Sepolia)                    ││
│  │                                                            ││
│  │  - NeuralDataRegistry                                      ││
│  │  - Maps dataOwner → [CID, timestamp, metadata]             ││
│  │  - Access control: grant/revoke permissions                ││
│  │  - Events for off-chain indexing                           ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
           │
           │ 3. Query via RPC
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN RPC NODE                          │
│           (Alchemy/Infura or public RPC)                        │
│  - Reads contract state                                         │
│  - Broadcasts transactions                                      │
│  - Emits events                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Next.js Frontend** | UI rendering, user interaction, state management | Wallet (via wagmi), IPFS service (HTTP), Smart contract (via wagmi/viem) |
| **Wallet Extension** | Key management, transaction signing | User (popup), dApp (window.ethereum), Blockchain (RPC) |
| **IPFS Pinning Service** | File storage, content addressing, retrieval | Frontend (HTTP API), IPFS network (bitswap) |
| **Smart Contract** | Data registry, access control logic, event emission | Blockchain (EVM), Users (transactions), Indexers (events) |
| **RPC Provider** | Blockchain node access, state queries, tx broadcast | Frontend (JSON-RPC), Smart contract (calls) |

## Data Flow

### Upload Flow (Patient uploads neural data)

```
1. User connects wallet → wagmi reads wallet address
2. User uploads EEG JSON → Frontend calls Pinata API
3. Pinata returns CID → Frontend receives IPFS hash
4. Frontend calls smart contract.registerData(cid, metadata)
5. Wallet prompts signature → User approves
6. Transaction mined → Contract stores CID + owner mapping
7. Contract emits DataRegistered event → Frontend confirms
```

### Access Grant Flow (Patient grants researcher access)

```
1. Patient enters researcher address → Frontend UI
2. Patient calls contract.grantAccess(researcherAddress)
3. Wallet prompts signature → Patient approves
4. Transaction mined → Contract updates access mapping
5. Contract emits AccessGranted event → Indexer updates
```

### Data Access Flow (Researcher reads granted data)

```
1. Researcher connects wallet → wagmi reads address
2. Frontend calls contract.getDataByOwner(researcherAddress)
3. Contract reverts if no access → Frontend shows error
   OR
4. Contract returns CID list → Frontend receives CIDs
5. Frontend fetches from IPFS gateway → Displays EEG data
```

## Patterns to Follow

### Pattern 1: Two-Step Storage (IPFS + On-Chain Reference)

**What:** Store large data off-chain (IPFS), store only CID on-chain

**When:** Any data larger than a few hundred bytes, or data that doesn't require on-chain computation

**Example:**
```typescript
// Upload to IPFS first
const formData = new FormData();
formData.append('file', eegJsonBlob);
const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
  method: 'POST',
  headers: { Authorization: `Bearer ${PINATA_JWT}` },
  body: formData
});
const { IpfsHash } = await pinataRes.json(); // CID

// Then store CID in contract
await contract.write.registerData([IpfsHash, metadata]);
```

**Why:** Gas costs make on-chain storage prohibitively expensive. IPFS provides content-addressed, decentralized storage while blockchain provides verifiable ownership and access control.

### Pattern 2: Event-Driven State Synchronization

**What:** Emit events from smart contracts, listen in frontend for real-time updates

**When:** Any state change that frontend needs to reflect

**Example:**
```solidity
// Contract
event DataRegistered(address indexed owner, string cid, uint256 timestamp);
event AccessGranted(address indexed owner, address indexed researcher);

function registerData(string memory cid, bytes memory metadata) public {
    _dataRegistry[msg.sender].push(Data(cid, block.timestamp, metadata));
    emit DataRegistered(msg.sender, cid, block.timestamp);
}
```

```typescript
// Frontend
useWatchContractEvent({
  address: contractAddress,
  eventName: 'DataRegistered',
  onLogs: (logs) => {
    // Update UI with new data registration
    queryClient.invalidateQueries(['userData', userAddress]);
  }
});
```

### Pattern 3: Role-Based Access Control (RBAC) via Mapping

**What:** Use Solidity mappings to track permissions

**When:** Simple grant/revoke access patterns

**Example:**
```solidity
mapping(address => mapping(address => bool)) public hasAccess;

function grantAccess(address researcher) external {
    hasAccess[msg.sender][researcher] = true;
    emit AccessGranted(msg.sender, researcher);
}

function revokeAccess(address researcher) external {
    hasAccess[msg.sender][researcher] = false;
    emit AccessRevoked(msg.sender, researcher);
}

function getDataByOwner(address owner) external view returns (Data[] memory) {
    require(hasAccess[owner][msg.sender] || owner == msg.sender, "No access");
    return _dataRegistry[owner];
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Storing Large Data in Contract Storage

**What:** Putting full JSON payloads or large files directly in smart contract storage

**Why bad:** Gas costs scale with data size. Storing 1KB can cost $1-10+ on Ethereum L1. IPFS costs ~$0.01/GB/month via pinning services.

**Instead:** Store only CID (66 bytes for IPFS hash) on-chain, full data on IPFS

### Anti-Pattern 2: Direct IPFS Node Management in dApp

**What:** Running your own IPFS node in the dApp architecture

**Why bad:** Adds operational complexity, requires 24/7 uptime, pinning management overhead

**Instead:** Use Pinata or Web3.Storage for managed IPFS pinning (free tiers available for prototypes)

### Anti-Pattern 3: Frontend-Only Access Control

**What:** Checking permissions only in frontend code

**Why bad:** Easily bypassed, provides no security guarantees

**Instead:** Always enforce access control in smart contract, frontend is just a convenience layer

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **IPFS storage** | Pinata free tier (1GB) sufficient | Pinata Pro or dedicated pinning | IPFS Cluster or Filecoin storage deals |
| **Smart contract gas** | Testnet fine for prototype | L2 (Base) recommended | Consider optimistic rollups or sidechains |
| **Frontend hosting** | Vercel/Netlify free tier | CDN with edge caching | IPFS + ENS for decentralized hosting |
| **RPC rate limits** | Public RPC acceptable | Alchemy/Infura paid tier | Dedicated node or multi-provider failover |
| **Data indexing** | Direct contract calls OK | The Graph for indexed queries | Custom indexer with database cache |

## Build Order Implications

Based on component dependencies, recommended build order:

```
Phase 1: Smart Contract (Foundation)
├── NeuralDataRegistry.sol
├── Access control mappings
├── Event definitions
└── Foundry tests

Phase 2: IPFS Integration (Data Layer)
├── Pinata API client
├── Upload utility functions
└── Mock EEG data generator

Phase 3: Frontend Shell (UI Foundation)
├── Next.js app scaffolding
├── wagmi/viem configuration
├── Wallet connection UI
└── Basic routing

Phase 4: Patient Dashboard (Core Flow)
├── Upload neural data flow
├── View uploaded data list
└── Grant/revoke access UI

Phase 5: Researcher Dashboard (Secondary Flow)
├── View granted data
├── IPFS gateway fetch
└── Data visualization (mock EEG display)

Phase 6: Polish & Deployment
├── Error handling
├── Loading states
├── Testnet deployment
└── Demo data seeding
```

## Sources

- [IPFS Documentation - Application Integration](https://docs.ipfs.tech/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [wagmi React Documentation](https://wagmi.sh/)
- [Ethereum.org - dApp Architecture](https://ethereum.org/en/developers/docs/dapps/)
- [Web3.Storage Documentation](https://web3.storage/)
