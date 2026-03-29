'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useResearcherData } from '@/lib/hooks/useResearcherData'
import { AccessibleDataList } from '@/components/AccessibleDataList'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ResearcherPage() {
  const { isConnected } = useAccount()
  const { accessibleData, isLoading, error, ipfsLoading } = useResearcherData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>[LOADING]</div>
  }

  if (!isConnected) {
    return (
      <div data-testid="connect-wallet" className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Researcher Dashboard</h1>
          <nav className="flex flex-wrap gap-2 mb-6">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link> |
            <Link href="/patient" className="text-blue-600 hover:underline">Patient</Link> |
            <Link href="/researcher" className="text-blue-600 hover:underline">Researcher</Link>
          </nav>
          <p className="text-gray-600 mb-4">Connect your wallet to view accessible neural data</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div data-testid="dashboard" className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Researcher Dashboard</h1>
        <nav className="flex flex-wrap gap-2 mb-6">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link> |
          <Link href="/patient" className="text-blue-600 hover:underline">Patient</Link> |
          <Link href="/researcher" className="text-blue-600 hover:underline">Researcher</Link>
        </nav>

        <section data-testid="data-section" className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Accessible Neural Data</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">View EEG data that patients have granted you access to</p>
          <AccessibleDataList
            data={accessibleData}
            isLoading={isLoading}
            error={error}
            ipfsLoading={ipfsLoading}
          />
        </section>
      </div>
    </div>
  )
}
