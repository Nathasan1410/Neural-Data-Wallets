'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { usePatientData } from '@/lib/hooks/usePatientData'
import { UploadedDataList } from '@/components/UploadedDataList'
import { UploadButton } from '@/components/UploadButton'
import { AccessControl } from '@/components/AccessControl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DashboardStats } from '@/components/DashboardStats'
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
      <>
        <Header />
        <main className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-12 w-full">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Patient Dashboard</h1>
              <p className="text-text-secondary text-lg">Connect your wallet to view and manage your neural data</p>
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
      label: 'Total Uploads',
      value: uploadedData.length,
      trend: { value: 0, direction: 'up' as const },
    },
    {
      label: 'Researchers with Access',
      value: uploadedData.reduce((acc, item) => {
        // This would need access info from the hook
        return acc
      }, 0),
      trend: { value: 0, direction: 'up' as const },
    },
    {
      label: 'Last Upload',
      value: uploadedData.length > 0
        ? new Date(Number(uploadedData[0].timestamp) * 1000).toLocaleDateString()
        : 'Never',
    },
    {
      label: 'Storage Used',
      value: `${(uploadedData.length * 2.4).toFixed(1)} MB`,
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
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Patient Dashboard</h1>
              <p className="text-lg text-text-secondary">Manage your neural data and control researcher access</p>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-12">
              <DashboardStats stats={stats} isLoading={isLoading} />
            </div>

            {/* Your Uploaded Data Section */}
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Your Uploaded Data</h2>
                  <p className="text-text-secondary text-sm mt-1">View and manage your EEG recordings</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <UploadButton onUploadComplete={handleUploadComplete} />
                  <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 bg-surface border border-border text-text-primary rounded-md hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    {isLoading && (
                      <div className="animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4" />
                    )}
                    <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>
              <UploadedDataList data={uploadedData} isLoading={isLoading} error={error} />
            </section>

            {/* Manage Access Section */}
            <section className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Manage Researcher Access</h2>
                <p className="text-text-secondary text-sm mt-1">Control which researchers can access your data</p>
              </div>
              <AccessControl
                onAccessGranted={() => {
                  toast.success('Access granted!')
                  refetch()
                }}
                onAccessRevoked={() => {
                  toast.success('Access revoked!')
                  refetch()
                }}
              />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
