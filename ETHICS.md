# Ethics & Cognitive Sovereignty Framework

**Project:** Neural Data Wallet (CortexVault)
**Hackathon:** Genesis Frontiers of Collaboration - Neurotech Track
**Sponsor:** Protocol Labs

---

## 1. Our Commitment

We are building the Neural Data Wallet to empower individuals with **sovereignty over their neural data**. Our commitment:

- **User Sovereignty**: Users retain full ownership and control of their brain data
- **Transparency**: All data handling practices are visible and auditable on-chain
- **Responsibility**: We develop AI and neurotech with ethical boundaries
- **Privacy by Design**: Decentralized architecture minimizes trust requirements

---

## 2. Cognitive Sovereignty Principles

We adopt the **Cognitive Sovereignty Framework** as defined by neuroethics researchers:

| Principle | Definition | Implementation |
|-----------|------------|----------------|
| **Right to Mental Privacy** | Protection from unauthorized access to brain data | Access control via smart contract |
| **Right to Mental Integrity** | Protection from alteration of neural patterns | Data stored immutably on IPFS |
| **Right to Psychological Continuity** | Protection from disruption of mental processes | User controls all data access |
| **Right to Cognitive Self-Determination** | Freedom to choose how neural data is used | Grant/revoke access at will |

### Why This Matters

Neural data is uniquely sensitive because it can reveal:
- Medical conditions (epilepsy, ADHD, depression, sleep disorders)
- Cognitive states (attention, stress, consciousness levels)
- Biometric identity (brain patterns are unique to each individual)

Without proper safeguards, neural data could enable:
- 🚫 Neural surveillance by employers or governments
- 🚫 Cognitive manipulation through targeted content
- 🚫 Discrimination based on brain patterns (insurance, employment)
- 🚫 AI training on non-consented neural data

---

## 3. Data Privacy Framework

### What Data Is Collected

| Data Type | Purpose | Storage |
|-----------|---------|---------|
| EEG recordings (waveform samples) | Research, analysis | IPFS (via Pinata) |
| Metadata (timestamp, duration, device info) | Data organization | On-chain (Base Sepolia) |
| Wallet addresses (owner, researcher) | Access control | On-chain (public) |
| Access grants/revocations | Permission tracking | On-chain (public) |

### How Data Is Stored

1. **IPFS (InterPlanetary File System)**
   - Large data (EEG waveforms) stored on IPFS via Pinata
   - Content-addressed via CID (Content Identifier)
   - **WARNING**: IPFS data is PUBLIC - anyone with the CID can access it

2. **Blockchain (Base Sepolia)**
   - Access control mappings stored on-chain
   - Immutable audit trail of grants and revocations
   - Public visibility of wallet addresses and timestamps

### Who Can Access Data

| Actor | Can Access Own Data | Can Access Others' Data |
|-------|---------------------|-------------------------|
| Data Owner | ✅ Always | ❌ Never (unless they own it) |
| Granted Researcher | ❌ No | ✅ Only if explicitly granted |
| Public | ❌ No | ⚠️ CID is public, but requires address to query |

### Current Limitations (v1.5)

| Limitation | Risk | Planned Fix |
|------------|------|-------------|
| **No encryption** | IPFS data is public | Client-side encryption (v2.0) |
| **No access expiry** | Grants are permanent until revoked | Time-based expiry (v2.0) |
| **No download tracking** | Cannot audit who accessed data | Access logging (v2.0) |
| **No purpose limitation** | Researchers can use data for any purpose | Purpose tags (future) |

---

## 4. Security Measures

### Current (v1.5)

| Measure | Description |
|---------|-------------|
| **Smart Contract Access Control** | Only owners can grant/revoke access |
| **Decentralized Storage** | No central honeypot database |
| **On-Chain Audit Trail** | All grants/revocations are public and verifiable |
| **Verified Contract** | Contract verified on Base Sepolia via Sourcify |

### Planned (v2.0 Roadmap)

| Feature | Status | Description |
|---------|--------|-------------|
| **Client-Side Encryption** | Planned | Encrypt data before IPFS upload |
| **Key Management** | Planned | User-controlled encryption keys |
| **Access Expiry** | Planned | Time-limited grants |
| **Zero-Knowledge Proofs** | Research | Prove access rights without revealing identity |

---

## 5. Adversarial Use Case Prevention

We explicitly design to prevent:

### Neural Surveillance
- ❌ Employers requiring neural data as job condition
- ❌ Governments mass-collecting brain patterns
- ❌ Third parties tracking cognitive states without consent

### Cognitive Manipulation
- ❌ Using neural data to optimize persuasive content
- ❌ Targeting users based on mental vulnerabilities
- ❌ AI systems that adapt to exploit cognitive biases

### Discrimination
- ❌ Insurance companies denying coverage based on brain data
- ❌ Employers screening candidates via neural patterns
- ❌ Financial institutions using neural data for credit decisions

### Unauthorized AI Training
- ❌ Training foundation models on non-consented neural data
- ❌ Scraping IPFS data for AI datasets
- ❌ Using neural patterns for biometric identification without consent

---

## 6. Ethical Guidelines for Researchers

Researchers accessing neural data via this platform must:

### Informed Consent
- ✅ Obtain explicit informed consent from data owners
- ✅ Clearly explain what data will be accessed and for what purpose
- ✅ Allow users to revoke consent at any time

### Data Usage Limitations
- ✅ Use data only for stated research purposes
- ✅ Do not share or redistribute data without explicit permission
- ✅ Do not attempt to re-identify anonymized data

### Publication and Sharing
- ✅ Cite the Neural Data Wallet project when using data
- ✅ Respect data owners' rights to withdraw from studies
- ✅ Follow institutional review board (IRB) requirements

---

## 7. Compliance Considerations

### GDPR Alignment

| GDPR Principle | Our Status | Notes |
|----------------|------------|-------|
| Purpose Limitation | ⚠️ Partial | No purpose enforcement in contract |
| Data Minimization | ✅ Compliant | Only essential metadata on-chain |
| Storage Limitation | ❌ Not Compliant | IPFS data is permanent |
| Confidentiality | ❌ Not Compliant | No encryption (v1.5) |
| Access Control | ✅ Compliant | Smart contract enforces |
| Portability | ✅ Compliant | Data exportable via CID |

### Neurorights Alignment

We align with the **Neurorights Initiative** (Mithril Health, 2024):
- ✅ Right to mental self-determination
- ✅ Right to cognitive liberty
- ✅ Protection from algorithmic bias
- ✅ Equitable access to cognitive augmentation

---

## 8. Future Roadmap

### v2.0 (Q2 2026)
- [ ] End-to-end encryption for IPFS data
- [ ] User-controlled key management
- [ ] Access expiry with automatic revocation
- [ ] Decryption key distribution via smart contract

### v2.1 (Q3 2026)
- [ ] Zero-knowledge access proofs
- [ ] Purpose-based access control
- [ ] Download and access logging
- [ ] Rate limiting on IPFS gateway access

### v3.0 (Q4 2026)
- [ ] Multi-sig governance for protocol upgrades
- [ ] Decrypted data never touches our servers
- [ ] Community-driven ethics review board

---

## 9. Acknowledgments

This framework draws from:
- **Neurorights Foundation** - https://neurorights.org/
- **Mithril Health Neurorights Initiative** - https://neurorights.dev/
- **IEEE Global Initiative on Ethics of Autonomous and Intelligent Systems**
- **EU AI Act** - Risk-based AI regulation framework

---

## 10. Contact & Governance

For ethics-related questions or concerns:
- **GitHub Issues**: https://github.com/your-org/neural-data-wallet/issues
- **Ethics Review**: Community-driven via GitHub Discussions

**This is a living document.** We welcome feedback from the neurotech community, ethicists, and users.

---

*Last Updated:* 2026-03-30
*Version:* 1.0
