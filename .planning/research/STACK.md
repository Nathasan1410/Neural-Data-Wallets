# Technology Stack

**Project:** Neural Data Wallets
**Researched:** 2026-03-26

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Next.js** | 16.2.x | React framework for frontend | Industry standard for Web3 dApps, built-in API routes for IPFS proxy, excellent TypeScript support, fast dev HMR. Required for rapid 8-hour sprint. |
| **React** | 19.x | UI library | Latest stable, compatible with all Web3 libraries. |
| **TypeScript** | 6.0.x | Type safety | Catches errors early, essential for smart contract type generation. |

### Web3 Integration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **viem** | 2.47.x | Ethereum TypeScript client | Lightweight (13M monthly downloads), modern replacement for ethers.js, excellent tree-shaking, built-in type safety for contract ABIs. **Not ethers.js** — viem is 10x smaller and faster. |
| **wagmi** | 3.6.x | React hooks for Ethereum | 2.2M monthly downloads, built on viem, provides `useAccount`, `useWriteContract`, `useReadContract` hooks out of box. Handles chain switching, connection state. |
| **RainbowKit** | 2.2.x | Wallet connection UI | Best-in-class wallet selector, supports 20+ wallets, built on wagmi, drop-in component. **Not WalletConnect alone** — RainbowKit wraps it with better UX. |
| **@tanstack/react-query** | 5.95.x | Data fetching/cache | Required peer dep for wagmi, handles contract call caching, refetch on block, optimistic updates. |

### IPFS Storage

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **pinata-web3** | 0.5.x | Pinata IPFS SDK | Official Pinata SDK (Protocol Labs ecosystem), simpler than ipfs-http-client, handles auth, pinning, gateway URLs. **NOT @pinata/sdk** — deprecated. |
| **ipfs-http-client** | 60.0.x | Direct IPFS node client | Lower-level control if needed. **Note:** js-IPFS deprecated in favor of Helia, but still works for HTTP gateway calls. |
| **multiformats** | 11.x | CID/content addressing | Handle IPFS hash formats, convert between v0/v1 CIDs. Required for IPFS URL generation. |

**Why Pinata over self-hosted IPFS:**
- 99.9% uptime SLA for hackathon demo
- No need to run local IPFS daemon
- Built-in pinning (data persists)
- Pinpoint gateway for fast retrieval
- Free tier sufficient for prototype

### Smart Contract Development

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Foundry** | v1.6.x | Solidity dev toolchain | User already has WSL setup. Includes: `forge` (build/test), `cast` (interact), `anvil` (local fork), `chisel` (REPL). 10x faster than Hardhat. |
| **Solidity** | 0.8.34 | Smart contract language | Latest stable, via Foundry (no solc npm needed). |

**Foundry components:**
- `forge build` — Compile contracts
- `forge test` — Run tests (fuzz testing built-in)
- `forge script` — Deploy scripts
- `cast` — Read/write contract state from CLI
- `anvil` — Local testnet (fork Base/Sepolia)

### Development Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **ESLint** | 10.1.x | Linting | Catch bugs, enforce patterns. |
| **Prettier** | 3.8.x | Code formatting | Auto-format on save, team consistency. |
| **pnpm** | Latest | Package manager | Faster installs, disk efficient (symlinks). |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Ethereum client | **viem** | ethers.js v6 | ethers is 3x larger, slower bundle, viem has better tree-shaking |
| React hooks | **wagmi** | web3-react | web3-react less maintained, wagmi has better TypeScript |
| Wallet connect | **RainbowKit** | ConnectKit, Web3Modal | RainbowKit has best DX, most wallet support |
| IPFS SDK | **pinata-web3** | ipfs-core, Helia | Pinata = managed service, no daemon setup, hackathon-friendly |
| Smart contracts | **Foundry** | Hardhat | Foundry is 10x faster, native Solidity tests, user has existing setup |
| Framework | **Next.js** | Vite + React | Next.js has API routes (for IPFS proxy), better deployment (Vercel) |

## Installation

```bash
# Initialize Next.js with TypeScript
pnpm create next-app@latest neural-data-wallet --typescript --eslint --tailwind --app

cd neural-data-wallet

# Core Web3 stack
pnpm add viem@2 wagmi@3 @rainbow-me/rainbowkit@2 @tanstack/react-query@5

# IPFS storage
pnpm add pinata-web3 multiformats

# Dev dependencies (optional, Next.js includes most)
pnpm add -D prettier eslint

# Foundry (if not already installed via WSL)
# curl -L https://foundry.paradigm.xyz | bash
# foundryup
```

## Project Structure

```
Neural-Data-Wallet/
├── contracts/                    # Foundry smart contracts
│   ├── src/
│   │   └── NeuralDataRegistry.sol
│   ├── test/
│   │   └── NeuralDataRegistry.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
├── src/                          # Next.js app
│   ├── app/
│   │   ├── layout.tsx           # RainbowKit provider setup
│   │   ├── page.tsx             # Dashboard
│   │   └── api/                 # API routes
│   │       └── ipfs/
│   │           └── upload/route.ts
│   ├── components/
│   │   ├── WalletButton.tsx     # RainbowKit ConnectButton
│   │   ├── DataUpload.tsx       # IPFS upload form
│   │   └── PermissionsTable.tsx # Access control UI
│   └── lib/
│       ├── contracts/           # Generated contract types
│       ├── pinata.ts            # Pinata client config
│       └── wagmi.ts             # wagmi config
├── .env.local                    # PINATA_JWT, NEXT_PUBLIC_CONTRACT_ADDRESS
└── package.json
```

## Configuration Notes

### wagmi Config (`src/lib/wagmi.ts`)
```typescript
import { createConfig, http } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { metaMask, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Neural Data Wallet' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})
```

### Pinata Setup (`.env.local`)
```
PINATA_JWT=your_jwt_from_pinata_cloud
NEXT_PUBLIC_NEURAL_DATA_CONTRACT=0x...  # After deploy
```

### Next.js API Route for IPFS Upload
Use API route to hide Pinata JWT from client:

```typescript
// src/app/api/ipfs/upload/route.ts
import { PinataSDK } from 'pinata-web3'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const pinata = new PinataSDK({ pinataJwt: process.env.PINATA_JWT })
  const formData = await request.formData()

  const upload = await pinata.upload.file(formData.get('file') as File)
  return NextResponse.json({ cid: upload.cid })
}
```

## Sources

- **npm registry** — Package versions fetched 2026-03-26:
  - viem: 2.47.6 (13M monthly downloads)
  - wagmi: 3.6.0 (2.2M monthly downloads)
  - @rainbow-me/rainbowkit: 2.2.10 (482K monthly downloads)
  - @tanstack/react-query: 5.95.2
  - pinata-web3: 0.5.4 (replaces deprecated @pinata/sdk: 2.1.0)
  - ipfs-http-client: 60.0.1 (deprecated: use Helia)
  - next: 16.2.1
  - typescript: 6.0.2
  - eslint: 10.1.0
  - prettier: 3.8.1
  - solc: 0.8.34
- **GitHub** — Foundry v1.6.0-rc1 (2026-01-22)

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| viem/wagmi versions | HIGH | Fetched directly from npm registry |
| RainbowKit version | HIGH | Fetched directly from npm registry |
| Pinata SDK | HIGH | Confirmed deprecation of old SDK, new SDK version verified |
| Next.js version | HIGH | Fetched directly from npm registry |
| Foundry version | MEDIUM | GitHub API response (not official docs) |
| IPFS library choice | MEDIUM | Based on deprecation notices, community patterns |
| Overall stack recommendation | HIGH | Aligns with 2026 Web3 best practices, download metrics support choices |
