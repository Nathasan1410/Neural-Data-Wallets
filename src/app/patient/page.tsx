'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { usePatientData } from '@/lib/hooks/usePatientData'
import { UploadedDataList } from '@/components/UploadedDataList'
import { UploadButton } from '@/components/UploadButton'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function PatientPage() {
  const { isConnected } = useAccount()
  const { uploadedData, isLoading, error, refetch } = usePatientData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleUploadComplete = () => {
    toast.success('Data uploaded!')
    setTimeout(() => refetch(), 2000)
  }

  if (!mounted) {
    return <div>[LOADING]</div>
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Patient Dashboard</h1>
          <nav className="flex flex-wrap gap-2 mb-6">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link> |
            <Link href="/patient" className="text-blue-600 hover:underline">Patient</Link> |
            <Link href="/researcher" className="text-blue-600 hover:underline">Researcher</Link>
          </nav>
          <p className="text-gray-600 mb-4">Connect your wallet to view your uploaded neural data</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Patient Dashboard</h1>
        <nav className="flex flex-wrap gap-2 mb-6">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link> |
          <Link href="/patient" className="text-blue-600 hover:underline">Patient</Link> |
          <Link href="/researcher" className="text-blue-600 hover:underline">Researcher</Link>
        </nav>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Uploaded Data</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <UploadButton onUploadComplete={handleUploadComplete} />
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="min-h-[44px] px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 rounded-lg text-sm md:text-base"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <UploadedDataList data={uploadedData} isLoading={isLoading} error={error} />
        </section>
      </div>
    </div>
  )
}
