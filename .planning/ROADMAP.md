# Roadmap: Neural Data Wallets

**Project:** Neural Data Wallets (Web3 x Neurotech dApp)
**Created:** 2026-03-26
**Updated:** 2026-03-29 (Phase 11 COMPLETE - 73.24% coverage achieved)
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
| 6 | Polish & Deployment | Production-ready deployment | DEPLOY-01 through DEPLOY-07 | End-to-end flow works, deployed to Vercel |
| 7 | Foundry Verification | Install Foundry, verify contract | CONTRACT-01, CONTRACT-06 | forge tests pass, contract deployed |
| 8 | Upload Contract Wiring | Wire IPFS API to contract | IPFS-02 | CID stored on-chain after upload |
| 9 | Access Control Wiring | Wire access UI to contract | ACCESS-01, ACCESS-02 | Grant/revoke work end-to-end |
| 10 | Patient Dashboard Flow | Verify patient dashboard data flow | IPFS-03 | Dashboard shows real contract data |
| 11 | Test Coverage Gap Closure | Achieve 70%+ test coverage | COV-01, COV-02, COV-03 | 73.24% coverage achieved |
| 12 | Accessibility Gap Closure | WCAG 2.1 AA touch target compliance | DEPLOY-04 | All buttons/inputs 44px minimum |
| 13 | Critical Test Coverage | Cover untested pages and utilities | COV-04, COV-05 | page.tsx, pinata.ts, wagmi.ts tested |
| 14 | Vercel Deployment | Deploy to production | DEPLOY-02 | Live URL, verified build |

---

## Phase Details

### Phase 12: Accessibility Gap Closure

**Goal:** Achieve WCAG 2.1 AA compliance for touch targets

**Requirements:**
- DEPLOY-04: Responsive design with accessible touch targets

**Gap Closure:** Closes GAP-01 from v1.5-MILESTONE-AUDIT.md

**Plans:** 1 plan

**Plan Details:**
- [ ] 12-01-PLAN.md — Add 44px minimum touch targets to all interactive elements

**Tasks:**
1. Add `min-h-[44px]` to UploadButton component
2. Add `min-h-[44px]` to GrantAccessButton component
3. Add `min-h-[44px]` to RevokeAccessButton component
4. Add `min-h-[44px]` to AccessControl input field
5. Verify all navigation buttons meet 44px requirement
6. Run responsive E2E tests to confirm

**Success Criteria:**
1. All buttons have minimum 44px height
2. All input fields have minimum 44px height
3. WCAG 2.1 AA touch target compliance verified
4. Build succeeds with no regressions

---

### Phase 13: Critical Test Coverage Gap Closure

**Goal:** Add tests for files with 0% coverage

**Requirements:**
- COV-04: Home page (page.tsx) test coverage
- COV-05: Patient dashboard (patient/page.tsx) test coverage
- COV-06: pinata.ts utility test coverage
- COV-07: wagmi.ts config test coverage
- COV-08: serverSigner.uploadDataToContract() integration test

**Gap Closure:** Closes GAP-02 from v1.5-MILESTONE-AUDIT.md

**Plans:** 1 plan

**Plan Details:**
- [ ] 13-01-PLAN.md — Add tests for untested files

**Tasks:**
1. Add test for src/app/page.tsx (homepage renders, wallet connect)
2. Add test for src/app/patient/page.tsx (dashboard renders, data display)
3. Add test for src/lib/pinata.ts (Pinata client configuration)
4. Add test for src/lib/wagmi.ts (wagmi config validation)
5. Add integration test for serverSigner.uploadDataToContract()
6. Run coverage report, verify 85%+ overall coverage

**Success Criteria:**
1. page.tsx coverage > 80%
2. patient/page.tsx coverage > 80%
3. pinata.ts coverage > 80%
4. wagmi.ts coverage > 80%
5. serverSigner.ts coverage > 80%
6. Overall coverage > 85%
7. All tests passing (160+ total)

---

### Phase 14: Vercel Deployment

**Goal:** Deploy production-ready app to Vercel

**Requirements:**
- DEPLOY-02: Frontend deployed to Vercel
- DEPLOY-06: Loading states verified in production

**Gap Closure:** Closes GAP-03 from v1.5-MILESTONE-AUDIT.md

**Plans:** 1 plan

**Plan Details:**
- [ ] 14-01-PLAN.md — Deploy to Vercel and verify

**Tasks:**
1. Fix vercel.json buildCommand from `pnpm next build` to `pnpm build`
2. Push code to GitHub repository
3. Import repository to Vercel
4. Configure environment variables from .env.example
5. Deploy to production
6. Verify live URL works with real wallet connection
7. Verify IPFS upload works in production
8. Verify contract interactions work in production

**Success Criteria:**
1. vercel.json buildCommand corrected
2. App deployed to Vercel with live URL
3. Wallet connection works in production
4. IPFS upload flow functional
5. Grant/revoke access work end-to-end
6. Researcher dashboard accessible

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
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
   Phase 12 (A11y)        Phase 13 (Tests)       Phase 14 (Vercel)
```

---

*Roadmap created: 2026-03-26*
*Phase 12-14 gap closure phases added: 2026-03-29*
