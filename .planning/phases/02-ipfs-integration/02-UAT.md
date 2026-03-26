---
status: diagnosed
phase: 02-ipfs-integration
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md]
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:15:00Z
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
result: issue
reported: "no upload ui at all - only shows 'Wallet connected!' message, page is mostly empty"
severity: major

### 4. Generate and Upload Mock EEG Data
expected: Click "Generate & Upload Mock EEG" button. Loading indicator appears during generation and upload. On success, shows confirmation with CID (Content Identifier) and/or transaction hash. Mock EEG data has 60s duration, 256Hz, 10 channels.
result: skipped
reason: Upload UI component not integrated on homepage

### 5. Upload Custom JSON/CSV File
expected: Select a custom JSON or CSV file via file input. Click upload. Loading indicator appears. On success, shows confirmation with CID and/or transaction hash.
result: skipped
reason: Upload UI component not integrated on homepage

### 6. Upload Shows Loading and Error States
expected: During upload, button shows loading state (spinner/disabled). If upload fails (e.g., network error, missing credentials), error message is displayed to user with clear feedback.
result: skipped
reason: Upload UI component not integrated on homepage

### 7. Grant Access to Researcher
expected: Access control UI shows input field for researcher wallet address and "Grant Access" button. Enter a valid Ethereum address, click Grant Access. Transaction confirmation appears in wallet. On success, UI shows confirmation and the granted address appears in a list.
result: issue
reported: "same as upload ui - no grant access button, page only shows wallet connect"
severity: major

### 8. Revoke Access from Researcher
expected: For each granted address in the list, "Revoke Access" button is visible. Click Revoke Access. Transaction confirmation appears in wallet. On success, UI shows confirmation and address is removed from granted list.
result: skipped
reason: AccessControl component not integrated on homepage

### 9. Access Control UI Shows Current Grants
expected: UI displays list of all addresses currently granted access. Each entry shows the researcher address and has a Revoke button. List updates after grant/revoke transactions confirm.
result: skipped
reason: AccessControl component not integrated on homepage

## Summary

total: 9
passed: 2
issues: 2
pending: 0
skipped: 5

## Gaps

<!-- YAML format for plan-phase --gaps consumption -->
- truth: "Homepage displays upload section with 'Generate & Upload Mock EEG' button and/or file upload input. UI shows clear labels for what data type is expected (JSON/CSV)."
  status: failed
  reason: "User reported: no upload ui at all - only shows 'Wallet connected!' message, page is mostly empty"
  severity: major
  test: 3
  root_cause: "page.tsx does not import or render UploadButton component - only shows ConnectButton and static message"
  artifacts:
    - path: "src/app/page.tsx"
      issue: "Missing UploadButton and AccessControl component integration"
  missing:
    - "Import UploadButton component"
    - "Import AccessControl component"
    - "Render both components in page layout"
  debug_session: ""

- truth: "Access control UI shows input field for researcher wallet address and 'Grant Access' button. Enter a valid Ethereum address, click Grant Access. Transaction confirmation appears in wallet. On success, UI shows confirmation and the granted address appears in a list."
  status: failed
  reason: "User reported: same as upload ui - no grant access button, page only shows wallet connect"
  severity: major
  test: 7
  root_cause: "page.tsx does not import or render AccessControl component - only shows ConnectButton and static message"
  artifacts:
    - path: "src/app/page.tsx"
      issue: "Missing AccessControl component integration"
  missing:
    - "Import AccessControl component"
    - "Render AccessControl in page layout"
  debug_session: ""
