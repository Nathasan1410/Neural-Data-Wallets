# Phase 6: Polish & Deployment - Research

**Researched:** 2026-03-29
**Domain:** Production deployment, error handling, UX polish, E2E testing for Next.js + wagmi dApps
**Confidence:** HIGH

## Summary

Phase 6 focuses on transforming the functional prototype into a production-ready, deployable dApp. The research reveals that the codebase already has strong foundations: react-hot-toast is integrated for transaction feedback (Phase 9), loading states exist in most components, and error handling patterns are established in hooks. However, gaps remain in consistent toast notifications for all async operations, comprehensive responsive design, and E2E test coverage.

**Primary recommendation:** Complete the polish incrementally—wire existing toast infrastructure to UploadButton, add responsive Tailwind classes to all pages/components, configure Vercel deployment with environment variables, then validate with Playwright E2E tests covering the critical user flows.

## User Constraints (from CONTEXT.md)

*Note: No CONTEXT.md file exists for this phase. Research proceeds with full discretion to recommend best practices.*

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| POLISH-01 | Error handling for all transactions | Toast infrastructure exists; UploadButton needs wiring |
| POLISH-02 | Loading states for async operations | Components have isLoading props; some gaps in visual feedback |
| POLISH-03 | Toast notifications for tx confirmation | react-hot-toast installed; Grant/Revoke buttons wired |
| POLISH-04 | Responsive design (works on mobile) | Tailwind CSS installed; needs responsive classes added |
| DEPLOY-01 | Contract deployed to Base Sepolia | COMPLETE: 0x2700C2B1268B115cF06136b881341903aBC7DC4a |
| DEPLOY-02 | Frontend deployed to Vercel/Netlify | No deployment config exists; Vercel recommended |
| DEPLOY-03 | End-to-end flow tested and working | No E2E tests exist; Playwright recommended |

---

## Standard Stack

### Core Libraries (Already in Use)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App framework | Industry standard for React production apps |
| wagmi | 3.6.0 | Ethereum React hooks | Best-in-class for EVM chain interactions |
| RainbowKit | 2.2.10 | Wallet connection UI | Polished, accessible wallet UX |
| react-hot-toast | 2.6.0 | Toast notifications | Lightweight, accessible notifications |
| Tailwind CSS | 4.0.0 | Utility-first CSS | Rapid responsive design development |
| viem | 2.47.6 | TypeScript Ethereum client | wagmi's underlying library |
| Pinata SDK | 0.5.4 | IPFS uploads | Managed IPFS with dedicated gateway |

### Testing Stack
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.1 | Unit/integration tests | Current test runner (73.24% coverage) |
| Testing Library | 16.3.2 | Component testing | React component tests |
| Playwright | Latest | E2E testing | Full browser flow validation (NEW) |

### Deployment Options
| Platform | Fit for dApps | Free Tier | Recommendation |
|----------|---------------|-----------|----------------|
| Vercel | Excellent | Yes (unlimited) | PRIMARY CHOICE - Next.js creators |
| Netlify | Good | Yes (100GB/mo) | Alternative |
| Cloudflare Pages | Good | Yes | Requires extra config for Next.js |

**Recommendation:** Use Vercel—native Next.js support, automatic preview deployments, and simple environment variable configuration.

---

## Architecture Patterns

### Current Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   └── ipfs/upload/    # IPFS upload endpoint
│   ├── patient/            # Patient dashboard route
│   ├── researcher/         # Researcher dashboard route
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Homepage
│   └── providers.tsx       # wagmi/RainbowKit providers
├── components/             # React components
│   ├── AccessControl.tsx   # Access management UI
│   ├── AccessList.tsx      # Access grant display
│   ├── AccessibleDataList.tsx  # Researcher data table
│   ├── GrantAccessButton.tsx   # Grant tx button
│   ├── RevokeAccessButton.tsx  # Revoke tx button
│   ├── UploadButton.tsx    # File upload button
│   └── UploadedDataList.tsx    # Patient data table
└── lib/
    ├── contracts/          # Contract ABI + server signer
    ├── hooks/              # Custom hooks (usePatientData, etc.)
    ├── mockEegData.ts      # Mock data generator
    └── wagmi.ts            # wagmi configuration
```

### Error Handling Pattern: Transaction Toasts
**What:** Use react-hot-toast with wagmi's `useWriteContract` error states

**When to use:** ALL blockchain transactions (grant, revoke, upload)

**Example:**
```typescript
// Source: src/components/GrantAccessButton.tsx (existing pattern)
import toast from 'react-hot-toast'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

export function GrantAccessButton({ researcherAddress, onSuccess }) {
  const { writeContract, isPending, error } = useWriteContract()
  const { isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (error) {
      toast.error(`Failed to grant access: ${error.message}`)
    }
  }, [error])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Access granted successfully!')
      onSuccess?.()
    }
  }, [isSuccess, onSuccess])

  // ... rest of component
}
```

### Loading State Pattern: Combined States
**What:** Combine `isPending` (waiting for wallet) and `isConfirming` (on-chain confirmation)

**When to use:** ALL async blockchain operations

**Example:**
```typescript
// Source: src/components/RevokeAccessButton.tsx (existing pattern)
const isLoading = isPending || isConfirming

return (
  <button disabled={isLoading}>
    {isLoading ? 'Confirming...' : 'Revoke Access'}
  </button>
)
```

### Responsive Design Pattern: Tailwind Breakpoints
**What:** Mobile-first responsive classes with `sm:`, `md:`, `lg:` prefixes

**When to use:** ALL pages and major components

**Example:**
```typescript
// Mobile-first: single column on mobile, two columns on md+
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <UploadButton />
  <AccessControl />
</div>

// Responsive table: horizontal scroll on mobile
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>
```

### Anti-Patterns to Avoid
- **Don't swallow errors silently** — Always show user feedback via toast or error state
- **Don't use `any` for error types** — Use `error instanceof Error ? error.message : 'Unknown'`
- **Don't forget loading states** — Every async operation needs visual feedback
- **Don't hardcode contract addresses** — Use environment variables with fallbacks

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom notification system | react-hot-toast (already installed) | Accessible, animated, position control |
| Wallet connection | Custom modal | RainbowKit ConnectButton | Multi-wallet support, security audited |
| Responsive layouts | Manual media queries | Tailwind CSS responsive utilities | Consistent breakpoints, utility-first |
| Loading spinners | Custom CSS animations | Tailwind `animate-spin` | Standard, accessible, theme-aware |
| E2E testing | Custom test runner | Playwright | Multi-browser, mobile emulation, wallet mocking |
| Form validation | Manual regex checks | Simple length + startsWith('0x') | Wallet addresses have fixed format |

**Key insight:** The project already uses industry-standard libraries. The polish phase is about **consistency** (applying existing patterns everywhere) rather than new implementations.

---

## Common Pitfalls

### Pitfall 1: Missing Toast for Upload Flow
**What goes wrong:** UploadButton shows loading state but no toast confirmation
**Why it happens:** Toast integration added in Phase 9 for access control, but UploadButton wasn't updated
**How to avoid:** Wire toast callbacks in `handleUploadComplete` callback
**Warning signs:** Console logs instead of user-visible feedback

**Fix pattern:**
```typescript
// In page.tsx or parent component
import toast from 'react-hot-toast'

const handleUploadComplete = (cid: string, url: string, txHash?: string) => {
  if (txHash) {
    toast.success('Data uploaded and stored on-chain!')
  } else {
    toast.success('Data uploaded to IPFS (contract storage pending)')
  }
}

const handleError = (error: Error) => {
  toast.error(`Upload failed: ${error.message}`)
}
```

### Pitfall 2: Incomplete Loading States
**What goes wrong:** Some components show "Loading..." text without visual indicator
**Why it happens:** Inconsistent use of loading state props
**How to avoid:** Use spinner + text combination for all loading states

**Recommended loading pattern:**
```typescript
// Visual + text loading indicator
{isLoading && (
  <div className="flex items-center gap-2">
    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
    <span>Loading...</span>
  </div>
)}
```

### Pitfall 3: Mobile Table Overflow
**What goes wrong:** Data tables overflow viewport on mobile devices
**Why it happens:** Tables don't have `overflow-x-auto` wrapper
**How to avoid:** Wrap ALL tables with responsive container

**Fix pattern:**
```typescript
<div className="overflow-x-auto" data-testid="data-table">
  <table className="min-w-full divide-y divide-gray-200">
    {/* table content */}
  </table>
</div>
```

### Pitfall 4: Vercel Build Fails Due to Missing Env Vars
**What goes wrong:** Build succeeds but app fails at runtime due to missing `NEXT_PUBLIC_` variables
**Why it happens:** `.env.local` not deployed; Vercel needs environment variables configured separately
**How to avoid:** Document required env vars; add `.env.example` to repo

**Required Vercel environment variables:**
```
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
NEXT_PUBLIC_NEURAL_DATA_CONTRACT=0x2700C2B1268B115cF06136b881341903aBC7DC4a
NEXT_PUBLIC_CHAIN_ID=84532
```

### Pitfall 5: E2E Tests Fail on Wallet Connection
**What goes wrong:** Playwright can't connect real wallets in headless CI
**Why it happens:** MetaMask/Coinbase Wallet require browser extensions
**How to avoid:** Use mock wallet provider or Playwright wallet plugin

**Recommended approach:** Use `@synthetixio/synpress` or custom mock provider that simulates wagmi connection states.

---

## Code Examples

### Upload Button with Toast Notifications
```typescript
// Source: Adapted from GrantAccessButton.tsx pattern
'use client'

import { useState, useRef } from 'react'
import { generateMockEegData, eegDataToJson } from '@/lib/mockEegData'
import toast from 'react-hot-toast'

export function UploadButton({ onUploadComplete, userId = 'user-001' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      toast.success(data.txHash
        ? 'Data uploaded and stored on-chain!'
        : 'Data uploaded to IPFS (contract storage pending)')
      onUploadComplete?.(data.cid, data.url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ... rest of component
}
```

### Responsive Page Layout
```typescript
// Mobile-first responsive layout for dashboards
export default function DashboardPage() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - stacked on mobile, row on md+ */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Patient Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your neural data</p>
            </div>
            <ConnectButton />
          </div>
        </header>

        {/* Content - single column on mobile, grid on lg+ */}
        {!isConnected ? (
          <div className="p-4 md:p-6 bg-gray-100 rounded-lg">
            <p>Connect wallet to continue</p>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Upload Data</h2>
              <UploadButton />
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold mb-4">Your Data</h2>
              <div className="overflow-x-auto">
                <UploadedDataList data={data} isLoading={isLoading} />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
```

### Playwright E2E Test Structure
```typescript
// tests/e2e/flow.spec.ts - Proposed structure
import { test, expect } from '@playwright/test'

test.describe('Neural Data Wallet E2E Flow', () => {
  test('patient can upload data', async ({ page }) => {
    await page.goto('/')

    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum = {
        request: async ({ method }: { method: string }) => {
          if (method === 'eth_requestAccounts') {
            return ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8']
          }
          return null
        }
      }
    })

    // Connect wallet
    await page.click('[data-testid="connect-button"]')
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible()

    // Upload mock data
    await page.click('[data-testid="generate-mock-btn"]')
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible()
  })

  test('researcher can view accessible data', async ({ page }) => {
    await page.goto('/researcher')

    // Mock wallet with access
    await page.evaluate(() => {
      window.ethereum = {
        request: async ({ method }: { method: string }) => {
          if (method === 'eth_requestAccounts') {
            return ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC']
          }
          return null
        }
      }
    })

    await page.click('[data-testid="connect-button"]')
    await expect(page.locator('[data-testid="data-section"]')).toBeVisible()
  })
})
```

---

## State of the Art

| Area | Current State | Target State | Gap |
|------|---------------|--------------|-----|
| Error handling | Access buttons have toasts | All async ops have toasts | UploadButton needs wiring |
| Loading states | Text-only indicators | Spinner + text | Visual polish needed |
| Responsive design | Basic Tailwind classes | Full mobile support | Add responsive classes |
| Deployment | Local dev only | Vercel production | Env vars + deploy config |
| E2E testing | None (unit only) | Playwright coverage | Full flow tests needed |

**Deployment readiness assessment:**
- Smart contract: READY (deployed and verified on Base Sepolia)
- Frontend code: NEEDS POLISH (responsive + error handling gaps)
- Infrastructure: NEEDS SETUP (Vercel project + env vars)
- Test coverage: NEEDS E2E (73.24% unit/integration, 0% E2E)

---

## Open Questions

1. **Wallet mocking for E2E tests**
   - What we know: Playwright can inject `window.ethereum` mock
   - What's unclear: Best library for wagmi-specific mocking
   - Recommendation: Start with simple mock, upgrade to `@synthetixio/synpress` if needed

2. **Vercel vs self-hosted deployment**
   - What we know: Vercel has free tier, native Next.js support
   - What's unclear: Any limitations for dApp-specific requirements
   - Recommendation: Vercel for hackathon demo; reassess for production

3. **Mobile wallet connection UX**
   - What we know: RainbowKit supports mobile wallets
   - What's unclear: Does it handle deep-linking to MetaMask mobile app?
   - Recommendation: Test on actual mobile devices during verification

---

## Validation Architecture

> Included: workflow.nyquist_validation is not explicitly disabled in .planning/config.json

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.1 (unit/integration) + Playwright (E2E - NEW) |
| Config file | `vitest.config.ts` |
| Quick run command | `pnpm test -- run` |
| Full suite command | `pnpm test:coverage` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| POLISH-01 | Error toast on tx failure | E2E | `playwright test flow.spec.ts` | Wave 0 |
| POLISH-02 | Loading spinner during pending | E2E | `playwright test flow.spec.ts` | Wave 0 |
| POLISH-03 | Success toast on tx confirm | E2E | `playwright test flow.spec.ts` | Wave 0 |
| POLISH-04 | Layout works on mobile viewport | E2E | `playwright test --project=mobile` | Wave 0 |
| DEPLOY-02 | Vercel build succeeds | Manual | Vercel dashboard | Wave 0 |
| DEPLOY-03 | Full flow works in production | E2E | Full flow test | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test -- run` (unit tests only)
- **Per wave merge:** `pnpm test:coverage` (full suite)
- **Phase gate:** Full E2E suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/e2e/flow.spec.ts` — covers POLISH-01, POLISH-03, DEPLOY-03
- [ ] `tests/e2e/responsive.spec.ts` — covers POLISH-04 (mobile viewport tests)
- [ ] `playwright.config.ts` — Playwright configuration with mobile emulation
- [ ] Framework install: `pnpm add -D @playwright/test` + `pnpm exec playwright install`

---

## Sources

### Primary (HIGH confidence)
- **Codebase analysis:** `src/components/GrantAccessButton.tsx`, `src/components/RevokeAccessButton.tsx` — existing toast patterns
- **Codebase analysis:** `src/lib/hooks/usePatientData.ts`, `src/lib/hooks/useResearcherData.ts` — loading state patterns
- **Codebase analysis:** `src/app/layout.tsx` — Toaster already configured
- **Package manifest:** `package.json` — confirms react-hot-toast 2.6.0, wagmi 3.6.0 installed
- **Environment config:** `.env.example` — deployment variables documented

### Secondary (MEDIUM confidence)
- **wagmi documentation:** https://wagmi.sh — error handling patterns for `useWriteContract`
- **RainbowKit documentation:** https://rainbowkit.com — responsive wallet modal behavior
- **Vercel Next.js deployment:** https://vercel.com/docs/deployments/nextjs — environment variable requirements
- **Playwright documentation:** https://playwright.dev — E2E testing best practices for React apps

### Tertiary (LOW confidence)
- Web search results for "Next.js deployment Vercel Base Sepolia wagmi 2025" — general best practices (verify during implementation)
- Web search results for "RainbowKit responsive mobile 2025" — responsive wallet UI patterns (test on devices)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and source code
- Architecture: HIGH — based on existing code patterns
- Pitfalls: MEDIUM — inferred from common dApp issues + code analysis
- Deployment: MEDIUM — Vercel best practices well-documented; specific dApp considerations need validation

**Research date:** 2026-03-29
**Valid until:** 6 months (stable libraries; wagmi/RainbowKit APIs are stable)
