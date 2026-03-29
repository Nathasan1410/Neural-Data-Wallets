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
      <div>
        <h1>Patient Dashboard</h1>
        <nav>
          <Link href="/">Home</Link> |
          <Link href="/patient">Patient</Link> |
          <Link href="/researcher">Researcher</Link>
        </nav>
        <p>Connect your wallet to view your uploaded neural data</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <nav>
        <Link href="/">Home</Link> |
        <Link href="/patient">Patient</Link> |
        <Link href="/researcher">Researcher</Link>
      </nav>

      <section>
        <h2>Your Uploaded Data</h2>
        <div>
          <UploadButton onUploadComplete={handleUploadComplete} />
          <button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <UploadedDataList data={uploadedData} isLoading={isLoading} error={error} />
      </section>
    </div>
  )
}
