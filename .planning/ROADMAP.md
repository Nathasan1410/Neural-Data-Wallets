# Roadmap: Neural Data Wallets

**Project:** Neural Data Wallets (Web3 x Neurotech dApp)
**Created:** 2026-03-26
**Updated:** 2026-03-26 (Phase 2 gap closure planned)
**Goal:** 8-hour sprint prototype for Protocol Labs sponsorship

---

## Phase Structure

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Smart Contract Foundation | Deploy NeuralDataRegistry.sol with access control | CONTRACT-01 through CONTRACT-06 | Contract deployed to testnet, all Foundry tests pass |
| 2 | IPFS Integration | Pinata client + upload flow + CID storage | IPFS-01, IPFS-02, IPFS-04, ACCESS-01, ACCESS-02, ACCESS-04, ACCESS-05 | User can upload mock EEG data, CID stored on-chain, access grants work |
| 3 | Frontend Shell & Wallet Auth | Next.js + wagmi + RainbowKit setup | AUTH-01, AUTH-02, AUTH-03 | Wallet connects, address displays, session persists |
| 4 | Patient Dashboard | Upload flow + access management UI | IPFS-03, ACCESS-03 | Patient sees their data, can grant/revoke access |
| 5 | Researcher Dashboard | Data viewer for granted access | RES-01, RES-02, RES-03 | Researcher sees accessible data, can fetch from IPFS |
| 6 | Polish & Deployment | Error handling, loading states, testnet deploy | All requirements verified | End-to-end flow works, deployed to Base/Sepolia testnet |

---

## Phase Details

### Phase 1: Smart Contract Foundation

**Goal:** Deploy NeuralDataRegistry.sol with access control mechanics

**Requirements:**
- CONTRACT-01: NeuralDataRegistry contract deployed to testnet
- CONTRACT-02: Contract has uploadData(string cid) function
- CONTRACT-03: Contract has grantAccess(address researcher) function
- CONTRACT-04: Contract has revokeAccess(address researcher) function
- CONTRACT-05: Contract has hasAccess(address user, address researcher) view function
- CONTRACT-06: Contract passes all Foundry tests

**Plans:** 3 plans

**Plan Details:**
- [x] 01-01-PLAN.md — Foundry setup + NeuralDataRegistry.sol implementation
- [x] 01-02-PLAN.md — Comprehensive Foundry tests (TDD approach)
- [x] 01-03-PLAN.md — Deployment script + testnet deployment

**Success Criteria:**
1. `foundry.toml` configured for testnet deployment
2. `NeuralDataRegistry.sol` compiles without warnings
3. Foundry tests pass for: upload, grant, revoke, access check
4. Contract deployed to Base Sepolia or Sepolia
5. Deployment address recorded in `.env` or config

**Outcomes:**
- Deployed contract address: `0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8`
- Contract ABI available for frontend integration

---

### Phase 2: IPFS Integration

**Goal:** IPFS upload flow with Pinata, CID storage on-chain

**Requirements:**
- IPFS-01: User can upload mock EEG data (JSON) to IPFS via Pinata
- IPFS-02: System stores returned CID in smart contract linked to user address
- IPFS-04: System uses dedicated Pinata gateway (not ipfs.io)
- ACCESS-01: User can grant access to researcher by wallet address
- ACCESS-02: User can revoke access from researcher address
- ACCESS-04: Smart contract reverts if non-owner tries to access data
- ACCESS-05: Access events emitted for UI updates

**Plans:** 5 plans

**Plan Details:**
- [x] 02-01-PLAN.md — Pinata SDK setup, API route, mock EEG data generator
- [x] 02-02-PLAN.md — wagmi config, contract ABI exports, RainbowKit providers
- [x] 02-03-PLAN.md — DataUpload component, UploadButton, main page integration
- [x] 02-04-PLAN.md — AccessControl panel, GrantAccessButton, RevokeAccessButton, hooks
- [x] 02-05-PLAN.md — Gap closure: Integrate UploadButton and AccessControl into homepage

**Wave Structure:**
- Wave 1: Plans 02-01, 02-02 (parallel - foundation)
- Wave 2: Plans 02-03, 02-04 (parallel - UI components)
- Wave 3: Plan 02-05 (gap closure - depends on 02-03, 02-04)

**Success Criteria:**
1. Pinata API credentials configured in `.env`
2. Next.js API route `/api/ipfs/upload` working
3. Mock EEG data generator creates valid JSON
4. Upload flow: file → Pinata → CID → contract storage
5. Grant/revoke functions callable from frontend
6. Events emitted for access changes
7. Homepage displays upload and access control UI when wallet connected

**Outcomes:**
- Working IPFS upload pipeline
- Contract stores CIDs linked to user addresses
- Access control functions tested end-to-end
- Homepage displays UploadButton and AccessControl components

---

### Phase 3: Frontend Shell & Wallet Auth

**Goal:** Next.js app with wagmi + RainbowKit wallet connection

**Requirements:**
- AUTH-01: User can connect wallet via RainbowKit
- AUTH-02: User wallet address displayed in UI header
- AUTH-03: User session persists across browser refresh

**Success Criteria:**
1. Next.js 16 app scaffolded with TypeScript
2. wagmi 3.6 configured with Base/Sepolia chain
3. RainbowKit 2.2 wallet modal working
4. Address displayed in header after connect
5. Session persists on page refresh

**Outcomes:**
- Working wallet authentication
- Base shell for dashboard pages

---

### Phase 4: Patient Dashboard

**Goal:** Dashboard for data owners to manage uploads and access

**Requirements:**
- IPFS-03: User can view list of their uploaded data (CID + timestamp)
- ACCESS-03: User can view list of addresses with access to each dataset

**Plans:** 1 plan

**Plan Details:**
- [x] 04-01-PLAN.md — usePatientData hook, UploadedDataList, AccessList, PatientDashboard page

**Success Criteria:**
1. Patient dashboard page created at `/patient`
2. Shows list of user's uploaded CIDs with timestamps
3. Each dataset shows granted addresses
4. Grant access form (input address + button)
5. Revoke access button for each granted address
6. Transactions show loading/pending/confirmed states

**Outcomes:**
- usePatientData hook using getDataCount + getData contract calls
- UploadedDataList component displaying CID, timestamp, IPFS gateway link
- AccessList component for access grant display
- Fully functional patient dashboard at /patient route
- Users can view their data and permissions

---

### Phase 5: Researcher Dashboard

**Goal:** Dashboard for researchers to access granted data

**Requirements:**
- RES-01: Researcher can view list of CIDs they have access to
- RES-02: Researcher can fetch and display EEG data from IPFS
- RES-03: Researcher sees "access denied" if trying to access without grant

**Success Criteria:**
1. Researcher dashboard page created at `/researcher`
2. Queries contract for accessible CIDs
3. Fetches and displays EEG data from IPFS
4. Shows "access denied" for non-ganted data
5. EEG data displayed in readable format (JSON viewer or visualization)

**Outcomes:**
- Fully functional researcher dashboard
- End-to-end access control verified

---

### Phase 6: Polish & Deployment

**Goal:** Production-ready prototype deployed to testnet

**Success Criteria:**
1. Error handling for all transactions
2. Loading states for async operations
3. Toast notifications for tx confirmation
4. Responsive design (works on mobile)
5. Contract deployed to Base Sepolia
6. Frontend deployed to Vercel/Netlify
7. End-to-end flow tested and working

**Outcomes:**
- Live demo URL
- Contract address on testnet
- Pitch-ready prototype for Protocol Labs

---

### Phase 7: Foundry Setup & Contract Verification (Gap Closure)

**Goal:** Install Foundry, verify contract compiles/tests, deploy to Base Sepolia

**Requirements:**
- CONTRACT-01: NeuralDataRegistry contract deployed to testnet
- CONTRACT-06: Contract passes all Foundry tests

**Gap Closure:** Closes gaps from HONEST_STATUS.md audit

**Tasks:**
1. Install Foundry toolchain (`foundryup`)
2. Compile `NeuralDataRegistry.sol` with `forge build`
3. Run Foundry tests with `forge test`, fix any failures
4. Deploy to Base Sepolia testnet
5. Verify contract on BaseScan explorer

**Success Criteria:**
1. `forge --version` works
2. Contract compiles without errors
3. All Foundry tests pass
4. Contract deployed to Base Sepolia with verified address
5. Contract verified on BaseScan

---

### Phase 8: Wire Upload to Contract Storage (Gap Closure)

**Goal:** Connect IPFS upload API to smart contract storage

**Requirements:**
- IPFS-02: System stores returned CID in smart contract linked to user address

**Gap Closure:** Closes integration gap: Upload API → Contract `uploadData()`

**Tasks:**
1. Add viem/wagmi server-side to `/api/ipfs/upload` route
2. After Pinata upload, call `uploadData(cid)` on contract
3. Wait for transaction confirmation
4. Return CID + tx hash to frontend
5. Test end-to-end: file → IPFS → contract → display

**Success Criteria:**
1. Upload API writes CID to contract
2. Transaction hash returned to client
3. `getDataCount()` increments after upload
4. `getData()` returns stored CID

---

### Phase 9: Wire Access Control Transactions (Gap Closure)

**Goal:** Connect access control UI to smart contract transactions

**Requirements:**
- ACCESS-01: User can grant access to researcher by wallet address
- ACCESS-02: User can revoke access from researcher address

**Gap Closure:** Closes integration gap: AccessControl UI → Contract calls

**Tasks:**
1. Update `GrantAccessButton.tsx` to call `grantAccess(researcher)` via wagmi
2. Update `RevokeAccessButton.tsx` to call `revokeAccess(researcher)` via wagmi
3. Add transaction states (pending/confirmed/failed)
4. Display toast notifications on success/failure
5. Test grant/revoke end-to-end

**Success Criteria:**
1. Grant access button triggers blockchain transaction
2. Revoke access button triggers blockchain transaction
3. UI shows pending/confirmed states
4. `hasAccess()` returns correct values after grant/revoke

---

### Phase 10: Patient Dashboard Data Flow (Gap Closure)

**Goal:** Ensure patient dashboard displays actual contract data

**Requirements:**
- IPFS-03: User can view list of their uploaded data (CID + timestamp)

**Gap Closure:** Closes flow gap: "View patient dashboard" complete

**Tasks:**
1. Verify `usePatientData` hook receives data from contract
2. Ensure `UploadedDataList` renders actual data with correct formatting
3. Add error handling for contract read failures
4. Test full flow: upload → contract storage → display in table

**Success Criteria:**
1. Patient dashboard shows uploaded CIDs from contract
2. Timestamps display correctly
3. IPFS gateway links work
4. Empty state shows when no data uploaded

---

## Dependency Graph

```
Phase 1 (Contract) ──────────────┬──────────────> Phase 2 (IPFS)
                                 │
                                 ▼
Phase 3 (Auth) ──────────> Phase 4 (Patient) ───> Phase 5 (Researcher)
                                 │
                                 ▼
                          Phase 6 (Polish/Deploy)
```

---

*Roadmap created: 2026-03-26*
*Phase 1 planned: 2026-03-26 — 3 plans in 3 waves*
*Phase 2 planned: 2026-03-26 — 4 plans in 2 waves*
*Phase 2 gap closure: 2026-03-26 — Plan 02-05 added*
*Phase 4 complete: 2026-03-26 — 1 plan complete*
*Gap closure phases created: 2026-03-27 — Phases 7-10 added after HONEST_STATUS.md audit*
