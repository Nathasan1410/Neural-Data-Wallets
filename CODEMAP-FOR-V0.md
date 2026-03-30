# Neural Data Wallet - Codebase Mapping for v0

**Project:** Neural Data Wallet (CortexVault)
**Purpose:** Backend is COMPLETE - UI needs redesign by v0

---

## ⚠️ IMPORTANT: Backend Complete, UI NOT Complete

| Area | Backend | UI |
|------|---------|-----|
| **Smart Contract** | ✅ Working | N/A |
| **IPFS/Pinata** | ✅ Working | N/A |
| **Data Hooks** | ✅ Working | Needs redesign |
| **EEG Viz** | ✅ Working | Needs restyling |
| **Pages** | ✅ Routing works | Basic/rudimentary |
| **Dashboard Stats** | N/A | 🔲 Not implemented |
| **Access History** | N/A | 🔲 Not implemented |
| **Profile Page** | N/A | 🔲 Not implemented |

---

## 🏠 Pages (3 Routes) - All Working

| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | Works, basic UI |
| `/patient` | `src/app/patient/page.tsx` | Works, basic UI |
| `/researcher` | `src/app/researcher/page.tsx` | Works, basic UI |

**v0 Task:** Rewrite all 3 pages with new design system (light mode, professional)

---

## 🔄 Data Integration Flow (KEEP THIS)

```
Patient uploads EEG file (JSON)
        ↓
/api/ipfs/upload → Pinata → IPFS CID
        ↓
serverSigner.ts → Smart Contract (uploadData)
        ↓
Patient grants researcher access (grantAccess)
        ↓
Researcher sees data (getAllAccessibleData)
        ↓
Researcher fetches IPFS data (via CID)
```

---

## 🔌 Data Hooks (Ready to Use)

### 1. usePatientData
**File:** `src/lib/hooks/usePatientData.ts`

```typescript
interface UploadedData {
  dataId: bigint       // Contract data ID
  cid: string         // IPFS CID
  timestamp: bigint   // Unix timestamp
  metadata: string    // Optional metadata
}

// Usage:
const { uploadedData, isLoading, error, refetch } = usePatientData()
```

### 2. useResearcherData
**File:** `src/lib/hooks/useResearcherData.ts`

```typescript
interface AccessibleData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
  ipfsData?: any      // EEG data from IPFS
  ipfsError?: string
}

// Usage:
const { accessibleData, isLoading, ipfsLoading } = useResearcherData()
```

### 3. useAccessControl
**File:** `src/lib/hooks/useAccessControl.ts`

```typescript
// Usage:
const { isLoading, error, grantAccess, revokeAccess } = useAccessControl()

// Call:
grantAccess("0x1234...")  // Grant researcher access
revokeAccess("0x1234...") // Revoke access
```

---

## 🧩 Components

### Working (Keep Logic, Restyle UI)

| Component | File | What It Does |
|-----------|------|--------------|
| `UploadButton` | `src/components/UploadButton.tsx` | Upload EEG JSON to IPFS |
| `UploadedDataList` | `src/components/UploadedDataList.tsx` | List patient's uploaded data |
| `AccessibleDataList` | `src/components/AccessibleDataList.tsx` | List data shared with researcher |
| `NeuralDataViewer` | `src/components/NeuralDataViewer.tsx` | EEG Waveform + Band Power |
| `IPFSDataViewer` | `src/components/IPFSDataViewer.tsx` | Fetch/display IPFS data |
| `AccessControl` | `src/components/AccessControl.tsx` | Grant/revoke researcher access |
| `GrantAccessButton` | `src/components/GrantAccessButton.tsx` | Grant access button |
| `RevokeAccessButton` | `src/components/RevokeAccessButton.tsx` | Revoke access button |
| `AccessList` | `src/components/AccessList.tsx` | List of researchers with access |

### Need to Create (v0)

| Component | File | What It Does |
|-----------|------|--------------|
| `Header` | `src/components/Header.tsx` | Navigation bar with logo |
| `Footer` | `src/components/Footer.tsx` | Site footer |
| `DashboardStats` | `src/components/DashboardStats.tsx` | Summary cards (4 metrics) |
| `ActivityTimeline` | `src/components/ActivityTimeline.tsx` | Access history log |
| `ProfilePage` | `src/app/profile/page.tsx` | User profile page (NEW) |

---

## 🧠 EEG Visualization (Backend Complete!)

**Component:** `NeuralDataViewer.tsx`

### Features:
- Waveform display (SVG polyline) - 10 channels
- Band Power calculation (5 bands)
- Band badges: Delta, Theta, Alpha, Beta, Gamma
- Metadata display (device, sample rate, duration)
- IPFS data fetching

**v0 Task:** Restyle only, logic is working!

---

## 🔗 Smart Contract

**Contract:** `0x2700C2B1268B115cF06136b881341903aBC7DC4a`
**Network:** Base Sepolia (chainId: 84532)

---

## 🎨 Design System (v0 Reference)

See `UI-INTEGRATION-GUIDELINES.md` for:
- Color palette: Primary Blue #1E40AF, Background #FFFFFF
- Typography: Inter font
- Component specs for cards, buttons, inputs

---

## 📦 Demo Data

**File:** `demo-eeg-data.json`

---

## 🔧 Env Variables

```
PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_IPFS_GATEWAY=gateway.pinata.cloud
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxx
NEXT_PUBLIC_NEURAL_DATA_CONTRACT=0x2700C2B1268B115cF06136b881341903aBC7DC4a
NEXT_PUBLIC_CHAIN_ID=84532
PRIVATE_KEY=your_private_key
```

---

*Last Updated: 2026-03-30*