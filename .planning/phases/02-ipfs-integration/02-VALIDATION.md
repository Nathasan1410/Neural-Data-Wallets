---
phase: 02-ipfs-integration
status: pending
created: 2026-03-26
updated: 2026-03-26
---

# Phase 2 Validation Plan

**Goal:** Verify IPFS integration and access control UI are working end-to-end

---

## Requirements Coverage

| Requirement | Plans | Status |
|-------------|-------|--------|
| IPFS-01: Upload mock EEG data to IPFS via Pinata | 02-01, 02-03 | [ ] |
| IPFS-02: Store CID in smart contract | 02-01, 02-03 | [ ] |
| IPFS-04: Use dedicated Pinata gateway | 02-01 | [ ] |
| ACCESS-01: Grant access by wallet address | 02-02, 02-04, 02-05 | [ ] |
| ACCESS-02: Revoke access by wallet address | 02-02, 02-04, 02-05 | [ ] |
| ACCESS-04: Contract reverts if non-owner | 02-02, 02-04 | [ ] |
| ACCESS-05: Access events emitted | 02-02, 02-04 | [ ] |

---

## Verification Checklist

### Build Verification
- [ ] `pnpm build` succeeds without errors
- [ ] TypeScript compilation passes
- [ ] No ESLint errors

### Component Verification
- [ ] UploadButton.tsx exists and exports default component
- [ ] AccessControl.tsx exists and exports default component
- [ ] GrantAccessButton.tsx exists and exports default component
- [ ] RevokeAccessButton.tsx exists and exports default component
- [ ] useAccessControl.ts hook exists and exports grantAccess/revokeAccess

### Integration Verification
- [ ] page.tsx imports UploadButton component
- [ ] page.tsx imports AccessControl component
- [ ] Both components render when wallet is connected

### API Verification
- [ ] `/api/ipfs/upload` endpoint exists
- [ ] POST with FormData file field returns `{ cid, url }`

### Configuration Verification
- [ ] `.env.local` has PINATA_API_KEY and PINATA_SECRET
- [ ] wagmi.ts configured with baseSepolia chain
- [ ] providers.tsx wraps app with WagmiProvider + RainbowKitProvider

---

## Must-Have Criteria (All Required)

1. **Upload flow works:** User can click "Upload" or "Generate Mock EEG", file uploads to Pinata, CID returns
2. **Access control works:** User can enter researcher address, click Grant, transaction confirms
3. **UI visible:** Both UploadButton and AccessControl display on homepage when wallet connected
4. **Build passes:** `pnpm build` completes without errors

---

## Test Plan

### Manual Tests
1. Connect wallet via RainbowKit
2. Click "Upload File" or "Generate Mock EEG Data"
3. Verify CID displays after upload
4. Enter a test address in Access Control
5. Click "Grant Access", confirm transaction
6. Verify address appears in granted list
7. Click "Revoke Access", confirm transaction
8. Verify address removed from list

### Contract Interaction Tests
```bash
# Using cast or web3 console to verify:
# 1. Upload data
cast send <CONTRACT_ADDRESS> "uploadData(string)" "QmTestHash"

# 2. Grant access
cast send <CONTRACT_ADDRESS> "grantAccess(address)" <RESEARCHER_ADDRESS>

# 3. Check access
cast call <CONTRACT_ADDRESS> "hasAccess(address,address)" <USER> <RESEARCHER>
```

---

## Artifacts to Verify

- `src/components/UploadButton.tsx`
- `src/components/AccessControl.tsx`
- `src/components/GrantAccessButton.tsx`
- `src/components/RevokeAccessButton.tsx`
- `src/lib/hooks/useAccessControl.ts`
- `src/app/api/ipfs/upload/route.ts`
- `src/app/page.tsx` (updated with component imports)

---

## Definition of Done

Phase 2 is complete when:
- [ ] All 7 requirements verified
- [ ] All 4 must-have criteria pass
- [ ] Manual tests pass
- [ ] Build succeeds
- [ ] UAT tests pass (02-UAT.md updated to all "pass")
