# STATE.md - Neural Data Wallets

**Current Phase:** Phase 1 (Contract implemented, tests passing - ready for deployment)
**Current Mode:** YOLO (auto-approve, just execute)
**Last Transition:** 2026-03-26 - Phase 1 plans created

---

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** Users can upload neural data to IPFS and grant/revoke access to researchers — decentralized data ownership with verifiable access control.

**Current focus:** Phase 1 - Smart Contract Foundation

---

## Phase Status

| Phase | Name | Status | Plans | Progress |
|-------|------|--------|-------|----------|
| 1 | Smart Contract Foundation | ◆ | 2/3 | 67% |
| 2 | IPFS Integration | ○ | 0/0 | 0% |
| 3 | Frontend Shell & Auth | ○ | 0/0 | 0% |
| 4 | Patient Dashboard | ○ | 0/0 | 0% |
| 5 | Researcher Dashboard | ○ | 0/0 | 0% |
| 6 | Polish & Deployment | ○ | 0/0 | 0% |

---

## Requirement Status

**v1 Requirements:** 21 total

| Category | Complete | Total | Progress |
|----------|----------|-------|----------|
| Authentication | 0 | 3 | 0% |
| IPFS Data | 0 | 4 | 0% |
| Access Control | 0 | 5 | 0% |
| Researcher | 0 | 3 | 0% |
| Smart Contract | 5/6 | 6 | 83% |

**Coverage:** 5/21 complete (24%)

---

## Current Context

**Tech Stack (2026 Best Practices):**
- Foundry v1.6.x for smart contracts
- Next.js 16.2.x + TypeScript 5.7.x
- wagmi 3.6.x + viem 2.47.x + RainbowKit 2.2.x
- pinata-web3 0.5.x for IPFS

**Key Decisions Made:**
- Using Pinata (not self-hosted IPFS) for hackathon speed
- Dedicated gateway required (not ipfs.io)
- Mock EEG data (not real processing)
- Base Sepolia target network

**Pitfalls to Avoid:**
- IPFS data is PUBLIC - encryption deferred to v2
- Must pin data or it gets garbage-collected
- Use API routes for IPFS uploads (hide JWT)

---

## Session Memory

### Phase 1 Progress
- [x] Foundry project initialized
- [x] NeuralDataRegistry.sol implemented with:
  - `uploadData(string cid)` - stores CID with owner
  - `grantAccess(address researcher)` - grant access
  - `revokeAccess(address researcher)` - revoke access
  - `hasAccess(address user, address researcher)` - check permission
  - `getData(uint256 dataId)` - fetch with access control
  - `getDataByOwnerPaginated()` - pagination support
  - `getAllAccessibleData(address researcher)` - researcher view
- [x] 22 Foundry tests written - ALL PASSING
- [ ] Deployment to testnet (awaiting PRIVATE_KEY config)

---

*Last updated: 2026-03-26 after roadmap creation*
