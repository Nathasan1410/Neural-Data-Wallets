'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Neural Data Wallet</h1>
          <p className="text-gray-600">
            Decentralized neural data storage with IPFS
          </p>
        </header>

        <div className="mb-8">
          <ConnectButton />
        </div>

        {isConnected ? (
          <div className="p-6 bg-gray-100 rounded-lg">
            <p className="text-green-600 font-medium">
              Wallet connected! You can now upload neural data and manage access.
            </p>
          </div>
        ) : (
          <div className="p-6 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Connect your wallet to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}