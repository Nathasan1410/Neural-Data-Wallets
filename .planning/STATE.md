# STATE.md - Neural Data Wallets

**Current Phase:** Phase 1 (Not started)
**Current Mode:** YOLO (auto-approve, just execute)
**Last Transition:** 2026-03-26 - Project initialized

---

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** Users can upload neural data to IPFS and grant/revoke access to researchers — decentralized data ownership with verifiable access control.

**Current focus:** Phase 1 - Smart Contract Foundation

---

## Phase Status

| Phase | Name | Status | Plans | Progress |
|-------|------|--------|-------|----------|
| 1 | Smart Contract Foundation | ○ | 0/0 | 0% |
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
| Smart Contract | 0 | 6 | 0% |

**Coverage:** 0/21 complete (0%)

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

_No sessions yet_

---

*Last updated: 2026-03-26 after roadmap creation*
