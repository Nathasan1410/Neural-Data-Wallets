---
phase: "04"
phase-slug: patient-dashboard
date: 2026-03-26
type: validation-strategy
---

## Validation Architecture for Phase 4: Patient Dashboard

### Dimension 8: Validation Strategy

**Goal:** Verify user can view their uploaded data and access grants

---

### Test Structure

| Layer | What to Test | How |
|-------|--------------|-----|
| Unit | usePatientData hook returns correct data | Mock contract calls, verify parsing |
| Integration | Dashboard fetches and displays data | Render with wagmi mock, verify UI |
| E2E | Full user flow: upload → view → grant access | Playwright script |

---

### UAT Criteria (Human Verification)

1. **Data Visibility**
   - [ ] User connects wallet
   - [ ] Navigate to `/patient`
   - [ ] See list of uploaded CIDs with timestamps
   - [ ] Clicking CID opens IPFS gateway with correct data

2. **Access List Display**
   - [ ] Each dataset shows granted researcher addresses
   - [ ] "No access granted" shown when empty
   - [ ] Grant/Revoke buttons work (from Phase 2)

3. **Error States**
   - [ ] Shows error if contract call fails
   - [ ] Shows loading skeleton during fetch
   - [ ] Shows "No uploads yet" if count is 0

---

### Automated Tests

```typescript
// src/lib/hooks/__tests__/usePatientData.test.ts
describe('usePatientData', () => {
  it('returns empty array when no uploads', async () => {
    // Mock getDataCount returns 0
    // Expect result to be []
  })

  it('fetches and parses uploaded data', async () => {
    // Mock getDataCount returns 2
    // Mock getData(0) and getData(1) with test data
    // Expect formatted results
  })
})
```

---

### Verification Commands

```bash
# Run unit tests
npm test -- usePatientData

# Run E2E (when set up)
npm run test:e2e -- patient-dashboard.spec.ts

# Manual verification
npm run dev
# Open http://localhost:3000/patient
# Connect wallet, verify data displays
```

---

### Contract Events to Listen

- `DataRegistered` - New upload (for real-time updates)
- `AccessGranted` - New access grant
- `AccessRevoked` - Access revoked

Use wagmi's `useContractEvent` to trigger refetches.
