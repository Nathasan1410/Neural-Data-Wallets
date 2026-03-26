---
status: resolved
phase: 02-ipfs-integration
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md, 02-05-SUMMARY.md]
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:30:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Application Cold Start
expected: Kill any running Next.js server. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch with `pnpm dev` or `npm run dev`. Server boots without errors, homepage loads in browser at http://localhost:3000.
result: pass

### 2. Connect Wallet via RainbowKit
expected: Click "Connect Wallet" button in header. RainbowKit modal opens showing wallet options (MetaMask, Coinbase Wallet). Select a wallet, connection succeeds, modal closes, wallet address displayed in header.
result: pass
notes: Wallet connects successfully. Hydration warnings from browser extensions are expected.

### 3. View Upload UI on Homepage
expected: Homepage displays upload section with "Generate & Upload Mock EEG" button and/or file upload input. UI shows clear labels for what data type is expected (JSON/CSV).
result: pass
notes: UploadButton component integrated - shows "Upload File" and "Generate Mock EEG" buttons

### 4. Generate and Upload Mock EEG Data
expected: Click "Generate & Upload Mock EEG" button. Loading indicator appears during generation and upload. On success, shows confirmation with CID (Content Identifier) and/or transaction hash. Mock EEG data has 60s duration, 256Hz, 10 channels.
result: pending

### 5. Upload Custom JSON/CSV File
expected: Select a custom JSON or CSV file via file input. Click upload. Loading indicator appears. On success, shows confirmation with CID and/or transaction hash.
result: pending

### 6. Upload Shows Loading and Error States
expected: During upload, button shows loading state (spinner/disabled). If upload fails (e.g., network error, missing credentials), error message is displayed to user with clear feedback.
result: pending

### 7. Grant Access to Researcher
expected: Access control UI shows input field for researcher wallet address and "Grant Access" button. Enter a valid Ethereum address, click Grant Access. Transaction confirmation appears in wallet. On success, UI shows confirmation and the granted address appears in a list.
result: pass
notes: AccessControl component integrated - shows researcher address input and Grant/Revoke Access buttons

### 8. Revoke Access from Researcher
expected: For each granted address in the list, "Revoke Access" button is visible. Click Revoke Access. Transaction confirmation appears in wallet. On success, UI shows confirmation and address is removed from granted list.
result: pending

### 9. Access Control UI Shows Current Grants
expected: UI displays list of all addresses currently granted access. Each entry shows the researcher address and has a Revoke button. List updates after grant/revoke transactions confirm.
result: pending

## Summary

total: 9
passed: 4
issues: 0
pending: 5
skipped: 0

## Gaps

<!-- All gaps resolved by 02-05 gap closure plan -->
