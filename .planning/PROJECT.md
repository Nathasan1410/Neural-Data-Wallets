# Neural Data Wallets

## What This Is

A Web3 x Neurotech dApp that allows users to store mock EEG (brainwave) data on IPFS and manage researcher access permissions via smart contracts. Built as an 8-hour sprint prototype for Protocol Labs sponsorship.

## Core Value

Users can upload neural data to IPFS and grant/revoke access to researchers — decentralized data ownership with verifiable access control.

## Requirements

### Validated

- ✓ AUTH-01, AUTH-02, AUTH-03 — Wallet connection via RainbowKit, address display, session persistence — v1.5
- ✓ IPFS-01, IPFS-02, IPFS-03, IPFS-04 — IPFS upload via Pinata, CID storage on-chain, data display, dedicated gateway — v1.5
- ✓ ACCESS-01, ACCESS-02, ACCESS-03, ACCESS-04, ACCESS-05 — Grant/revoke access UI, access list display, contract ownership checks, events — v1.5
- ✓ RES-01, RES-02, RES-03 — Researcher dashboard, accessible CIDs, IPFS data fetching, access denied handling — v1.5
- ✓ CONTRACT-01, CONTRACT-02, CONTRACT-03, CONTRACT-04, CONTRACT-05, CONTRACT-06, CONTRACT-07 — Contract deployed to Base Sepolia, all functions implemented, Foundry tests pass — v1.5

### Active

(All v1 requirements complete — defining v2.0 requirements)

### Out of Scope

- Real EEG data — using mock/synthetic waveforms for prototype (validated approach)
- Federated learning — too complex for 8-hour sprint (validated approach)
- Multi-agent systems — debugging unpredictability too high (validated approach)
- Mobile app — web-first approach (validated approach)
- OAuth login — wallet-only authentication for v1 (validated approach)
- Data encryption on IPFS — deferred to v2.0 (data is public on IPFS)

## Context

**Shipped v1.5:** 2026-03-29

**Tech Stack:**
- Foundry v1.5.1-stable for smart contracts
- Next.js 16.2.x + TypeScript 5.7.x
- wagmi 3.6.x + viem 2.47.x + RainbowKit 2.2.x
- pinata-web3 0.5.x for IPFS
- Vitest 4.x + Testing Library for tests
- react-hot-toast 2.6.0 for notifications
- Playwright 1.58.2 for E2E tests

**Codebase Stats:**
- Test coverage: 88.95% overall (178 tests passing)
- Contract deployed: `0x2700C2B1268B115cF06136b881341903aBC7DC4a` on Base Sepolia
- Build time: ~26s with Turbopack

**User Feedback:**
- Prototype ready for user testing
- All critical user flows verified (patient upload, grant access, researcher view)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Foundry for smart contracts | User has WSL + Foundry setup, fastest path | ✓ Good — Contract deployed & verified |
| IPFS for data storage | Protocol Labs sponsorship target, simple integration | ✓ Good — Working with Pinata SDK |
| Next.js + Wagmi for frontend | Standard Web3 stack, well-documented | ✓ Good — All components working |
| Mock EEG data | Real EEG too complex; synthetic data sufficient for demo | ✓ Good — Data structure realistic |
| Single contract (NeuralDataRegistry) | Minimal surface area, focused scope | ✓ Good — All functions implemented |
| Pinata (not self-hosted IPFS) | Hackathon speed, no infrastructure overhead | ✓ Good — Upload flow working |
| Dedicated gateway required | Not ipfs.io for reliability | ✓ Good — Custom gateway configured |
| Graceful error handling | IPFS succeeds even if contract fails | ✓ Good — Robust error handling |
| Vitest over Jest | Faster, better Vite integration | ✓ Good — 178 tests passing |
| WCAG 2.1 AA 44px touch targets | Accessibility compliance | ✓ Good — All components compliant |
| 85% test coverage target | High confidence in code quality | ✓ Achieved 88.95% |

## Constraints

- **[Timeline]**: 8 hours max — scope stayed minimal ✓
- **[Tech]**: Must use Foundry — installed and working ✓
- **[Sponsor]**: Must use IPFS/Filecoin — Pinata integration complete ✓
- **[Deployment]**: Testnet only — Base Sepolia deployed ✓

---

*Last updated: 2026-03-29 after v1.5 Gap Closure milestone*
