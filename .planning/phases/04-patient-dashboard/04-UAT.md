---
status: testing
phase: 04-patient-dashboard
source:
  - 04-01-SUMMARY.md
started: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Navigate to Patient Dashboard
expected: |
  Open browser to http://localhost:3000/patient
  Page loads without errors, shows "Patient Dashboard" header
  If wallet not connected: Shows "Connect your wallet" prompt
  If wallet connected: Shows uploaded data section
awaiting: user response

## Tests

### 1. Navigate to Patient Dashboard
expected: Open browser to http://localhost:3000/patient - Page loads with "Patient Dashboard" header, wallet connection check shown
result: [pending]

### 2. Wallet Connection Check
expected: When wallet not connected, page shows "Connect your wallet" message with ConnectButton. After connecting, shows connected state and data section.
result: [pending]

### 3. View Uploaded Data List
expected: When user has uploaded data, table displays with columns: ID, CID (truncated), Timestamp, Actions. Each row shows one uploaded dataset.
result: [pending]

### 4. Empty State Display
expected: When user has no uploads, shows "No uploads yet" message with helpful text in a centered gray box.
result: [pending]

### 5. Loading State
expected: During data fetch, shows loading skeletons (animated gray bars) instead of table content.
result: [pending]

### 6. IPFS Gateway Link
expected: Each row has "View on IPFS" link. Clicking opens CID in new tab at https://gateway/ipfs/{cid}
result: [pending]

### 7. Access List Display
expected: Each dataset shows "Granted to:" section with researcher addresses as badges. When no grants, shows "No access granted" in italic gray text.
result: [pending]

### 8. Refresh Functionality
expected: Clicking "Refresh" button refetches data from contract and updates the displayed list.
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0

## Gaps

[none yet]
