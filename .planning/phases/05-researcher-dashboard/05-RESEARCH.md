# Phase 5: Researcher Dashboard - Research

**Researched:** 2026-03-28
**Domain:** Researcher dashboard - IPFS data access with smart contract access control
**Confidence:** HIGH

## Summary

The Researcher Dashboard enables researchers to view and access neural data they have been granted permission to view. The implementation leverages the existing `NeuralDataRegistry` contract's `getAllAccessibleData()` function to query all accessible data, then fetches the actual EEG data from IPFS using the Pinata gateway.

**Primary recommendation:** Use `getAllAccessibleData()` contract call to fetch all data IDs accessible to the researcher, then iterate through data records using `getData()` to retrieve CIDs, and fetch actual JSON content via Pinata gateway URL (`https://gateway.pinata.cloud/ipfs/{cid}`).

## User Constraints (from CONTEXT.md)

*No CONTEXT.md exists for this phase - research is unconstrained.*

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RES-01 | Researcher can view list of CIDs they have access to | `getAllAccessibleData()` returns all data IDs + metadata for granted researcher |
| RES-02 | Researcher can fetch and display EEG data from IPFS | Pinata gateway URL pattern + `fetch()` API for JSON retrieval |
| RES-03 | Researcher sees "access denied" if trying to access without grant | `getData()` reverts with "Access denied" - needs try/catch handling |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| wagmi | 3.6.0 | Ethereum React hooks | Already configured for patient dashboard, provides `useReadContract`, `useAccount` |
| viem | 2.47.6 | TypeScript Ethereum client | wagmi dependency, type-safe contract interactions |
| @rainbow-me/rainbowkit | 2.2.10 | Wallet connection UI | Already integrated, provides ConnectButton |
| pinata-web3 | 0.5.4 | IPFS operations | Already configured for uploads, same SDK for fetches |
| Next.js | 16.2.1 | React framework | Project standard, App Router pattern |
| TypeScript | 5.7.2 | Type safety | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hot-toast | 2.6.0 | Toast notifications | Already installed, use for error/success feedback |
| @tanstack/react-query | 5.95.2 | Data fetching cache | wagmi dependency, handles contract read caching |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pinata Gateway | ipfs.io public gateway | Pinata more reliable, already configured |
| `getAllAccessibleData()` | Manual iteration over all data IDs | Contract function is O(n) optimized, manual would be O(n²) |
| Client-side IPFS fetch | API route proxy | Direct gateway fetch is simpler, no API overhead |

**Installation:**
All dependencies already installed. No additional packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/app/researcher/
└── page.tsx              # ResearcherDashboard page component

src/lib/hooks/
├── usePatientData.ts     # Existing - reference pattern
└── useResearcherData.ts  # NEW - researcher data fetching hook

src/components/
├── UploadedDataList.tsx  # Existing - reference pattern
├── AccessibleDataList.tsx # NEW - researcher data display
└── IPFSDataViewer.tsx    # NEW - JSON data display component
```

### Pattern 1: useReadContract for Data Discovery
**What:** Use wagmi's `useReadContract` to call `getAllAccessibleData(researcherAddress)` which returns all data IDs and metadata accessible to the researcher.

**When to use:** Initial data discovery - what CIDs can this researcher access?

**Example:**
```typescript
// Source: contracts/src/NeuralDataRegistry.sol:166-189
const { data: accessibleData, isLoading, error } = useReadContract({
  address: NEURAL_DATA_CONTRACT,
  abi: NEURAL_DATA_ABI,
  functionName: 'getAllAccessibleData',
  args: userAddress ? [userAddress] : undefined,
  query: {
    enabled: !!userAddress,
  }
})
```

### Pattern 2: Gateway URL for IPFS Content Fetch
**What:** Construct Pinata gateway URL and fetch JSON content using standard `fetch()` API.

**When to use:** After obtaining CID from contract, fetch actual EEG data content.

**Example:**
```typescript
// Source: src/app/api/ipfs/upload/route.ts:41
const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
const ipfsUrl = `https://${gateway}/ipfs/${cid}`

const response = await fetch(ipfsUrl)
if (!response.ok) throw new Error(`IPFS fetch failed: ${response.status}`)
const eegData = await response.json()
```

### Pattern 3: Access Denied Error Handling
**What:** Wrap contract reads in try/catch to handle "Access denied" reverts gracefully.

**When to use:** When fetching individual data records that may not be accessible.

**Example:**
```typescript
// Source: contracts/src/NeuralDataRegistry.sol:113-126 (getData access control)
const fetchDataWithAccess = async (dataId: bigint) => {
  try {
    const { data } = await readContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'getData',
      args: [dataId],
    })
    return { cid: data.cid, timestamp: data.timestamp, access: true }
  } catch (error) {
    if (error?.message?.includes('Access denied')) {
      return { cid: null, timestamp: null, access: false, error: 'Access denied' }
    }
    throw error
  }
}
```

### Anti-Patterns to Avoid
- **Don't fetch IPFS data in contract read loop** - First get all CIDs from contract, then fetch IPFS content separately
- **Don't use `ipfs.io` public gateway** - Unreliable, rate-limited. Use configured Pinata gateway.
- **Don't skip error boundaries** - Contract calls can fail (network, access denied). Always handle errors.
- **Don't hardcode gateway URLs** - Use `process.env.NEXT_PUBLIC_PINATA_GATEWAY` for configurability.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IPFS content fetching | Custom IPFS node connection | Pinata Gateway URL + fetch() | Gateway is HTTP, no special client needed |
| Access control checking | Manual owner/researcher mapping iteration | `getAllAccessibleData()` contract function | Contract already implements O(n) optimized query |
| Contract read caching | Custom caching layer | wagmi + React Query | Built-in caching, refetch, stale-time |
| JSON parsing errors | Basic `JSON.parse()` | Try/catch with fallback display | IPFS data may be malformed |

**Key insight:** The smart contract already provides `getAllAccessibleData()` which does the heavy lifting of finding all data accessible to a researcher. Don't manually iterate through all data IDs and check `hasAccess()` for each one.

## Common Pitfalls

### Pitfall 1: Missing `getAllAccessibleData` in ABI
**What goes wrong:** TypeScript errors when calling `getAllAccessibleData()` because it's not in the ABI export.

**Why it happens:** The contract has the function (NeuralDataRegistry.sol:166-189), but `neuralDataRegistry.ts` ABI export is incomplete.

**How to avoid:** Add `getAllAccessibleData` and `getDataByOwnerPaginated` to `NEURAL_DATA_ABI` in `src/lib/contracts/neuralDataRegistry.ts`.

**Warning signs:** TypeScript error: "Object literal may only specify known properties".

### Pitfall 2: IPFS Gateway 404 Errors
**What goes wrong:** IPFS gateway returns 404 for valid CID.

**Why it happens:**
1. CID not pinned (Pinata garbage collects unpinned data)
2. Wrong gateway URL format (missing `/ipfs/` path)
3. Using wrong CID format (should be `bafy...` or `Qm...`)

**How to avoid:**
- Ensure Pinata pinning on upload (automatic with `pinata.upload.file()`)
- Use exact URL format: `https://gateway.pinata.cloud/ipfs/{cid}`
- Log CID before fetching to verify format

**Warning signs:** `404 Not Found` from gateway, CID looks truncated.

### Pitfall 3: Contract Read Fails Silently
**What goes wrong:** `useReadContract` returns undefined without error.

**Why it happens:** wagmi suppresses errors by default. Need to check `error` property and enable retry logic.

**How to avoid:**
```typescript
const { data, error, isLoading } = useReadContract({
  // config
  query: {
    retry: 2,
    retryDelay: 1000,
  }
})
// Always check error property
if (error) console.error('Contract read failed:', error.message)
```

**Warning signs:** `isLoading` false, `data` undefined, no error displayed.

### Pitfall 4: BigInt Serialization in JSON
**What goes wrong:** `JSON.stringify()` fails on contract data containing `bigint` timestamps.

**Why it happens:** Solidity `uint256` returns as BigInt, which `JSON.stringify()` cannot serialize.

**How to avoid:**
```typescript
// Convert BigInt to string or number before display
const displayData = accessibleData.map(d => ({
  ...d,
  dataId: d.dataId.toString(),
  timestamp: new Date(Number(d.timestamp) * 1000).toLocaleString()
}))
```

**Warning signs:** `TypeError: Do not know how to serialize a BigInt`

### Pitfall 5: CORS Issues with Direct IPFS Fetch
**What goes wrong:** Browser blocks IPFS gateway fetch with CORS error.

**Why it happens:** Some IPFS gateways don't set CORS headers. Pinata gateway supports CORS but may need configuration.

**How to avoid:** Use Pinata's dedicated gateway (configured in `.env`), not `ipfs.io`. If CORS persists, proxy through Next.js API route.

**Warning signs:** Console error: "Access to fetch at 'ipfs://...' has been blocked by CORS policy"

## Code Examples

### useResearcherData Hook
```typescript
// Source: Pattern derived from src/lib/hooks/usePatientData.ts
'use client'

import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

export interface AccessibleData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
  ipfsData?: any
  ipfsError?: string
}

export function useResearcherData() {
  const { address: userAddress } = useAccount()
  const [accessibleData, setAccessibleData] = useState<AccessibleData[]>([])
  const [ipfsLoading, setIpfsLoading] = useState<Record<string, boolean>>({})

  // Step 1: Get all accessible data from contract
  const { data: accessibleDataResult, isLoading, error } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getAllAccessibleData',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
    }
  })

  // Step 2: Fetch IPFS content for each CID
  useEffect(() => {
    if (!accessibleDataResult) return

    const [dataIds, dataList] = accessibleDataResult
    const data: AccessibleData[] = dataList.map((d, i) => ({
      dataId: dataIds[i],
      cid: d.cid,
      timestamp: d.timestamp,
      metadata: d.metadata,
    }))

    setAccessibleData(data)

    // Fetch IPFS content for each CID
    data.forEach(async (item) => {
      const key = item.dataId.toString()
      setIpfsLoading(prev => ({ ...prev, [key]: true }))
      try {
        const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
        const url = `https://${gateway}/ipfs/${item.cid}`
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = await response.json()
        setAccessibleData(prev => prev.map(d =>
          d.dataId === item.dataId ? { ...d, ipfsData: json } : d
        ))
      } catch (err) {
        setAccessibleData(prev => prev.map(d =>
          d.dataId === item.dataId ? { ...d, ipfsError: (err as Error).message } : d
        ))
      } finally {
        setIpfsLoading(prev => ({ ...prev, [key]: false }))
      }
    })
  }, [accessibleDataResult])

  return {
    accessibleData,
    isLoading,
    error: error?.message ?? null,
    ipfsLoading,
  }
}
```

### AccessibleDataList Component
```typescript
// Source: Pattern derived from src/components/UploadedDataList.tsx
'use client'

import { AccessibleData } from '@/lib/hooks/useResearcherData'

interface AccessibleDataListProps {
  data: AccessibleData[]
  isLoading: boolean
  error: string | null
  ipfsLoading: Record<string, boolean>
}

export function AccessibleDataList({ data, isLoading, error, ipfsLoading }: AccessibleDataListProps) {
  const truncateCid = (cid: string) => {
    if (cid.length <= 10) return cid
    return `${cid.slice(0, 6)}...${cid.slice(-4)}`
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const getIpfsGatewayUrl = (cid: string) => {
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
    return `https://${gateway}/ipfs/${cid}`
  }

  if (isLoading) {
    return <div data-testid="loading">Loading accessible data...</div>
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>
  }

  if (data.length === 0) {
    return <div data-testid="empty">No data accessible. Ask patients to grant you access.</div>
  }

  return (
    <table data-testid="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>CID</th>
          <th>Timestamp</th>
          <th>IPFS Data</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.dataId.toString()}>
            <td>#{item.dataId.toString()}</td>
            <td>{truncateCid(item.cid)}</td>
            <td>{formatTimestamp(item.timestamp)}</td>
            <td>
              {ipfsLoading[item.dataId.toString()] ? (
                <span>Loading...</span>
              ) : item.ipfsError ? (
                <span className="text-red-500">Failed: {item.ipfsError}</span>
              ) : item.ipfsData ? (
                <pre className="text-xs max-w-xs overflow-auto">
                  {JSON.stringify(item.ipfsData, null, 2).slice(0, 100)}...
                </pre>
              ) : (
                <span>Not loaded</span>
              )}
            </td>
            <td>
              <a
                href={getIpfsGatewayUrl(item.cid)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on IPFS
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Researcher Dashboard Page
```typescript
// Source: Pattern derived from src/app/patient/page.tsx
'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useResearcherData } from '@/lib/hooks/useResearcherData'
import { AccessibleDataList } from '@/components/AccessibleDataList'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ResearcherPage() {
  const { isConnected } = useAccount()
  const { accessibleData, isLoading, error, ipfsLoading } = useResearcherData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>[LOADING]</div>
  }

  if (!isConnected) {
    return (
      <div>
        <h1>Researcher Dashboard</h1>
        <nav>
          <Link href="/">Home</Link> |
          <Link href="/patient">Patient</Link> |
          <Link href="/researcher">Researcher</Link>
        </nav>
        <p>Connect your wallet to view accessible neural data</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div>
      <h1>Researcher Dashboard</h1>
      <nav>
        <Link href="/">Home</Link> |
        <Link href="/patient">Patient</Link> |
        <Link href="/researcher">Researcher</Link>
      </nav>

      <section>
        <h2>Accessible Neural Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Data from patients who have granted you access
        </p>
        <AccessibleDataList
          data={accessibleData}
          isLoading={isLoading}
          error={error}
          ipfsLoading={ipfsLoading}
        />
      </section>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual data ID iteration | `getAllAccessibleData()` bulk query | Contract design (2026-03-26) | Single contract call returns all accessible data |
| ipfs.io public gateway | Pinata dedicated gateway | Project setup | Reliable, no rate limiting |
| Web3.js contract calls | wagmi v3 + viem v2 | Project setup | Type-safe, React hooks pattern |
| Manual JSON parsing | fetch() + response.json() | Standard | Native browser API |

**Deprecated/outdated:**
- `ipfs.io` gateway: Unreliable, use dedicated Pinata gateway
- Web3.js: Project uses wagmi/viem stack
- Class components: Project uses React hooks pattern

## Open Questions

1. **Should IPFS fetches happen client-side or via API route?**
   - What we know: Current upload uses API route, but fetch could be direct
   - What's unclear: CORS behavior with Pinata gateway from browser
   - Recommendation: Start with direct client-side fetch (simpler), move to API route only if CORS issues arise

2. **How to handle large EEG data files?**
   - What we know: Mock EEG data is small JSON
   - What's unclear: Real EEG data could be MBs or GBs
   - Recommendation: Add loading states, consider pagination for large datasets (deferred to v2)

3. **Should researcher see "access denied" entries or only accessible data?**
   - What we know: `getAllAccessibleData()` only returns accessible data
   - What's unclear: UX requirement - should researchers see denied requests?
   - Recommendation: Only show accessible data (RES-03 is about error handling for direct access attempts, not UI display)

## Validation Architecture

> skip - workflow.nyquist_validation is not enabled for this phase

## Sources

### Primary (HIGH confidence)
- **Smart Contract:** `contracts/src/NeuralDataRegistry.sol` - `getAllAccessibleData()`, `getData()` functions verified
- **Existing Patterns:** `src/lib/hooks/usePatientData.ts`, `src/app/patient/page.tsx`, `src/components/UploadedDataList.tsx`
- **IPFS Upload:** `src/app/api/ipfs/upload/route.ts` - Pinata SDK usage pattern
- **ABI:** `src/lib/contracts/neuralDataRegistry.ts` - Note: needs `getAllAccessibleData` added

### Secondary (MEDIUM confidence)
- **Pinata Gateway Pattern:** URL format `https://gateway.pinata.cloud/ipfs/{cid}` from existing code
- **wagmi useReadContract:** Pattern from `usePatientData.ts` hook

### Tertiary (LOW confidence)
- **CORS handling:** May need API route proxy if direct fetch fails (not yet tested)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already configured and in use
- Architecture: HIGH - Follows existing patient dashboard pattern
- Pitfalls: MEDIUM - Based on code review, not yet runtime tested
- Contract functions: HIGH - Verified in `NeuralDataRegistry.sol` and Foundry tests

**Research date:** 2026-03-28
**Valid until:** 90 days (stable stack, contract is deployed and verified)

---

## ABI Gap Identified

**CRITICAL:** The `NEURAL_DATA_ABI` in `src/lib/contracts/neuralDataRegistry.ts` is missing the following functions that exist in the deployed contract:

1. `getAllAccessibleData(address researcher)` - Required for RES-01
2. `getDataByOwnerPaginated(address owner, uint256 offset, uint256 limit)` - Optional optimization
3. `hasAccessToData(address user, address researcher)` - Optional utility

**Action required before planning:** Add these function definitions to the ABI export.

```typescript
// Add to NEURAL_DATA_ABI array:
{
  type: 'function' as const,
  name: 'getAllAccessibleData',
  inputs: [{ name: 'researcher', type: 'address' as const }],
  outputs: [
    { name: 'dataIds', type: 'uint256[]' as const },
    {
      name: 'dataList',
      type: 'tuple[]' as const,
      components: [
        { name: 'cid', type: 'string' as const },
        { name: 'timestamp', type: 'uint256' as const },
        { name: 'metadata', type: 'bytes' as const }
      ]
    }
  ],
  stateMutability: 'view' as const
},
{
  type: 'function' as const,
  name: 'getDataByOwnerPaginated',
  inputs: [
    { name: 'owner', type: 'address' as const },
    { name: 'offset', type: 'uint256' as const },
    { name: 'limit', type: 'uint256' as const }
  ],
  outputs: [{
    type: 'tuple[]' as const,
    components: [
      { name: 'cid', type: 'string' as const },
      { name: 'timestamp', type: 'uint256' as const },
      { name: 'metadata', type: 'bytes' as const }
    ]
  }],
  stateMutability: 'view' as const
},
{
  type: 'function' as const,
  name: 'hasAccessToData',
  inputs: [
    { name: 'user', type: 'address' as const },
    { name: 'researcher', type: 'address' as const }
  ],
  outputs: [{ name: '', type: 'bool' as const }],
  stateMutability: 'view' as const
}
```
