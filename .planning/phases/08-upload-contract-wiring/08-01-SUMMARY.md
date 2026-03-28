---
phase: 8
plan: 01
subsystem: IPFS Upload → Contract Integration
tags:
  - smart-contracts
  - ipfs
  - backend
dependency_graph:
  requires:
    - Phase 7: Foundry Verification (contract deployed)
    - viem installed
    - Pinata JWT configured
  provides:
    - On-chain CID storage for Phase 10
    - Transaction hash for upload confirmation
  affects:
    - /api/ipfs/upload endpoint
    - Patient dashboard data flow
tech_stack:
  added:
    - viem (server-side wallet client)
    - viem/accounts (private key signing)
  patterns:
    - Server-side contract writes via API route
    - Graceful error handling (IPFS succeeds even if contract fails)
key_files:
  created:
    - src/lib/contracts/serverSigner.ts (75 lines)
    - src/lib/contracts/serverSigner.test.ts (52 lines)
  modified:
    - src/app/api/ipfs/upload/route.ts (contract integration)
    - src/test/setup.ts (vitest import fix)
    - src/lib/contracts/neuralDataRegistry.test.ts (address update)
decisions:
  - name: Graceful contract error handling
    rationale: IPFS upload should succeed even if contract write fails (gas issues, network congestion). Contract errors returned in response for debugging.
    impact: Uploads always persist to IPFS; on-chain storage is best-effort with error visibility
  - name: Separate public/wallet clients
    rationale: simulateContract and waitForTransactionReceipt require public client; writeContract requires wallet client
    impact: Correct viem client architecture for server-side contract interactions
metrics:
  duration: ~15 minutes
  completed: 2026-03-28
  tests_added: 4
  tests_total: 81
---

# Phase 8 Plan 01: Wire Upload to Contract Storage Summary

Connected the IPFS upload API to the NeuralDataRegistry smart contract, enabling on-chain storage of CIDs when users upload neural data files.

## Implementation

### Task 1: Add viem Server-Side ✓

Created `src/lib/contracts/serverSigner.ts` with:
- `getWalletClient()` - Creates viem wallet client from private key
- `getPublicClient()` - Creates viem public client for reads
- `uploadDataToContract(cid)` - Main function that:
  1. Simulates transaction first (catches errors early)
  2. Writes to contract via `writeContract()`
  3. Waits for confirmation via `waitForTransactionReceipt()`
  4. Returns txHash and receipt

viem was already installed (v2.47.6) - no additional dependencies needed.

### Task 2: Modify Upload API Route ✓

Updated `src/app/api/ipfs/upload/route.ts`:
- Import `uploadDataToContract` from serverSigner
- After `pinata.upload.file()`, call contract with returned CID
- Wrap contract call in try/catch to handle errors gracefully

### Task 3: Return Tx Hash to Client ✓

API response now includes:
```typescript
{
  cid: string,
  url: string,
  txHash: string | undefined,
  contractError: string | undefined
}
```

Error handling:
- Contract errors don't fail the entire request
- IPFS upload always succeeds independently
- Errors logged and returned for debugging

### Task 4: Test End-to-End ⚠ BLOCKED

**Status:** Implementation complete, verification blocked by auth gate

**Blocked by:** `PRIVATE_KEY` in `.env.local` is truncated (41 chars instead of 66)

Current value: `0x309856fbf90c31F2C1b328BEc662B25012C635b` (missing ~24 hex chars)

**Required for testing:**
1. Complete 64-character hex private key
2. Key must have ETH on Base Sepolia for gas
3. Key must be the contract deployer/owner

## Test Coverage

Added 4 new tests in `src/lib/contracts/serverSigner.test.ts`:
- Contract address validation
- ABI structure validation
- uploadData function signature verification
- Error handling for missing PRIVATE_KEY

All 81 tests passing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed viem client type errors**
- **Found during:** Task 1 implementation
- **Issue:** `simulateContract` and `waitForTransactionReceipt` not available on wallet client
- **Fix:** Created separate `getPublicClient()` function; use public client for simulation and receipt waiting
- **Files modified:** `src/lib/contracts/serverSigner.ts`

**2. [Rule 1 - Bug] Fixed BigInt literal type error**
- **Found during:** Build
- **Issue:** `0n` literal not available at ES2017 target
- **Fix:** Changed to `BigInt(0)`
- **Files modified:** `src/lib/contracts/serverSigner.ts`

**3. [Rule 1 - Bug] Fixed receipt.status type mismatch**
- **Found during:** Build
- **Issue:** Receipt status is `'success' | 'reverted'` not `number`
- **Fix:** Updated return type signature
- **Files modified:** `src/lib/contracts/serverSigner.ts`

**4. [Rule 3 - Blocking] Fixed pre-existing test import error**
- **Found during:** Task 4 testing
- **Issue:** `src/test/setup.ts` missing `vi` import
- **Fix:** Added `import { vi } from 'vitest'`
- **Files modified:** `src/test/setup.ts`

**5. [Rule 3 - Blocking] Fixed pre-existing test contract address**
- **Found during:** Task 4 testing
- **Issue:** `neuralDataRegistry.test.ts` had old Phase 1 contract address
- **Fix:** Updated to Phase 7 deployed address `0x2700C2B1268B115cF06136b881341903aBC7DC4a`
- **Files modified:** `src/lib/contracts/neuralDataRegistry.test.ts`

## Authentication Gates

**PRIVATE_KEY truncated in .env.local**
- **Task:** Task 4 (End-to-End Testing)
- **Required:** Complete 64-char hex private key for Base Sepolia
- **Current:** `0x309856fbf90c31F2C1b328BEc662B25012C635b` (truncated)
- **Verification command:** `grep "^PRIVATE_KEY=" .env.local | wc -c` should return 68 (66 + newline)

## Verification Steps (Pending Auth)

Once PRIVATE_KEY is configured:

1. **Start dev server:**
   ```bash
   pnpm run dev
   ```

2. **Upload test file:**
   ```bash
   curl -X POST http://localhost:3000/api/ipfs/upload \
     -F "file=@test-data.json"
   ```

3. **Verify response includes txHash:**
   ```json
   {
     "cid": "Qm...",
     "url": "https://gateway.pinata.cloud/ipfs/Qm...",
     "txHash": "0x..."
   }
   ```

4. **Verify on-chain storage:**
   - Check Base Sepolia explorer for transaction
   - Call `getDataCount(userAddress)` via contract UI
   - Verify count incremented

## Commits

| Hash | Message |
|------|---------|
| f1ec738 | feat(08-01): wire IPFS upload to contract storage |
| 95f0efe | test(08-01): add serverSigner tests and fix contract address test |

## Next Steps

1. **Human Action Required:** Update `.env.local` with complete PRIVATE_KEY
2. Run end-to-end test manually
3. Verify CID appears in contract via Patient Dashboard or block explorer
4. Proceed to Phase 9 (Access Control Wiring)
