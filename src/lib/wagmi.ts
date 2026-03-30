import { createConfig, http } from 'wagmi'
import { baseSepolia, base, type Chain } from 'wagmi/chains'
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

const chains = [baseSepolia, base] as const

export const config = createConfig({
  chains: chains as unknown as readonly [Chain, ...Chain[]],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
      metadata: {
        name: 'Neural Data Wallet',
        description: 'Decentralized neural data storage with IPFS',
        url: 'https://neural-data-wallet.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/3778488'],
      },
    }),
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