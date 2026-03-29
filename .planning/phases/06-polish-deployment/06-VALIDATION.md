---
phase: 6
slug: polish-deployment
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x + @testing-library/react |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test -- --coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- <affected_file>`
- **After every plan wave:** Run `npm test -- --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | Error handling | unit | `npm test -- --filter=error` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | Loading states | unit | `npm test -- --filter=loading` | ❌ W0 | ⬜ pending |
| 06-02-01 | 02 | 2 | Responsive design | visual | Manual | N/A | ⬜ pending |
| 06-02-02 | 02 | 2 | Vercel deployment | deployment | `npm run build` | ✅ | ⬜ pending |
| 06-03-01 | 03 | 3 | E2E flow | E2E | `npm run test:e2e` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/e2e/*.spec.ts` — Playwright E2E test stubs
- [ ] `playwright.config.ts` — Playwright configuration
- [ ] `vercel.json` — Vercel deployment configuration
- [ ] Update existing component tests with enhanced loading state assertions

*Note: vitest infrastructure already exists (73.24% coverage, 119 tests passing)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile responsive layout | DEPLOY-04 | Requires visual inspection on device/emulator | 1. Open dev tools mobile view 2. Test wallet connection 3. Verify table overflow handling |
| Wallet connection flow | DEPLOY-07 | Requires actual wallet interaction | 1. Connect MetaMask 2. Upload data 3. View on patient dashboard 4. Grant access 5. Check researcher dashboard |
| Toast notifications | DEPLOY-03 | Visual confirmation needed | 1. Trigger upload transaction 2. Verify toast appears on success/failure |
| Vercel deployment | DEPLOY-06 | External service | 1. Push to GitHub 2. Verify Vercel build 3. Test production URL |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
