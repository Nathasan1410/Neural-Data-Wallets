# v0 UI Integration Guide - Neural Data Wallet

**Project:** Neural Data Wallet on Base Sepolia
**Status:** Core functionality complete, 77 tests passing - Ready for UI polish

---

## Current State

### Working Features (Backend Complete)

| Feature | Status | Component |
|---------|--------|-----------|
| IPFS Upload (Pinata) | Working | `/api/ipfs/upload` |
| Mock EEG Generation | Working | `generateMockEegData()` |
| Contract Integration | Working | `NeuralDataRegistry.sol` @ `0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8` |
| Wallet Connection | Working | RainbowKit + wagmi |
| Patient Data Hook | Working | `usePatientData()` |
| Access Control | Working | `grantAccess()`, `revokeAccess()` |

### Test Coverage: 77 tests passing

```
Test Files: 10 passed
Tests: 77 passed
Duration: 13.61s
```

---

## Component Inventory for v0

### 1. Patient Dashboard (`/patient`)

**File:** `src/app/patient/page.tsx`

**Current UI (Placeholder):**
```
[LOADING] → while mounting

Not connected:
├── "Patient Dashboard" header
├── Nav: Home | Patient | Researcher
├── "Connect your wallet" message
└── ConnectButton

Connected:
├── "Patient Dashboard" header
├── Nav: Home | Patient | Researcher
├── "Your Uploaded Data" section
│   ├── UploadButton (Generate Mock EEG + Upload File)
│   ├── Refresh button
│   └── UploadedDataList (table or empty state)
```

**Props to preserve:**
- `onUploadComplete?: (cid: string, url: string) => void`

---

### 2. UploadButton Component

**File:** `src/components/UploadButton.tsx`

**Current UI (Placeholder):**
```
┌─────────────────────────────────┐
│ [Upload File] [Generate Mock EEG] │
└─────────────────────────────────┘
[error message in red if failed]
```

**States:**
- Default: Two buttons enabled
- Uploading: Both buttons disabled, text shows "Uploading..." / "Generating..."
- Error: Red error message below buttons

**Props:**
```typescript
interface UploadButtonProps {
  onUploadComplete?: (cid: string, url: string) => void
  userId?: string
}
```

**Data attributes (for testing):**
- `data-testid="upload-file-btn"`
- `data-testid="generate-mock-btn"`
- `data-testid="upload-error"`

---

### 3. UploadedDataList Component

**File:** `src/components/UploadedDataList.tsx`

**Current UI (Placeholder):**
```
Loading: <div data-testid="loading">Loading data...</div>
Error: <div data-testid="error">Error: {error}</div>
Empty: <div data-testid="empty">No uploads yet</div>

Data table:
┌────────────────────────────────────────────────┐
│ ID │ CID │ Timestamp │ Actions                │
├────┼─────┼───────────┼────────────────────────┤
│ #1 │ Qm...│ Mar 26,  │ [View on IPFS] (link) │
│    │ 6789│ 2026 2:30 │                        │
└────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface UploadedDataListProps {
  data: UploadedData[]
  isLoading: boolean
  error: string | null
}
```

**Data attributes:**
- `data-testid="loading"`
- `data-testid="error"`
- `data-testid="empty"`
- `data-testid="data-table"`

---

### 4. AccessList Component

**File:** `src/components/AccessList.tsx`

**Current UI (Placeholder):**
```
Loading: <div data-testid="access-loading">Loading accesses...</div>
Empty: <div data-testid="no-access">No access granted</div>

Has access:
┌─────────────────────────────────┐
│ Granted to:                     │
│ • 0x1234...7890                 │
│ • 0xABCD...EF12                 │
└─────────────────────────────────┘
```

**Props:**
```typescript
interface AccessListProps {
  dataId: bigint
  grantedAddresses: string[]
  isLoading: boolean
}
```

**Data attributes:**
- `data-testid="access-loading"`
- `data-testid="no-access"`
- `data-testid="access-list"`

---

## v0 Prompts for UI Enhancement

### Prompt 1: Patient Dashboard Main Layout

```
Create a modern patient dashboard UI for a Web3 neural data wallet.

Requirements:
- Header with "Patient Dashboard" title and wallet ConnectButton
- Navigation tabs: Home | Patient | Researcher
- Main section: "Your Uploaded Data"
- Action bar with upload buttons and refresh
- Data table with uploaded items
- Loading, empty, and error states

Style: Clean, medical/tech aesthetic, blue/green color scheme
Framework: React + Tailwind CSS
```

### Prompt 2: UploadButton Component

```
Create an upload button component for EEG neural data files.

Features:
- Primary button: "Upload File" (triggers file picker for .json/.csv)
- Secondary button: "Generate Mock EEG" (creates sample data)
- Disabled state during upload with loading spinner
- Error message display below buttons
- Success callback with CID and URL

Style: Modern buttons with icons, green for generate, blue for upload
Framework: React + Tailwind CSS
Props: onUploadComplete?, userId?
```

### Prompt 3: Data Table Component

```
Create a data table to display uploaded neural data records.

Columns:
- ID: Sequential number (#1, #2, #3)
- CID: IPFS content identifier (truncated: QmABCD...6789)
- Timestamp: Formatted date/time
- Actions: "View on IPFS" link (opens in new tab)

States:
- Loading: Animated skeleton rows
- Empty: "No uploads yet" centered message with illustration
- Error: Red error banner
- Data: Clean table with hover effects

Framework: React + Tailwind CSS
```

### Prompt 4: Access Control Component

```
Create an access control display showing granted researcher addresses.

Features:
- Show list of wallet addresses with copy button
- Each address as a badge/pill with avatar
- "No access granted" empty state
- Loading state with skeletons
- Optional: "Grant Access" button to add new addresses

Style: Address badges with gradient backgrounds
Framework: React + Tailwind CSS
```

---

## Integration Steps

### After v0 generates components:

1. **Replace placeholder components** with v0-generated ones
2. **Preserve all `data-testid` attributes** for testing
3. **Keep all existing props and callbacks** unchanged
4. **Maintain the three states** (loading, empty, error) in each component
5. **Test after each replacement:**
   ```bash
   npm run dev
   npm test
   ```

### File replacement mapping:

| Current File | Replace with v0 output |
|--------------|------------------------|
| `src/app/patient/page.tsx` | PatientDashboard v0 component |
| `src/components/UploadButton.tsx` | UploadButton v0 component |
| `src/components/UploadedDataList.tsx` | DataTable v0 component |
| `src/components/AccessList.tsx` | AccessBadges v0 component |

---

## Testing Checklist (Post-UI)

- [ ] `npm test` - All 77 tests still pass
- [ ] `npm run dev` - No hydration errors
- [ ] Upload file → CID appears in table
- [ ] Generate Mock EEG → Upload succeeds
- [ ] View on IPFS → Opens correct gateway URL
- [ ] Refresh → Data updates
- [ ] Wallet disconnect → Shows connect message
- [ ] Loading states → Visible during fetch

---

## Tech Stack Reference

```json
{
  "framework": "Next.js 16.2.1",
  "styling": "Tailwind CSS 4.0",
  "web3": "wagmi 3.6 + RainbowKit 2.2 + viem 2.47",
  "testing": "Vitest 4.1.1 + Testing Library",
  "ipfs": "Pinata SDK (pinata-web3)",
  "chain": "Base Sepolia (84532)"
}
```

---

## Notes for v0

1. **Do NOT change component props or interfaces** - they are tied to existing hooks and API calls
2. **Do NOT remove `data-testid` attributes** - they are used by tests
3. **Do NOT change the logic flow** - loading → empty/error/data states must be preserved
4. **DO add Tailwind classes** for styling
5. **DO add animations** for loading states
6. **DO add icons** for better UX (Lucide, Heroicons, etc.)

---

## Future Enhancements (Post-v0)

- [ ] Dark mode toggle
- [ ] File drag-and-drop zone
- [ ] Upload progress indicator
- [ ] Batch upload support
- [ ] Data preview modal
- [ ] Search/filter in data table
- [ ] Pagination for large datasets
- [ ] Export data as JSON/CSV
- [ ] Access grant/revoke UI directly in table
