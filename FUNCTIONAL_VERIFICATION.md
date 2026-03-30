# Functional Verification Checklist

**Date:** 2026-03-26
**Phase:** 4 - Patient Dashboard
**Status:** Ready for E2E testing

---

## Core Functions to Verify

### 1. IPFS Upload Functionality

**Test:** Upload mock EEG data to Pinata IPFS

**Steps:**
1. Navigate to http://localhost:3000/patient
2. Connect wallet (MetaMask/Coinbase Wallet)
3. Click "Generate Mock EEG" button
4. Wait for upload to complete
5. Verify CID is returned

**Expected Result:**
- Upload button shows "Generating..." then "Upload File"
- No error message displayed
- CID returned to onUploadComplete callback

**API Endpoint:** `POST /api/ipfs/upload`

**Manual Test:**
```bash
# Test API directly with curl
curl -X POST http://localhost:3000/api/ipfs/upload \
  -F "file=@test-data.json"
```

---

### 2. Contract Data Storage

**Test:** Verify CID is stored on-chain

**Steps:**
1. After successful upload, check contract state
2. Call `getDataCount(userAddress)` - should return incremented count
3. Call `getData(dataId)` - should return stored CID

**Contract Functions:**
- `getDataCount(address owner) -> uint256`
- `getData(uint256 dataId) -> (cid, timestamp, metadata)`

**Manual Test:**
```bash
# Using cast (Foundry) to read contract
cast call 0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8 \
  "getDataCount(address)" 0xYOUR_ADDRESS \
  --rpc-url https://sepolia.base.org
```

---

### 3. Patient Data Display

**Test:** Uploaded data appears in table

**Steps:**
1. After upload, click "Refresh" button
2. Verify table displays with columns: ID, CID, Timestamp, Actions
3. Verify "View on IPFS" link works

**Expected Result:**
- Table shows new row with uploaded data
- CID is truncated (e.g., "QmABCD...6789")
- Timestamp is formatted as readable date
- "View on IPFS" link opens in new tab

---

### 4. Access Control - Grant

**Test:** Grant access to researcher

**Steps:**
1. In patient dashboard, find "Grant Access" section
2. Enter researcher wallet address
3. Click "Grant Access"
4. Wait for transaction confirmation

**Contract Function:**
- `grantAccess(address researcher)`

**Expected Result:**
- Transaction submitted successfully
- `AccessGranted` event emitted
- Researcher address appears in access list

---

### 5. Access Control - Revoke

**Test:** Revoke access from researcher

**Steps:**
1. In access list, find researcher to revoke
2. Click "Revoke" button
3. Wait for transaction confirmation

**Contract Function:**
- `revokeAccess(address researcher)`

**Expected Result:**
- Transaction submitted successfully
- `AccessRevoked` event emitted
- Researcher address removed from access list

---

### 6. Researcher Access Verification

**Test:** Researcher can only access granted data

**Steps:**
1. Connect as researcher (different wallet)
2. Navigate to /researcher
3. Try to access data without grant
4. Grant access from patient
5. Try to access data with grant

**Contract Function:**
- `hasAccess(address user, address researcher) -> bool`

**Expected Result:**
- Returns `false` without grant
- Returns `true` with grant
- Unauthorized access reverts

---

## Environment Checklist

- [ ] `.env.local` configured with Pinata credentials
- [ ] `PINATA_JWT` set to valid JWT token
- [ ] `NEXT_PUBLIC_PINATA_GATEWAY` set to `gateway.pinata.cloud`
- [ ] `NEXT_PUBLIC_NEURAL_DATA_CONTRACT` set to deployed address
- [ ] Dev server running on http://localhost:3000
- [ ] MetaMask installed and configured with Base Sepolia

---

## Known Issues / Limitations

1. **Hydration warnings** - These are development-mode warnings, not functional issues
2. **Browser extension conflicts** - Some wallet extensions may interfere; test in incognito if issues occur
3. **IPFS data is PUBLIC** - Data uploaded to IPFS is publicly accessible; encryption deferred to v2

---

## Test Results Template

| Test | Status | Notes |
|------|--------|-------|
| IPFS Upload | [ ] | |
| Contract Storage | [ ] | |
| Data Display | [ ] | |
| Grant Access | [ ] | |
| Revoke Access | [ ] | |
| Researcher Access | [ ] | |

---

## Next Steps After Verification

1. Mark UAT tests as pass/fail in `.planning/phases/04-patient-dashboard/04-UAT.md`
2. Update `STATE.md` with Phase 4 completion status
3. Begin Phase 5: Researcher Dashboard
