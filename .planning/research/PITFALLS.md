# Domain Pitfalls

**Domain:** Web3 dApp with IPFS Storage (Neural Data Wallet)
**Researched:** 2026-03-26

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Assuming IPFS Storage = Permanent Storage

**What goes wrong:** Developers assume uploading to IPFS means data is permanently stored. In reality, IPFS only provides content-addressing — data persists ONLY if someone pins it. Unpinned data gets garbage-collected and disappears.

**Why it happens:**
- IPFS documentation emphasizes "decentralized permanent storage"
- No explicit error when adding unpinned data
- Works fine in development (local node pins by default)
- Fails silently in production when pinning service not configured

**Consequences:**
- User data disappears after node restart
- Broken CIDs in smart contract = unrecoverable data loss
- No way to recover lost neural data records
- Product credibility destroyed

**Prevention:**
- ALWAYS configure a pinning service (Pinata, Web3.storage, or self-hosted)
- Implement pin confirmation before storing CID in smart contract
- Add monitoring for pin status health checks
- Document pinning strategy in architecture

**Detection:**
- [ ] No pinning service configured in environment
- [ ] `ipfs.add()` succeeds but no pin status verification
- [ ] No redundancy (single pinning provider only)
- [ ] Data retrieval fails after node restart

**Phase to Address:** Phase 1 (IPFS Integration Setup)

---

### Pitfall 2: Using Public Gateway for Production Data Retrieval

**What goes wrong:** Relying on `ipfs.io` public gateway for production content delivery. Public gateways have rate limits, can be slow, and create a centralization single point of failure.

**Why it happens:**
- Works out of the box with zero configuration
- No authentication required for testing
- Default in most tutorials and documentation
- Seems fine during development with low traffic

**Consequences:**
- Rate limiting blocks legitimate user requests (429 errors)
- Slow load times during peak usage
- Gateway downtime = complete data unavailability
- Defeats decentralization purpose (single gateway dependency)

**Prevention:**
- Use dedicated gateway from pinning service (Pinata provides `gateway.pinata.cloud`)
- Implement gateway fallback strategy (multiple gateways)
- Consider running your own IPFS gateway for critical paths
- Add timeout handling and retry logic with exponential backoff

**Detection:**
- [ ] Hardcoded `https://ipfs.io/ipfs/` in codebase
- [ ] No gateway configuration in environment variables
- [ ] No retry logic for failed fetches
- [ ] No timeout handling for slow gateway responses

**Phase to Address:** Phase 1 (IPFS Integration Setup)

---

### Pitfall 3: Storing Mutable Data as Immutable CIDs

**What goes wrong:** IPFS CIDs are content-addressed and immutable. When user updates their neural data profile or permissions, the CID changes. Storing only the CID in smart contract means no history tracking and broken references on updates.

**Why it happens:**
- IPFS documentation focuses on immutable content
- Easy to store single CID in contract
- Works fine for "upload once, read forever" patterns
- Mutable update requirement not considered until too late

**Consequences:**
- Cannot track data version history
- Permission revocation doesn't undo access if CID already fetched
- Smart contract stores stale CIDs after updates
- No audit trail for researcher access

**Prevention:**
- Use IPNS (IPFS Naming System) for mutable pointers
- Store CID version history in smart contract events (cheaper than storage)
- Implement CID mapping pattern: `userId => cidVersion => cid`
- Consider Filecoin for long-term mutable storage commitments

**Detection:**
- [ ] Smart contract stores single CID per record with no versioning
- [ ] No event emission for CID updates
- [ ] No IPNS or mutable pointer implementation
- [ ] Update function overwrites rather than appends

**Phase to Address:** Phase 2 (Smart Contract Design)

---

### Pitfall 4: No Access Control Enforcement at Retrieval Layer

**What goes wrong:** Smart contract tracks permissions correctly, but IPFS data is publicly accessible via CID. Anyone with the CID can retrieve data directly from IPFS without going through permission checks.

**Why it happens:**
- IPFS is inherently public (content-addressed = anyone can fetch)
- Permission checks only in smart contract, not data layer
- Works in testing because frontend respects permissions
- Security model misunderstanding (contract != data privacy)

**Consequences:**
- Researchers can bypass permission system by sharing CIDs
- Patient data exposed to anyone who discovers CID
- Privacy compliance violations (healthcare data exposure)
- False sense of security from smart contract permissions

**Prevention:**
- Encrypt data BEFORE uploading to IPFS (user holds decryption key)
- Store encryption key in smart contract, released only to grantees
- Implement access-gated decryption pattern:
  1. Check permission in contract
  2. If granted, release decryption key
  3. Frontend decrypts IPFS content client-side
- Consider IPFS private networks or encrypted pins

**Detection:**
- [ ] Data uploaded to IPFS in plaintext
- [ ] CID alone provides full data access
- [ ] No encryption layer in data upload flow
- [ ] Permission check only gates UI, not actual data access

**Phase to Address:** Phase 2 (Smart Contract Design) — CRITICAL FOR HEALTHCARE DATA

---

### Pitfall 5: Storing Large Data Directly in Smart Contract

**What goes wrong:** Attempting to store IPFS CIDs or metadata directly in contract storage without considering gas costs. String/bytes storage is extremely expensive on Ethereum.

**Why it happens:**
- Works fine in local development with no real gas costs
- Small test data fits in contract without issue
- Gas optimization not considered until deployment
- Tutorial code doesn't scale to production data volumes

**Consequences:**
- Deployment costs thousands of dollars in gas
- Per-transaction costs make upload prohibitive
- Contract hits storage limits quickly
- Gas optimization requires complete rewrite

**Prevention:**
- Store only CID references (bytes32 or compressed string) in contract
- Use events for metadata (cheaper than storage, off-chain indexable)
- Consider EIP-712 signatures for off-chain permission proofs
- Batch operations where possible to amortize gas costs

**Detection:**
- [ ] Contract stores full strings instead of compressed references
- [ ] No events for record creation/updates
- [ ] Gas estimation shows high costs per operation
- [ ] No batching for multiple operations

**Phase to Address:** Phase 2 (Smart Contract Design)

---

## Moderate Pitfalls

### Pitfall 6: CID Version Incompatibility

**What goes wrong:** CIDv0 vs CIDv1 format differences cause gateway failures. Some gateways and tools only support one version.

**Prevention:**
- Standardize on CIDv1 (multicodec format, better gateway support)
- Implement CID version detection and conversion
- Test against target gateway before deployment

**Detection:**
- [ ] Mixed CID versions in codebase
- [ ] No CID validation on input
- [ ] Gateway returns 404 for valid CIDs

**Phase to Address:** Phase 1 (IPFS Integration Setup)

---

### Pitfall 7: No Rate Limit Handling for Pinning API

**What goes wrong:** Pinata and other pinning services have API rate limits. Exceeding limits causes upload failures during high-traffic periods.

**Prevention:**
- Implement exponential backoff for API calls
- Queue uploads during rate limit responses
- Monitor API quota usage
- Consider paid tier for production limits

**Detection:**
- [ ] No retry logic for 429 responses
- [ ] Direct API calls without queuing
- [ ] No monitoring for API health

**Phase to Address:** Phase 1 (IPFS Integration Setup)

---

### Pitfall 8: Wallet-Only Authentication Excludes Users

**What goes wrong:** Requiring crypto wallet for all users creates friction. Researchers/patients may not have wallets or understand Web3 UX.

**Prevention:**
- Implement wallet abstraction (account abstraction/ERC-4337)
- Consider social login with wallet creation onboarding
- Provide clear wallet setup guidance
- Support multiple wallet providers (MetaMask, WalletConnect, Coinbase Wallet)

**Detection:**
- [ ] Single wallet provider only (MetaMask)
- [ ] No onboarding flow for new users
- [ ] No fallback for non-crypto users

**Phase to Address:** Phase 3 (Frontend Implementation)

---

## Minor Pitfalls

### Pitfall 9: Hardcoded Network Configuration

**What goes wrong:** Contract addresses and network IDs hardcoded instead of using environment variables or configuration files.

**Prevention:**
- Use `.env` files for network-specific config
- Implement network detection in frontend
- Use deployment artifacts for address lookups

**Phase to Address:** Phase 3 (Frontend Implementation)

---

### Pitfall 10: No Loading States for IPFS Operations

**What goes wrong:** IPFS operations (upload, pin, fetch) can take seconds. No loading feedback makes app appear broken.

**Prevention:**
- Show progress indicators for all async operations
- Implement timeout handling with user feedback
- Add optimistic UI updates where safe

**Phase to Address:** Phase 3 (Frontend Implementation)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| IPFS Setup | Unpinned data loss | Configure pinning service before any uploads |
| IPFS Setup | Public gateway dependency | Use Pinata gateway or multi-gateway fallback |
| Smart Contract | No encryption layer | Design encryption pattern before contract implementation |
| Smart Contract | Gas cost explosion | Use events for metadata, store minimal CID references |
| Smart Contract | Mutable data as immutable CID | Implement versioning or IPNS from start |
| Frontend | Wallet friction | Implement onboarding flow, multiple wallet options |
| Frontend | No loading feedback | Add loading states for all async IPFS operations |
| Frontend | Hardcoded config | Use environment variables, network detection |

---

## Sources

- [IPFS Persistence Model](https://docs.ipfs.tech/concepts/persistence/) — Why pinning is mandatory
- [IPFS Gateway Concepts](https://docs.ipfs.tech/concepts/ipfs-gateway/) — Public vs dedicated gateway tradeoffs
- [5 Common Mistakes When Using IPFS](https://medium.com/@ipfsforce/5-common-mistakes-when-using-ipfs-bf8ce1241d14) — CID versioning, pinning, structure mistakes
- [Pinata Documentation](https://pinata.cloud/) — Rate limits, gateway configuration
- [Web3.storage Migration Notice](https://web3.storage/) — Service deprecation lessons
- [Smart Contract Access Control Patterns](https://github.com/OpenZeppelin/openzeppelin-contracts) — Permission patterns
- [CID Specification](https://docs.ipfs.tech/concepts/content-addressing/) — CIDv0 vs CIDv1
- [IPFS + Ethereum Integration Patterns](https://proto.school/course/anatomy-of-a-cid) — Content addressing fundamentals

---

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Pinning pitfalls | HIGH | Verified across multiple official sources |
| Gateway pitfalls | HIGH | Well-documented in IPFS docs |
| Encryption requirement | HIGH | Standard pattern for private IPFS data |
| Gas optimization | HIGH | Standard Ethereum best practices |
| CID versioning | MEDIUM | Documented but less commonly discussed |
| Wallet UX pitfalls | MEDIUM | Inferred from general Web3 UX patterns |
| Rate limiting | MEDIUM | Standard API pattern, specific limits not verified |
