'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useResearcherData } from '@/lib/hooks/useResearcherData'
import { AccessibleDataList } from '@/components/AccessibleDataList'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DashboardStats } from '@/components/DashboardStats'
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
      <>
        <Header />
        <main className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-12 w-full">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Researcher Dashboard</h1>
              <p className="text-text-secondary text-lg">Connect your wallet to view and analyze accessible neural data</p>
              <div className="pt-6">
                <ConnectButton />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Calculate stats
  const stats = [
    {
      label: 'Accessible Datasets',
      value: accessibleData.length,
      trend: { value: 0, direction: 'up' as const },
    },
    {
      label: 'Data Sources',
      value: new Set(accessibleData.map(item => item.cid)).size,
    },
    {
      label: 'Total Data Points',
      value: `${accessibleData.length * 4}`,
    },
    {
      label: 'Last Access',
      value: accessibleData.length > 0
        ? new Date(Number(accessibleData[0].timestamp) * 1000).toLocaleDateString()
        : 'Never',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Researcher Dashboard</h1>
              <p className="text-lg text-text-secondary">Access and analyze neural data shared by patients</p>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-12">
              <DashboardStats stats={stats} isLoading={isLoading} />
            </div>

            {/* Accessible Data Section */}
            <section data-testid="data-section" className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Accessible Neural Data</h2>
                <p className="text-text-secondary text-sm mt-1">View EEG data that patients have granted you access to</p>
              </div>
              <AccessibleDataList
                data={accessibleData}
                isLoading={isLoading}
                error={error}
                ipfsLoading={ipfsLoading}
              />
            </section>

            {/* Info Section */}
            {accessibleData.length === 0 && !isLoading && !error && (
              <div className="bg-surface border border-border rounded-md p-8 text-center">
                <p className="text-text-secondary mb-4">
                  No data accessible yet. Request access from patients or ask them to share their neural data with you.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
