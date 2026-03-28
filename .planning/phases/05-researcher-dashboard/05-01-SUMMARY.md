---
phase: 05
plan: 01
name: ABI Definitions & useResearcherData Hook
type: execute
status: complete
tags: [researcher-dashboard, abi, hooks, ipfs]
requires: []
provides:
  - NEURAL_DATA_ABI with getAllAccessibleData, getDataByOwnerPaginated, hasAccessToData
  - useResearcherData hook for fetching accessible data
affects:
  - 05-02-PLAN.md (components will consume hook)
  - RES-01, RES-02 requirements
tech-stack:
  added: []
  patterns:
    - wagmi useReadContract for contract queries
    - useEffect for IPFS side-effects
    - Pinata gateway for IPFS fetching
key-files:
  created:
    - src/lib/hooks/useResearcherData.ts
    - src/lib/hooks/useResearcherData.test.tsx
  modified:
    - src/lib/contracts/neuralDataRegistry.ts
    - src/lib/contracts/neuralDataRegistry.test.ts
decisions:
  - Used getAllAccessibleData single contract call instead of multiple getData calls for efficiency
  - IPFS fetching done in useEffect to avoid blocking contract read
  - Pinata gateway URL configurable via NEXT_PUBLIC_PINATA_GATEWAY env var
metrics:
  duration: ~15 minutes
  tests_added: 10
  tests_total: 23 (13 ABI + 7 hook + 3 existing)
  build_status: success
completed: 2026-03-28T22:15:00Z
---

# Phase 5 Plan 1: ABI Definitions & useResearcherData Hook Summary

## One-liner

Added three new contract ABI functions (getAllAccessibleData, getDataByOwnerPaginated, hasAccessToData) and created useResearcherData hook that fetches accessible data from smart contract and retrieves IPFS content from Pinata gateway.

## Tasks Completed

### Task 1: Add getAllAccessibleData to ABI (TDD)

**Files Modified:**
- `src/lib/contracts/neuralDataRegistry.ts`
- `src/lib/contracts/neuralDataRegistry.test.ts`

**Implementation:**
Added three new function definitions to NEURAL_DATA_ABI:

1. **getAllAccessibleData(address researcher)** - Returns all data IDs and Data structs accessible to a researcher (both owned and granted)
2. **getDataByOwnerPaginated(address owner, uint256 offset, uint256 limit)** - Paginated data retrieval for large datasets
3. **hasAccessToData(address user, address researcher)** - Explicit access check function

**Tests Added:** 4 new tests
- getAllAccessibleData function exists with correct signature
- getDataByOwnerPaginated function exists with correct signature
- hasAccessToData function exists with correct signature
- ABI length updated to 12 entries

**Verification:**
```
npm test src/lib/contracts/neuralDataRegistry.test.ts
> 16 tests passed
npm run build
> Build succeeded
```

### Task 2: Create useResearcherData Hook (TDD)

**Files Created:**
- `src/lib/hooks/useResearcherData.ts`
- `src/lib/hooks/useResearcherData.test.tsx`

**Implementation:**
Hook follows the same pattern as usePatientData.ts with these features:

1. Uses `useAccount()` to get connected wallet address
2. Calls `getAllAccessibleData(userAddress)` via wagmi's `useReadContract`
3. Parses contract result: `[dataIds, dataList]` tuple
4. Fetches IPFS data from Pinata gateway for each CID in useEffect
5. Handles errors gracefully:
   - Contract read errors returned in `error` field
   - IPFS fetch errors stored per-record in `ipfsError`
6. Returns `{ accessibleData, isLoading, error, ipfsLoading }`

**Interface:**
```typescript
export interface AccessibleData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
  ipfsData?: any      // Parsed JSON from IPFS
  ipfsError?: string  // Error message if IPFS fetch failed
}
```

**Tests Added:** 7 integration tests
- Returns empty data when wallet not connected
- Returns loading state initially
- Fetches accessible data when wallet connected
- Fetches IPFS data from Pinata gateway
- Handles IPFS 404 errors gracefully
- Handles contract read errors gracefully
- Provides ipfsLoading state

**Verification:**
```
npm test src/lib/hooks/useResearcherData.test.tsx
> 7 tests passed
npm run build
> Build succeeded
```

## Deviations from Plan

None - plan executed exactly as written.

## Requirements Progress

| Requirement | Status | Notes |
|-------------|--------|-------|
| RES-01 | 50% | Hook provides accessible data list; UI component pending in 05-02 |
| RES-02 | 50% | IPFS fetching implemented; display component pending in 05-02 |
| RES-03 | Partial | hasAccessToData ABI added for access verification |

## Commits

```
b9cab04 feat(05-01): add getAllAccessibleData, getDataByOwnerPaginated, hasAccessToData to ABI
e5b5219 feat(05-01): create useResearcherData hook with IPFS integration
```

## Next Steps

Plan 05-02 will create:
- `AccessibleDataList` component to display accessible data
- `IPFSDataViewer` component to render EEG data from IPFS
- Both components will consume `useResearcherData` hook
