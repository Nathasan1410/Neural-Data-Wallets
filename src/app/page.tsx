'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { UploadButton } from '@/components/UploadButton'
import { AccessControl } from '@/components/AccessControl'

export default function Home() {
  const { isConnected, address } = useAccount()

  const handleUploadComplete = (cid: string, url: string) => {
    console.log('Upload complete:', cid, url)
  }

  const handleAccessGranted = (address: string) => {
    console.log('Access granted:', address)
  }

  const handleAccessRevoked = (address: string) => {
    console.log('Access revoked:', address)
  }

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
          <div className="space-y-6">
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-green-600 font-medium mb-4">
                Wallet connected! You can now upload neural data and manage access.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-4">Upload Neural Data</h2>
              <UploadButton
                userId={address || 'user-001'}
                onUploadComplete={handleUploadComplete}
              />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Manage Access</h2>
              <AccessControl
                onAccessGranted={handleAccessGranted}
                onAccessRevoked={handleAccessRevoked}
              />
            </section>
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