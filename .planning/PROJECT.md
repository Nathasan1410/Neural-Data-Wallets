# Neural Data Wallets

## What This Is

A Web3 x Neurotech dApp that allows users to store mock EEG (brainwave) data on IPFS and manage researcher access permissions via smart contracts. Built as an 8-hour sprint prototype for Protocol Labs sponsorship.

## Core Value

Users can upload neural data to IPFS and grant/revoke access to researchers — decentralized data ownership with verifiable access control.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Smart contract with Foundry for data registry and access control
- [ ] IPFS integration for storing EEG data JSON files
- [ ] Frontend dashboard for patients to manage data and permissions
- [ ] Frontend dashboard for researchers to access granted data

### Out of Scope

- Real EEG data — using mock/synthetic waveforms for prototype
- Federated learning — too complex for 8-hour sprint
- Multi-agent systems — debugging unpredictability too high
- Mobile app — web-first approach
- OAuth login — wallet-only authentication for v1

## Context

**Hackathon Context:** 2-8 hour sprint with minimal debugging risk.

**Tech Environment:**
- QwenCode running on WSL with Foundry access
- Target deployment: Base or Sepolia testnet
- IPFS via Pinata or Web3.storage (Protocol Labs ecosystem)

**Why This Stack:**
- Foundry = fast Solidity development + testing
- Next.js = standard React framework, quick scaffolding
- IPFS = hits Protocol Labs sponsorship criteria
- Simple grant/revoke pattern = predictable debugging

## Constraints

- **[Timeline]**: 8 hours max — scope must stay minimal
- **[Tech]**: Must use Foundry (user's existing setup with QwenCode on WSL)
- **[Sponsor]**: Must use IPFS/Filecoin to hit Protocol Labs criteria
- **[Deployment]**: Testnet only (Base/Sepolia) for prototype

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Foundry for smart contracts | User already has WSL + Foundry setup, fastest path | — Pending |
| IPFS for data storage | Protocol Labs sponsorship target, simple integration | — Pending |
| Next.js + Wagmi for frontend | Standard Web3 stack, well-documented | — Pending |
| Mock EEG data | Real EEG too complex; synthetic data sufficient for demo | — Pending |
| Single contract (NeuralDataRegistry) | Minimal surface area, focused scope | — Pending |

---
*Last updated: 2026-03-26 after project initialization*
