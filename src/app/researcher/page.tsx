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
      <div data-testid="connect-wallet">
        <h1>Researcher Dashboard</h1>
        <nav>
          <Link href="/">Home</Link> |
          <Link href="/patient">Patient</Link> |
          <Link href="/researcher">Researcher</Link>
        </nav>
        <p>Connect your wallet to view accessible neural data</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div data-testid="dashboard">
      <h1>Researcher Dashboard</h1>
      <nav>
        <Link href="/">Home</Link> |
        <Link href="/patient">Patient</Link> |
        <Link href="/researcher">Researcher</Link>
      </nav>

      <section data-testid="data-section">
        <h2>Accessible Neural Data</h2>
        <p>View EEG data that patients have granted you access to</p>
        <AccessibleDataList
          data={accessibleData}
          isLoading={isLoading}
          error={error}
          ipfsLoading={ipfsLoading}
        />
      </section>
    </div>
  )
}
