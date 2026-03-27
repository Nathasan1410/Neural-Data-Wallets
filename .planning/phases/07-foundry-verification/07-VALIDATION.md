# Phase 7: Foundry Setup & Contract Verification - Validation Strategy

**Generated:** 2026-03-27
**Phase:** 07-foundry-verification
**Type:** Gap Closure

---

## Validation Architecture

### V1: Foundry Installation Validation
**Verify:** Foundry toolchain installed and functional

| Check | Command | Expected |
|-------|---------|----------|
| forge installed | `forge --version` | Returns version (e.g., "forge 1.6.0") |
| cast installed | `cast --version` | Returns version |
| anvil installed | `anvil --version` | Returns version |
| foundryup available | `foundryup --help` | Shows help output |

**Automated Test:** `forge --version | grep -q "forge"` exits with code 0

---

### V2: Contract Compilation Validation
**Verify:** NeuralDataRegistry.sol compiles without errors

| Check | Command | Expected |
|-------|---------|----------|
| Contract compiles | `forge build` | Exit code 0, no errors |
| Output generated | `ls out/NeuralDataRegistry.sol/NeuralDataRegistry.json` | File exists |
| No warnings | `forge build 2>&1 | grep -i warning` | No matches |

**Automated Test:** `forge build` exits with code 0

---

### V3: Test Suite Validation
**Verify:** All Foundry tests pass

| Check | Command | Expected |
|-------|---------|----------|
| Tests run | `forge test` | All tests execute |
| Tests pass | `forge test -vvv` | "All tests passed" |
| Coverage adequate | `forge coverage` | >80% function coverage |

**Automated Test:** `forge test -vvv 2>&1 | grep -q "All tests passed"` exits with code 0

**Test Coverage Requirements:**
- `uploadData()` - test data storage, events
- `grantAccess()` - test access grant, events
- `revokeAccess()` - test access revocation, events
- `hasAccess()` - test access check returns correct boolean
- Owner-only functions revert for non-owner

---

### V4: Deployment Validation
**Verify:** Contract deployed to Base Sepolia

| Check | Command/URL | Expected |
|-------|-------------|----------|
| Deployment succeeds | `forge script script/Deploy.s.sol --broadcast` | Transaction hash returned |
| Address recorded | Check .env.local | `NEURAL_DATA_REGISTRY_ADDRESS=0x...` |
| Contract exists on-chain | `cast code {ADDRESS} --rpc-url https://sepolia.base.org` | Returns bytecode |
| Frontend configured | Check src/lib/contracts/neuralDataRegistry.ts | Address matches deployed |

**Automated Test:** `cast code {ADDRESS} --rpc-url https://sepolia.base.org` returns non-empty bytecode

---

### V5: BaseScan Verification Validation
**Verify:** Contract source code verified on explorer

| Check | URL | Expected |
|-------|-----|----------|
| Contract page exists | https://sepolia.basescan.org/address/{ADDRESS} | Page loads, shows contract |
| Source verified | "Contract Source Code" tab | Shows verified Solidity code |
| ABI visible | "Contract" tab | Shows ABI JSON |
| Read functions | "Read Contract" tab | Shows view/pure functions |
| Write functions | "Write Contract" tab | Shows state-changing functions |

**Manual Verification:** Visit BaseScan URL, confirm "Verified" badge and source code visible

---

## Validation Commands

### Quick Validation (Pre-commit)
```bash
# Run before committing phase
cd contracts/
forge build && forge test -vvv
```

### Full Validation (Post-deployment)
```bash
# After deployment, verify all artifacts
cd contracts/

# 1. Build
forge build

# 2. Test
forge test -vvv

# 3. Coverage
forge coverage

# 4. Deploy (if not done)
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify

# 5. Verify address in frontend
grep -r "NEURAL_DATA_REGISTRY_ADDRESS" ../.env.local
grep -r "0x6349a9480f5FB7D79F3abd7C5D89789227beD6F8" ../src/lib/contracts/
```

---

## Success Criteria

Phase 7 is complete when ALL of the following are true:

1. `forge --version` returns a valid Foundry version
2. `forge build` completes with exit code 0
3. `forge test -vvv` shows "All tests passed"
4. Contract deployed to Base Sepolia (address in .env.local)
5. BaseScan shows contract as "Verified" with source code visible
6. Frontend uses correct deployed address

---

## Rollback Plan

If deployment fails or contract has issues:

1. **Test failure:** Fix tests/contract, re-run `forge test`
2. **Deployment failure:** Check RPC, private key, gas; retry deployment
3. **Verification failure:** Use BaseScan UI to manually verify with correct constructor arguments
4. **Wrong address deployed:** Update .env.local and frontend config with new address

---

*Validation strategy generated for Phase 7: Foundry Setup & Contract Verification*
