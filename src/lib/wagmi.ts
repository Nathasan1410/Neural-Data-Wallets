import { createConfig, http } from 'wagmi'
import { baseSepolia, base, type Chain } from 'wagmi/chains'
import { metaMask, coinbaseWallet } from 'wagmi/connectors'

const chains = [baseSepolia, base] as const

export const config = createConfig({
  chains: chains as unknown as readonly [Chain, ...Chain[]],
  connectors: [
    metaMask({
      appName: 'Neural Data Wallet',
      appDescription: 'Decentralized neural data storage with IPFS',
      appUrl: 'https://neural-data-wallet.vercel.app',
    }),
    coinbaseWallet({
      appName: 'Neural Data Wallet',
      appUrl: 'https://neural-data-wallet.vercel.app',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})