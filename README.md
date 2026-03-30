# Neural Data Wallet (CortexVault)

**Genesis Frontiers of Collaboration Hackathon** - Neurotech Track
**Sponsor:** Protocol Labs

> Empowering individuals with sovereignty over their neural data through decentralized access control and IPFS storage.

---

## 📋 Problem Statement

### The Neural Data Challenge

Neurotechnology is advancing rapidly:
- Consumer EEG headsets (OpenBCI, Muse, Emotiv) are becoming affordable
- Brain-Computer Interfaces (BCIs) like Neuralink are moving to human trials
- AI can now decode mental states from neural patterns

**But who owns and controls this data?**

Today's neural data platforms:
- 🚫 Store data on centralized servers (honeypots for breaches)
- 🚫 Use opaque data sharing policies
- 🚫 Make it hard to revoke access once granted
- 🚫 Enable potential neural surveillance and discrimination

### The Cognitive Sovereignty Crisis

Neural data is uniquely sensitive:
- Reveals medical conditions (epilepsy, ADHD, depression)
- Exposes cognitive states (attention, stress, consciousness)
- Provides biometric identity (brain patterns are unique)
- Could enable algorithmic manipulation of mental states

Without proper safeguards, neural data could enable:
- Employment discrimination based on brain patterns
- Insurance denial for neurological predispositions
- Government surveillance of thoughts
- AI training on non-consented brain data

---

## 💡 Solution: Neural Data Wallet

A decentralized platform for **sovereign neural data ownership**:

| Feature | Benefit |
|---------|---------|
| **User Ownership** | You own your brain data, period |
| **Smart Contract Access Control** | Grant/revoke access with crypto-cleared permissions |
| **IPFS Storage** | Decentralized, censorship-resistant storage |
| **Transparent Audit Trail** | All access grants visible on-chain |
| **Researcher-Friendly** | One-click access to granted datasets |

### Key Innovations

1. **Granular Consent**
   - Per-dataset access control
   - Instant revocation capability
   - No intermediaries controlling permissions

2. **Decentralized Architecture**
   - Smart contracts on Base Sepolia testnet
   - IPFS for data storage (via Pinata)
   - No central database to breach

3. **EEG Visualization**
   - Waveform display (time-domain)
   - Brain wave band analysis (Delta, Theta, Alpha, Beta, Gamma)
   - Researcher-ready data exploration

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Patient Dashboard                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Upload EEG   │→ │ IPFS Upload  │→ │ Store CID + Meta │  │
│  │ (JSON/CSV)   │  │ (Pinata)     │  │ on Smart Contract│  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Grant Access │→ │ Smart        │→ │ Researcher Can   │  │
│  │ to Researcher│  │ Contract     │  │ Access Data      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘

Smart Contract: NeuralDataRegistry.sol (Base Sepolia)
- uploadData(cid, metadata) → returns dataId
- grantAccess(researcherAddress)
- revokeAccess(researcherAddress)
- getDataByOwnerPaginated(owner, offset, limit)
- getAllAccessibleData(researcherAddress)
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16.2.1 + TypeScript | React framework |
| **Styling** | Tailwind CSS | Responsive UI |
| **Wallet** | wagmi 3.6.x + RainbowKit 2.2.x | Web3 authentication |
| **Smart Contracts** | Foundry (Solidity) | Access control logic |
| **Blockchain** | Base Sepolia Testnet | Deployment network |
| **Storage** | IPFS (Pinata) | Decentralized data storage |
| **Testing** | Vitest + Playwright | Unit + E2E tests |

---

## 🚀 Usage

### For Patients (Data Owners)

1. **Connect Wallet** - Use MetaMask, Rainbow, or any WalletConnect-compatible wallet
2. **Upload Neural Data**
   - Select EEG file (JSON/CSV format with timestamps, channels, samples)
   - Data uploads to IPFS via Pinata
   - Metadata + CID stored on smart contract
3. **Grant Access**
   - Enter researcher's wallet address
   - Click "Grant Access"
   - Transaction confirms on-chain
4. **Revoke Access**
   - Click "Revoke Access" for any granted address
   - Access removed immediately

### For Researchers

1. **Connect Wallet** - Use the wallet address you were granted access to
2. **View Accessible Data** - All datasets granted to you appear automatically
3. **Access Neural Data**
   - Click "View Neural Data"
   - EEG visualization renders with brain wave bands
   - Download raw data from IPFS

---

## 📁 EEG Data Format

Our expected EEG data structure:

```json
{
  "timestamp": 1234567890,
  "duration": 10,
  "channels": ["Fp1", "Fp2", "F3", "F4", "C3", "C4", "P3", "P4", "O1", "O2"],
  "samples": [
    [0.5, -0.3, 0.2, ...],
    [0.6, -0.2, 0.1, ...]
  ],
  "metadata": {
    "sampleRate": 256,
    "resolution": 24,
    "deviceModel": "OpenBCI"
  }
}
```

### Brain Wave Bands Calculated

| Band | Frequency Range | Mental State |
|------|-----------------|--------------|
| Delta | 0.5 - 4 Hz | Deep sleep |
| Theta | 4 - 8 Hz | Drowsiness, meditation |
| Alpha | 8 - 13 Hz | Relaxed wakefulness |
| Beta | 13 - 30 Hz | Active thinking, focus |
| Gamma | 30 - 100 Hz | High-level cognition |

---

## 🔒 Security & Ethics

### Current Security Measures

- ✅ Smart contract access control (owner-only grants)
- ✅ Decentralized storage (no central honeypot)
- ✅ On-chain audit trail (public, verifiable)
- ✅ Verified contract (Sourcify exact match)

### Known Limitations (v1.5)

| Limitation | Risk | Mitigation |
|------------|------|------------|
| No encryption | IPFS data is public | Documented; v2.0 planned |
| No access expiry | Grants permanent until revoked | User must manually revoke |
| No download tracking | Cannot audit access | Future feature |

### Cognitive Sovereignty Framework

We adopt the **Neurorights Principles**:
1. **Right to Mental Privacy** - Protection from unauthorized brain data access
2. **Right to Mental Integrity** - Protection from neural pattern alteration
3. **Right to Psychological Continuity** - User controls all data access
4. **Right to Cognitive Self-Determination** - Freedom to choose data usage

See [ETHICS.md](./ETHICS.md) for full ethics framework.

---

## 🧪 Testing

```bash
# Install dependencies
pnpm install

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

### Test Coverage

| Category | Coverage | Status |
|----------|----------|--------|
| Components | 92.92% | ✅ Excellent |
| Hooks | 86-100% | ✅ Good |
| API Routes | 87.5% | ✅ Good |
| Smart Contracts | 100% | ✅ Excellent |
| **Overall** | **88.95%** | ✅ **Excellent** |

**178 tests passing** across unit, integration, and E2E categories.

---

## 📦 Deployment

### Smart Contract

| Network | Address |
|---------|---------|
| **Base Sepolia** | `0x2700C2B1268B115cF06136b881341903aBC7DC4a` |
| **Verification** | ✅ Verified via Sourcify (exact_match) |

### Frontend (Local Development)

```bash
# Set environment variables
cp .env.example .env.local

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Vercel Deployment

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# Go to https://vercel.com/new and import this repository

# 3. Configure environment variables in Vercel:
PINATA_JWT=your_jwt_token
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_NEURAL_DATA_CONTRACT=0x2700C2B1268B115cF06136b881341903aBC7DC4a
NEXT_PUBLIC_CHAIN_ID=84532
```

See [.planning/analysis/DEPLOYMENT-READINESS.md](./.planning/analysis/DEPLOYMENT-READINESS.md) for full deployment checklist.

---

## 🏆 Hackathon Alignment

### Genesis Frontiers of Collaboration - Neurotech Track

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Neural data wallet | ✅ Done | Upload EEG data to IPFS, store CID on-chain |
| Grant/Revoke access | ✅ Done | Smart contract functions with UI |
| IPFS integration | ✅ Done | Pinata SDK configured |
| Protocol Labs alignment | ✅ Done | IPFS + Filecoin mention in docs |
| Cognitive Sovereignty | ✅ Done | ETHICS.md with framework |
| Live deployment | ⚠️ Pending | Vercel deployment ready |
| Demo video | ⚠️ Pending | To be recorded |

### Protocol Labs Integration

| Integration | Status | Details |
|-------------|--------|---------|
| **IPFS** | ✅ Implemented | Pinata SDK for upload, gateway for retrieval |
| **Filecoin** | ⚠️ Mentioned | Referenced in ETHICS.md as future storage layer |

### Judging Criteria Alignment

| Criterion | Current Score | Target | Gap |
|-----------|---------------|--------|-----|
| Conceptual Rigor | 7/10 | 9/10 | Clear value prop, working prototype |
| Technical Implementation | 8/10 | 9/10 | 178 tests, verified contract |
| Safety & Ethics | 9/10 | 9/10 | ETHICS.md comprehensive |
| Protocol Labs Integration | 8/10 | 9/10 | IPFS done, Filecoin mentioned |
| Neurotech Relevance | 8/10 | 9/10 | EEG visualization working |

**Current Total:** 40/50 (Target for top 3 placement)

---

## 👥 Team

**CS Students - Neural Hackers**
- Building at the intersection of neurotech and web3
- Passionate about cognitive sovereignty and mental privacy

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

## 🔗 Links

- **Live Demo:** [Deploy to Vercel - URL TBD]
- **Smart Contract:** [Base Sepolia Explorer](https://sepolia.basescan.org/address/0x2700C2B1268B115cF06136b881341903aBC7DC4a)
- **GitHub:** [Repository](https://github.com/your-org/neural-data-wallet)
- **Ethics:** [ETHICS.md](./ETHICS.md)

---

## 📞 Contact

For hackathon-related questions:
- **GitHub Issues:** https://github.com/your-org/neural-data-wallet/issues

---

*Hackathon Submission - Genesis Frontiers of Collaboration*
*Last Updated:* 2026-03-30
