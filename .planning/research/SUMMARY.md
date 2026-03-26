# Project Research Summary

**Project:** Neural Data Wallet
**Domain:** Web3 x Neurotech Data Wallet dApp
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

This is a Web3 dApp enabling patients to store neural/EEG data on IPFS and grant researchers selective access via smart contract permissions. The architecture follows established patterns: two-step storage (IPFS for data, on-chain CID references), wallet-based authentication (SIWE), and event-driven access control.

The recommended approach uses Next.js + wagmi + viem for the frontend, Foundry for smart contract development, and Pinata for managed IPFS pinning. This stack aligns with 2026 Web3 best practices and is optimized for an 8-hour hackathon sprint. The critical risk is the security model: IPFS data is inherently public, so encryption before upload is mandatory for healthcare data privacy. Without client-side encryption, anyone with a CID can bypass smart contract permissions.

Key mitigation priorities: (1) configure pinning service before any uploads to prevent data loss, (2) use dedicated gateway instead of public ipfs.io, (3) implement encryption layer in smart contract design phase, and (4) enforce access control at the contract level, not just frontend.

## Key Findings

### Recommended Stack

**Core technologies:**
- **Next.js 16.2.x** — React framework with API routes for IPFS proxy, built-in TypeScript support
- **wagmi 3.6.x + viem 2.47.x** — Modern React hooks for Ethereum; viem is 10x smaller/faster than ethers.js
- **RainbowKit 2.2.x** — Best-in-class wallet connector with 20+ wallet support
- **Pinata (pinata-web3 0.5.x)** — Managed IPFS pinning service; avoids running own IPFS node
- **Foundry v1.6.x** — Solidity toolchain with forge (build/test), cast (interact), anvil (local fork)

**Critical version notes:** Use `pinata-web3` NOT deprecated `@pinata/sdk`. Standardize on CIDv1 format for better gateway compatibility.

### Expected Features

**Must have (table stakes):**
- Wallet Connect (SIWE) authentication — Web3 standard for dApp login
- Dashboard showing user's uploaded neural data — Core value prop
- Grant/revoke access to researcher wallet — Primary user action
- IPFS upload for EEG data — Protocol Labs sponsorship requirement
- Access control list view — Users need to see who has access
- Researcher dashboard to browse accessible data — Two-sided marketplace need

**Should have (differentiators):**
- EEG data visualization in dashboard — Builds trust, shows actual data
- Access grant timestamps — Transparency on permissions
- ENS integration for researcher profiles — Human-readable addresses
- IPFS pin status indicator — Users know data is actually pinned
- Data access notifications — Alert users when researchers access data

**Defer (v2+):**
- Access expiry support — Smart contract complexity
- Bulk grant/revoke operations — Single operations sufficient for MVP
- Mobile app — Web-first per constraints
- Payment/monetization layer — Adds regulatory complexity

### Architecture Approach

The architecture follows a two-step storage pattern: EEG data lives on IPFS, only CID references stored on-chain. Smart contracts enforce access control via RBAC mappings, with events emitted for off-chain indexing. Frontend communicates via wagmi hooks to wallet and RPC provider.

**Major components:**
1. **Next.js Frontend** — UI rendering, wallet integration via wagmi, IPFS client calls
2. **Wallet Extension** — Key management, transaction signing (MetaMask/Rabby/Coinbase)
3. **IPFS Pinning Service (Pinata)** — File storage, content addressing, retrieval via dedicated gateway
4. **NeuralDataRegistry Smart Contract** — Data registry, access control logic, event emission
5. **RPC Provider (Alchemy/Infura)** — Blockchain node access, state queries, tx broadcast

### Critical Pitfalls

1. **Unpinned IPFS data = data loss** — ALWAYS configure pinning service before uploads; verify pin status before storing CID in contract
2. **Public gateway dependency** — NEVER use ipfs.io for production; use Pinata's dedicated gateway with retry logic
3. **No encryption layer** — IPFS is public by default; encrypt data BEFORE upload, release decryption keys only to grantees via smart contract
4. **Mutable data as immutable CID** — Implement CID versioning or IPNS for updateable records; store version history in events
5. **Frontend-only access control** — Enforce permissions in smart contract; frontend checks are bypassable

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Smart Contract Foundation
**Rationale:** All other components depend on contract ABI and deployed address. Must exist before frontend integration.
**Delivers:** NeuralDataRegistry.sol with registerData(), grantAccess(), revokeAccess(), getDataByOwner(); Foundry tests; deployment to Base Sepolia
**Addresses:** Wallet Connect auth, Grant/revoke access, Access control list
**Avoids:** Frontend-only access control pitfall, gas cost explosion (uses events for metadata)

### Phase 2: IPFS Integration Setup
**Rationale:** Data layer must work before upload flow can be built. Pinning configuration is critical early decision.
**Delivers:** Pinata client setup, Next.js API route for upload (hides JWT), CID validation, dedicated gateway configuration
**Addresses:** IPFS upload for EEG data, Pin status indicator
**Avoids:** Unpinned data loss, public gateway dependency, CID version incompatibility

### Phase 3: Frontend Shell & Wallet Auth
**Rationale:** Wallet connection is prerequisite for all user-facing features. wagmi config needed for contract hooks.
**Delivers:** Next.js scaffolding, wagmi/viem configuration, RainbowKit ConnectButton, network selector
**Addresses:** Wallet Connect (SIWE) authentication, Network selector
**Avoids:** Hardcoded network configuration, wallet friction (multiple wallet support)

### Phase 4: Patient Dashboard
**Rationale:** Primary user flow. Requires Phase 1-3 complete (contract, IPFS, auth).
**Delivers:** Upload neural data flow, view data inventory list, grant/revoke access UI, transaction confirmation feedback
**Addresses:** Dashboard showing data, Grant access, Revoke access, ACL view, Transaction feedback
**Avoids:** No loading feedback (implements progress indicators)

### Phase 5: Researcher Dashboard
**Rationale:** Secondary flow depends on patient data existing. Read-only access simplifies implementation.
**Delivers:** Browse granted data view, IPFS gateway fetch, mock EEG data display
**Addresses:** Researcher dashboard, Data retrieval/download
**Avoids:** Public gateway issues (uses dedicated gateway from Phase 2)

### Phase 6: Polish & Deployment
**Rationale:** Final hardening for demo. Error handling and loading states improve perceived reliability.
**Delivers:** Error handling, loading states, demo data seeding, testnet deployment verification
**Addresses:** All MVP features production-ready
**Avoids:** All critical pitfalls verified addressed

### Phase Ordering Rationale

- **Contract first** — Frontend needs ABI and deployed address; wagmi contract hooks depend on contract interface
- **IPFS before frontend** — Upload flow can't be built without working pinning; gateway config affects data retrieval
- **Auth before dashboards** — All user actions require wallet connection; wagmi account state needed everywhere
- **Patient before researcher** — Patient creates the data that researchers access; dependency flow
- **Polish last** — Loading states and error handling require full flow to exist first

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2:** Encryption pattern for IPFS data — needs specific library selection (e.g., Lit Protocol, uint8arrays crypto)
- **Phase 1:** Gas optimization for batch operations — may need cast calls to estimate costs on Base Sepolia

**Phases with standard patterns (skip research-phase):**
- **Phase 3:** wagmi + RainbowKit setup — well-documented, drop-in components
- **Phase 4:** CRUD dashboard with contract calls — standard wagmi useWriteContract pattern
- **Phase 5:** Read-only data fetch — standard useReadContract + fetch from gateway

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified from npm registry; aligns with 2026 Web3 best practices |
| Features | HIGH | Based on Ocean Protocol, WalletConnect, ENS patterns; clear table stakes identified |
| Architecture | HIGH | Two-step IPFS+on-chain pattern is well-established; wagmi/Pinata docs verified |
| Pitfalls | HIGH | Sourced from IPFS docs, Pinata docs, OpenZeppelin patterns; encryption requirement standard |

**Overall confidence:** HIGH

### Gaps to Address

- **Encryption library selection** — Research needed during Phase 1/2 planning: Lit Protocol vs. direct crypto (AES via Web Crypto API) for client-side encryption
- **Mock EEG data structure** — Define JSON schema for synthetic EEG waveforms to use in demo (frequency bands, sample rate, channel count)
- **Pinata free tier limits** — Verify current rate limits and storage quotas for hackathon usage

## Sources

### Primary (HIGH confidence)
- **npm registry** — viem 2.47.6, wagmi 3.6.0, RainbowKit 2.2.10, pinata-web3 0.5.4 versions verified
- **IPFS Docs** — Persistence model, pinning requirements, gateway concepts
- **Pinata Documentation** — Rate limits, gateway configuration, SDK usage
- **wagmi/viem Docs** — React hooks, contract interaction patterns
- **Foundry Book** — forge test, cast, anvil usage

### Secondary (MEDIUM confidence)
- **Ocean Protocol patterns** — Data marketplace access control flows
- **OpenZeppelin contracts** — RBAC patterns for access control
- **Ethereum.org dApp docs** — General architecture patterns

### Tertiary (LOW confidence)
- **Community blog posts** — CID versioning best practices (needs validation against spec)
- **Web3 dApp UX patterns** — Inferred from multiple 2025-2026 sources

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
