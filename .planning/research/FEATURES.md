# Feature Landscape

**Domain:** Web3 x Neurotech Data Wallet dApp
**Researched:** 2026-03-26

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Wallet Connect (SIWE) authentication | Web3 standard for dApp login; no OAuth per project constraints | Low | Use wagmi/siwe; wallet-only auth for v1 |
| Dashboard showing user's uploaded neural data | Core value prop - users must see their data inventory | Low | List with CID, upload date, basic metadata |
| Grant access to researcher wallet | Primary user action for data owners | Medium | Smart contract call to grant() with researcher address |
| Revoke access from researcher | Data ownership means users can withdraw access | Medium | Smart contract call to revoke(); critical for trust |
| IPFS upload for EEG data | Protocol Labs sponsorship requirement; expected storage method | Medium | Pinata or Web3.storage API integration |
| Access control list view | Users need to see who has access to their data | Low | Query smart contract for granted addresses |
| Transaction confirmation feedback | Web3 UX standard - users need tx status | Low | Toast notifications on pending/success/failure |
| Network selector (testnet) | Users need to switch between Base/Sepolia testnets | Low | wagmi network switch component |
| Researcher dashboard to browse accessible data | Researchers need to see what data they can access | Medium | Query contract for grants where researcher is beneficiary |
| Data retrieval/download for authorized researchers | Researchers must be able to fetch IPFS content | Medium | Resolve CID through gateway or direct IPFS fetch |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| EEG data visualization in dashboard | Users see actual brainwave data they're sharing; builds trust | Medium | Simple chart rendering of mock EEG JSON arrays |
| Access grant timestamps | Transparency on when permissions were given/revoked | Low | Store block.timestamp in smart contract events |
| Bulk grant/revoke operations | Power users managing multiple researchers | Medium | Batch transaction support |
| Data usage terms/metadata on upload | Researchers understand data context; compliance readiness | Low | Store JSON metadata alongside CID |
| Export access history as JSON | Audit trail for users; portability | Low | Generate downloadable JSON from events |
| Researcher profile (ENS integration) | Human-readable addresses instead of 0x... | Medium | ENS name resolution for grantee addresses |
| IPFS pin status indicator | Users know if their data is actually pinned | Low | Query Pinata API for pin status |
| "Request access" flow for researchers | Researchers can request access to non-public data | Medium | Two-step: request → owner approves |
| Access expiry support (time-limited grants) | Granular control for data owners | High | Requires smart contract modification for grantWithExpiry |
| Data access notifications | Users alerted when researchers access their data | Medium | Listen to contract events; show in-app notification |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real EEG data processing | Out of scope for 8-hour sprint; adds validation/medical complexity | Use mock/synthetic EEG waveforms; same JSON structure |
| Federated learning integration | Debugging unpredictability too high for hackathon timeline | Keep data access simple: grant → fetch → compute off-chain |
| Multi-agent systems for access control | Adds unpredictability; hard to debug in 8-hour window | Direct smart contract calls only |
| OAuth/social login | Project constraints: wallet-only for v1 | SIWE (Sign-In With Ethereum) only |
| Mobile app | Web-first approach per constraints | Responsive web only |
| Payment/monetization layer | Adds regulatory complexity; distracts from core access control | Mock access only; no tokens/payments in prototype |
| Complex role hierarchies (admin/sub-user) | Over-engineering for prototype | Single owner = single wallet |
| On-chain data storage | Prohibitively expensive; wrong tool for large EEG files | Store data CID on-chain; data lives in IPFS |
| Decentralized identity (DID) beyond ENS | Adds integration complexity | ENS resolution only if time permits |
| Real-time collaboration features | Adds WebSocket/infra complexity | Async access pattern only |

## Feature Dependencies

```
Wallet Connect → Dashboard (requires authenticated user)
IPFS Upload → Grant Access (must have data to grant)
Grant Access → Researcher Dashboard (researcher sees granted data)
Access Control List → Revoke Access (must see grants to revoke)
EEG Visualization → IPFS Upload (must upload to visualize)
Access Events → Access History Export (events feed the export)
ENS Resolution → Researcher Profile (ENS names for addresses)
```

## MVP Recommendation

Prioritize:
1. **Wallet Connect (SIWE) authentication** - Without this, no users
2. **IPFS upload for EEG data** - Core value prop; Protocol Labs sponsorship
3. **Grant/Revoke access flow** - Primary user action; differentiates from Web2
4. **Dashboard showing user's data inventory** - Users need to see what they own
5. **Researcher dashboard to access granted data** - Two-sided marketplace needs both views

Defer:
- **ENS integration** - Nice-to-have; 0x addresses work for prototype
- **Access expiry** - Smart contract complexity; add in v2
- **Notifications** - Requires event listening infra; can be added post-hackathon
- **Bulk operations** - Single grant/revoke sufficient for MVP
- **EEG visualization** - Demo with mock data display; full charts later

## Sources

- Ocean Protocol data marketplace patterns - [Ocean Protocol](https://oceanprotocol.com/)
- WalletConnect session management - [WalletConnect Docs](https://docs.walletconnect.com/)
- ENS Manager profile features - [ENS Docs](https://docs.ens.domains/)
- Pinata IPFS pinning service patterns - [Pinata Docs](https://docs.pinata.cloud/)
- Web3 dApp UX best practices - Multiple search sources on 2025-2026 dApp patterns
