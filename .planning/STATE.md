# STATE.md - Neural Data Wallets

**Current Phase:** Phase 3 - Frontend Shell & Auth ○ PENDING
**Current Mode:** YOLO (auto-approve, just execute)
**Last Transition:** 2026-03-26 - Phase 2 execution started

---

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** Users can upload neural data to IPFS and grant/revoke access to researchers — decentralized data ownership with verifiable access control.

**Current focus:** Phase 2 - IPFS Integration

---

## Phase Status

| Phase | Name | Status | Plans | Progress |
|-------|------|--------|-------|----------|
| 1 | Smart Contract Foundation | ✓ | 3/3 | 100% |
| 2 | IPFS Integration | ✓ | 4/4 | 100% |
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
| IPFS Data | 2/4 | 4 | 50% |
| Access Control | 5/5 | 5 | 100% |
| Researcher | 0 | 3 | 0% |
| Smart Contract | 6/6 | 6 | 100% |

**Coverage:** 11/21 complete (52%)

---

## Deployed Contracts

| Network | Contract | Address |
|---------|----------|---------|
| Base Sepolia | NeuralDataRegistry | `0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8` |

**Block Explorer:** https://sepolia.basescan.org/address/0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8

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

### Phase 1 Progress ✓ COMPLETE
- [x] Foundry project initialized
- [x] NeuralDataRegistry.sol implemented
- [x] 22 Foundry tests written - ALL PASSING
- [x] Deployed to Base Sepolia: `0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8`
- [x] Contract verified on BaseScan

### Phase 2: IPFS Integration - IN PROGRESS
- [x] Pinata SDK setup (pinata-web3 0.5.x)
- [x] Next.js API route for uploads (/api/ipfs/upload)
- [x] Mock EEG data generator (eegDataToJson)
- [x] wagmi + RainbowKit setup
- [ ] Upload component with loading states
- [ ] Access control UI (grant/revoke)

**Wave 1 Complete (02-01 + 02-02):**
- package.json with web3 deps
- src/lib/pinata.ts - Pinata client
- src/lib/wagmi.ts - wagmi config
- src/lib/contracts/neuralDataRegistry.ts - ABI
- src/app/providers.tsx - React providers
- src/app/layout.tsx - Root layout
- src/app/api/ipfs/upload/route.ts - Upload API
- src/lib/mockEegData.ts - EEG data generator
- Build: ✓ SUCCESS

---

*Last updated: 2026-03-26 after roadmap creation*
