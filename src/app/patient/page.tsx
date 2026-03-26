'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { usePatientData } from '@/lib/hooks/usePatientData'
import { UploadedDataList } from '@/components/UploadedDataList'
import Link from 'next/link'

export default function PatientPage() {
  const { isConnected } = useAccount()
  const { uploadedData, isLoading, error, refetch } = usePatientData()

  if (!isConnected) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Patient Dashboard</h1>
              <ConnectButton />
            </div>
            <nav className="space-x-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/patient" className="text-gray-900 font-medium">
                Patient
              </Link>
              <Link href="/researcher" className="text-gray-600 hover:text-gray-900">
                Researcher
              </Link>
            </nav>
          </header>
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-4">Connect your wallet to view your uploaded neural data</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <ConnectButton />
          </div>
          <nav className="space-x-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/patient" className="text-gray-900 font-medium">
              Patient
            </Link>
            <Link href="/researcher" className="text-gray-600 hover:text-gray-900">
              Researcher
            </Link>
          </nav>
        </header>

        <main>
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Uploaded Data</h2>
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            <UploadedDataList data={uploadedData} isLoading={isLoading} error={error} />
          </section>
        </main>
      </div>
    </div>
  )
}
