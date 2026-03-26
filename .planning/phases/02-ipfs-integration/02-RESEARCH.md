# Phase 2: IPFS Integration - Research

**Researched:** 2026-03-26
**Domain:** IPFS storage with Pinata, Web3 smart contract integration
**Confidence:** HIGH

## Summary

Phase 2 integrates IPFS storage via Pinata for mock EEG data upload, with CID storage in the deployed NeuralDataRegistry smart contract. The flow is: user uploads JSON → Next.js API route → Pinata API → CID returned → wagmi transaction stores CID on-chain.

Key findings: Pinata's `pinata-web3` SDK (0.5.x) replaces the deprecated `@pinata/sdk`. Authentication uses JWT tokens that must be kept server-side (Next.js API routes). The dedicated Pinata gateway (`gateway.pinata.cloud`) must be used instead of public `ipfs.io`. The smart contract already implements all required access control functions with proper events.

**Primary recommendation:** Use Next.js API routes to proxy Pinata uploads (hides JWT), then use wagmi's `useWriteContract` hook to store CIDs on-chain with proper error handling and loading states.

<user_constraints>
## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for this phase - research scope is fully open within the phase requirements.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| IPFS-01 | User can upload mock EEG data (JSON) to IPFS via Pinata | Pinata upload API documented below with FormData pattern |
| IPFS-02 | System stores returned CID in smart contract linked to user address | NeuralDataRegistry.uploadData() function ready, wagmi integration pattern provided |
| IPFS-04 | System uses dedicated Pinata gateway (not ipfs.io) | Gateway URL format: `https://gateway.pinata.cloud/ipfs/{cid}` |
| ACCESS-01 | User can grant access to researcher by wallet address | NeuralDataRegistry.grantAccess() implemented with event emission |
| ACCESS-02 | User can revoke access from researcher address | NeuralDataRegistry.revokeAccess() implemented with event emission |
| ACCESS-04 | Smart contract reverts if non-owner tries to access data | NeuralDataRegistry.getData() has require() check - "Access denied" revert |
| ACCESS-05 | Access events emitted for UI updates | AccessGranted/AccessRevoked events with indexed addresses for UI listening |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Next.js** | 16.2.x | React framework with API routes | Built-in API routes for server-side Pinata JWT handling, industry standard for Web3 dApps |
| **pinata-web3** | 0.5.x | Pinata IPFS SDK | Official Pinata SDK (replaces deprecated @pinata/sdk), simple upload API, handles pinning automatically |
| **wagmi** | 3.6.x | React hooks for Ethereum | Built on viem, provides useWriteContract/useReadContract, handles chain switching and connection state |
| **viem** | 2.47.x | Ethereum TypeScript client | Lightweight (13M monthly downloads), modern replacement for ethers.js, excellent type safety |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@tanstack/react-query** | 5.95.x | Data fetching/cache | Required peer dep for wagmi, handles contract call caching and refetch on block |
| **@rainbow-me/rainbowkit** | 2.2.x | Wallet connection UI | Drop-in wallet modal, supports 20+ wallets, built on wagmi |
| **multiformats** | 11.x | CID/content addressing | Handle IPFS hash formats if conversion needed between v0/v1 CIDs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pinata-web3 | ipfs-http-client | Lower-level control but requires more setup, Pinata SDK is simpler |
| wagmi | ethers.js directly | ethers is 3x larger bundle, wagmi provides better React integration |
| Next.js API routes | Direct client upload | Client upload exposes JWT - never do this |

**Installation:**
```bash
# Core Web3 stack
pnpm add viem@2 wagmi@3 @rainbow-me/rainbowkit@2 @tanstack/react-query@5

# IPFS storage
pnpm add pinata-web3@0.5 multiformats

# Optional: TypeScript types already included
```

## Architecture Patterns

### Recommended Project Structure
```
Neural-Data-Wallet/
├── contracts/                    # Foundry (already exists)
│   ├── src/NeuralDataRegistry.sol
│   ├── test/NeuralDataRegistry.t.sol
│   └── script/Deploy.s.sol
├── src/                          # Next.js app (to create)
│   ├── app/
│   │   ├── layout.tsx           # RainbowKit provider
│   │   ├── page.tsx             # Landing/dashboard
│   │   └── api/
│   │       └── ipfs/
│   │           └── upload/route.ts  # Pinata proxy
│   ├── components/
│   │   ├── WalletButton.tsx
│   │   ├── DataUpload.tsx       # IPFS upload form
│   │   └── AccessControl.tsx    # Grant/revoke UI
│   └── lib/
│       ├── pinata.ts            # Pinata client config
│       ├── wagmi.ts             # wagmi config
│       └── contracts/           # Generated ABI types
└── .env.local                   # PINATA_JWT, contract address
```

### Pattern 1: Server-Side Pinata Upload (API Route Proxy)

**What:** Use Next.js API route to proxy uploads to Pinata, keeping JWT secret on server.

**When to use:** ALWAYS - never expose Pinata JWT in client code.

**Example:**
```typescript
// src/app/api/ipfs/upload/route.ts
import { PinataSDK } from 'pinata-web3'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: 'gateway.pinata.cloud'
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const upload = await pinata.upload.file(file)

    return NextResponse.json({
      cid: upload.cid,
      url: `https://gateway.pinata.cloud/ipfs/${upload.cid}`
    })
  } catch (error) {
    console.error('Pinata upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

**Source:** [Pinata Documentation - Upload Methods](https://docs.pinata.cloud/ipfs/upload-methods)

### Pattern 2: Two-Step Upload (IPFS → Contract)

**What:** Upload to IPFS first, then store CID in smart contract only after successful upload.

**When to use:** ALWAYS for IPFS + blockchain patterns - gas costs make on-chain storage expensive.

**Example:**
```typescript
// src/components/DataUpload.tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useState } from 'react'
import { NEURAL_DATA_ABI } from '@/lib/contracts'

export function DataUpload() {
  const [uploading, setUploading] = useState(false)
  const [cid, setCid] = useState<string | null>(null)

  const {
    data: hash,
    writeContract,
    isPending: isWriting,
    error: writeError
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({ hash })

  const handleUpload = async (eegData: object) => {
    setUploading(true)
    try {
      // Step 1: Upload to IPFS
      const formData = new FormData()
      formData.append('file', new Blob([JSON.stringify(eegData)], { type: 'application/json' }))

      const res = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const { cid } = await res.json()
      setCid(cid)

      // Step 2: Store CID in contract
      writeContract({
        address: process.env.NEXT_PUBLIC_NEURAL_DATA_CONTRACT as `0x${string}`,
        abi: NEURAL_DATA_ABI,
        functionName: 'uploadData',
        args: [cid]
      })
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  // Handle states: uploading, isWriting, isConfirming, isConfirmed, error
}
```

### Pattern 3: Event-Driven Access Control UI

**What:** Listen to AccessGranted/AccessRevoked events for real-time UI updates.

**When to use:** Any state change that frontend needs to reflect immediately.

**Example:**
```typescript
// src/components/AccessControl.tsx
import { useWatchContractEvent } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'

export function AccessControl({ ownerAddress }: { ownerAddress: string }) {
  const queryClient = useQueryClient()

  // Listen for access changes
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NEURAL_DATA_CONTRACT as `0x${string}`,
    eventName: 'AccessGranted',
    args: { owner: ownerAddress },
    onLogs: (logs) => {
      // Invalidate queries to refetch updated access list
      queryClient.invalidateQueries({
        queryKey: ['accessList', ownerAddress]
      })
    }
  })

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_NEURAL_DATA_CONTRACT as `0x${string}`,
    eventName: 'AccessRevoked',
    args: { owner: ownerAddress },
    onLogs: (logs) => {
      queryClient.invalidateQueries({
        queryKey: ['accessList', ownerAddress]
      })
    }
  })
}
```

### Anti-Patterns to Avoid

1. **Client-side Pinata JWT** - Never put `PINATA_JWT` in `NEXT_PUBLIC_*` env vars
2. **Direct ipfs.io gateway** - Use dedicated `gateway.pinata.cloud` for production
3. **No upload confirmation** - Always verify CID is pinned before storing in contract
4. **Storing data in contract** - Store only CID (66 bytes), not full JSON payload

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File upload to IPFS | Custom fetch() to IPFS API | `pinata-web3` SDK | Handles multipart, pin confirmation, error parsing |
| Wallet connection | Direct window.ethereum | RainbowKit | 20+ wallet support, built-in error handling |
| Contract calls | viem direct | wagmi hooks | Caching, loading states, error handling, type safety |
| Transaction polling | Manual setInterval | `useWaitForTransactionReceipt` | Optimized polling, receipt parsing |
| CID validation | Regex matching | `multiformats` | Proper CID parsing, version detection |

**Key insight:** IPFS + blockchain integration has many edge cases (pinning confirmation, gateway failures, transaction reverts). Using battle-tested libraries handles these automatically.

## Common Pitfalls

### Pitfall 1: Exposing Pinata JWT in Client Code

**What goes wrong:** Putting `PINATA_JWT` in `.env.local` with `NEXT_PUBLIC_` prefix, allowing anyone to steal quota.

**Why it happens:** Next.js convention - `NEXT_PUBLIC_*` vars are exposed to browser.

**Consequences:**
- Attacker can use your Pinata quota
- Upload malicious content under your account
- Pinata bans your account for abuse

**Prevention:**
- Store JWT as `PINATA_JWT` (no `NEXT_PUBLIC_` prefix)
- Only access from API routes or server components
- Add CORS restrictions in Pinata dashboard if available

**Warning signs:**
- `process.env.NEXT_PUBLIC_PINATA_JWT` anywhere in client code

### Pitfall 2: Using Public Gateway (ipfs.io)

**What goes wrong:** Hardcoding `https://ipfs.io/ipfs/{cid}` instead of Pinata's dedicated gateway.

**Why it happens:** Works out of box in tutorials, no configuration needed.

**Consequences:**
- Rate limiting (429 errors) under moderate traffic
- Slow load times during peak usage
- Single point of failure for data retrieval

**Prevention:**
- Always use `https://gateway.pinata.cloud/ipfs/{cid}`
- Store gateway URL in env: `NEXT_PUBLIC_PINATA_GATEWAY`
- Consider multi-gateway fallback for production

### Pitfall 3: No Error Handling for Transaction Reverts

**What goes wrong:** Not handling cases where `uploadData()` reverts (gas, network, contract revert).

**Why it happens:** Tutorial code often omits error handling for brevity.

**Consequences:**
- UI stuck in "pending" state forever
- User has no idea what went wrong
- Silent data loss (upload succeeded but contract failed)

**Prevention:**
```typescript
const { error, writeContract } = useWriteContract()

useEffect(() => {
  if (error) {
    // Handle specific error types
    if (error.name === 'UserRejectedRequestError') {
      showToast('Transaction cancelled')
    } else if (error.message.includes('gas')) {
      showToast('Insufficient gas')
    } else {
      showToast(error.message)
    }
  }
}, [error])
```

### Pitfall 4: Not Waiting for Transaction Confirmation

**What goes wrong:** Showing "success" immediately after `writeContract()` instead of waiting for receipt.

**Why it happens:** Confusion between "transaction sent" and "transaction confirmed".

**Consequences:**
- UI shows data uploaded but transaction fails
- User thinks CID is stored but contract state unchanged
- Data inconsistency between IPFS and contract

**Prevention:**
```typescript
const { writeContract, data: hash, isPending } = useWriteContract()
const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({ hash })

// Show: pending → confirming → confirmed
const state = isPending ? 'pending' : isConfirming ? 'confirming' : isConfirmed ? 'confirmed' : 'idle'
```

### Pitfall 5: No Loading States for Async Operations

**What goes wrong:** No visual feedback during IPFS upload (can take 2-10 seconds).

**Why it happens:** Focus on happy path, loading states added later (then forgotten).

**Consequences:**
- Users click upload button multiple times
- Multiple uploads of same file
- Users think app is broken and refresh

**Prevention:**
```typescript
const [state, setState] = useState<'idle' | 'uploading' | 'confirming' | 'success' | 'error'>('idle')

// Show progress indicator for each state
{state === 'uploading' && <Spinner text="Uploading to IPFS..." />}
{state === 'confirming' && <Spinner text="Waiting for blockchain..." />}
```

## Code Examples

### Mock EEG Data Generator

```typescript
// src/lib/mockEegData.ts
export interface EegData {
  userId: string
  timestamp: number
  duration: number // seconds
  channels: string[]
  samples: number[][] // [channel][sample]
  metadata: {
    sampleRate: number // Hz
    resolution: number // bits
    deviceModel: string
    notes?: string
  }
}

export function generateMockEegData(
  userId: string,
  duration: number = 60,
  sampleRate: number = 256
): EegData {
  const channels = ['FP1', 'FP2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2']
  const totalSamples = duration * sampleRate

  return {
    userId,
    timestamp: Date.now(),
    duration,
    channels,
    samples: channels.map(() =>
      Array.from({ length: totalSamples }, () =>
        Math.sin(Math.random() * Math.PI * 2) * 50 + (Math.random() - 0.5) * 10
      )
    ),
    metadata: {
      sampleRate,
      resolution: 24,
      deviceModel: 'MockEEG-Pro',
      notes: 'Synthetic data for testing'
    }
  }
}
```

### Pinata Client Config

```typescript
// src/lib/pinata.ts
import { PinataSDK } from 'pinata-web3'

export function getPinataClient() {
  if (!process.env.PINATA_JWT) {
    throw new Error('PINATA_JWT not configured')
  }

  return new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
  })
}
```

### wagmi Config

```typescript
// src/lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { metaMask, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Neural Data Wallet' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})
```

### Contract Call with Full Error Handling

```typescript
// src/components/GrantAccessButton.tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { UserRejectedRequestError } from 'viem'

interface Props {
  researcherAddress: string
  onSuccess?: () => void
}

export function GrantAccessButton({ researcherAddress, onSuccess }: Props) {
  const {
    writeContract,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash: lastWriteHash // Track from writeContract return
  })

  const handleGrant = () => {
    writeContract(
      {
        address: contractAddress,
        abi: NEURAL_DATA_ABI,
        functionName: 'grantAccess',
        args: [researcherAddress as `0x${string}`]
      },
      {
        onError: (err) => {
          if (err instanceof UserRejectedRequestError) {
            console.log('User rejected transaction')
          } else {
            console.error('Grant failed:', err.message)
          }
        },
        onSuccess: () => {
          onSuccess?.()
        }
      }
    )
  }

  const isLoading = isPending || isConfirming

  return (
    <button onClick={handleGrant} disabled={isLoading}>
      {isLoading ? 'Confirming...' : 'Grant Access'}
    </button>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@pinata/sdk` | `pinata-web3` | 2024 | New SDK is simpler, better typed, actively maintained |
| ethers.js | viem + wagmi | 2024-2025 | viem is 10x smaller, faster, better TypeScript |
| Manual polling | `useWaitForTransactionReceipt` | wagmi 2.x | Built-in optimized polling |
| Public IPFS gateways | Dedicated gateways | 2024 | Rate limits forced migration to paid/dedicated |

**Deprecated/outdated:**
- `@pinata/sdk` v2.x - Use `pinata-web3` 0.5.x instead
- `ipfs.io` for production - Use dedicated gateway
- Direct contract calls without wagmi - Use hooks for caching

## Open Questions

1. **CID Version Standardization**
   - What we know: Pinata returns CIDv1 by default
   - What's unclear: Whether contract should validate CID version
   - Recommendation: Accept both v0/v1, gateway handles transparently

2. **Pinata Rate Limits**
   - What we know: Free tier has limits, paid tiers available
   - What's unclear: Exact rate limit numbers for free tier
   - Recommendation: Implement exponential backoff, monitor 429 responses

3. **EEG Data Size**
   - What we know: Mock data will be small (KB range)
   - What's unclear: Real EEG file sizes for future scaling
   - Recommendation: Design for 1-10MB files, consider chunking for larger

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (Next.js default) + wagmi Testing Utilities |
| Config file | `jest.config.js` (created in Wave 0) |
| Quick run command | `pnpm test -- --testPathPattern=upload` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| IPFS-01 | Upload JSON to Pinata | Integration | `pnpm test api/ipfs/upload` | Wave 0 |
| IPFS-02 | Store CID in contract | Integration | `pnpm test components/DataUpload` | Wave 0 |
| IPFS-04 | Use dedicated gateway | Unit | `pnpm test lib/pinata` | Wave 0 |
| ACCESS-01 | Grant access transaction | Contract | Foundry tests exist | Already done |
| ACCESS-02 | Revoke access transaction | Contract | Foundry tests exist | Already done |
| ACCESS-04 | Access control revert | Contract | Foundry tests exist | Already done |
| ACCESS-05 | Events emitted | Contract | Foundry tests exist | Already done |

### Sampling Rate
- **Per task commit:** `pnpm test -- --testPathPattern=<component>`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green + manual IPFS upload test

### Wave 0 Gaps
- [ ] `src/app/api/ipfs/upload/route.test.ts` — tests upload API
- [ ] `src/components/DataUpload.test.tsx` — tests upload flow
- [ ] `src/components/AccessControl.test.tsx` — tests grant/revoke UI
- [ ] `jest.config.js` — Jest configuration
- [ ] `.env.test` — Test environment with mock Pinata credentials

## Sources

### Primary (HIGH confidence)
- **NeuralDataRegistry.sol** (existing contract) - Already implements all required functions: `uploadData`, `grantAccess`, `revokeAccess`, `getData` with access control
- **Pinata SDK docs** - `pinata-web3` 0.5.x replaces deprecated `@pinata/sdk`
- **wagmi documentation** - `useWriteContract`, `useWaitForTransactionReceipt` hooks
- **Next.js documentation** - API routes for server-side operations

### Secondary (MEDIUM confidence)
- **STACK.md** (existing project research) - Version recommendations
- **PITFALLS.md** (existing project research) - IPFS pitfalls documented
- **ARCHITECTURE.md** (existing project research) - Two-step storage pattern

### Tertiary (LOW confidence)
- Specific Pinata rate limits - Need to verify with actual API usage
- Exact mock EEG data structure - Should validate with domain requirements

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Versions from npm registry and existing STACK.md
- Architecture: HIGH - Patterns verified across multiple sources, contract already exists
- Pitfalls: HIGH - Based on documented pitfalls in existing PITFALLS.md

**Research date:** 2026-03-26
**Valid until:** 90 days (Pinata/wagmi APIs are stable)
