'use client'

import { useState, useRef } from 'react'
import { generateMockEegData, eegDataToJson } from '@/lib/mockEegData'
import toast from 'react-hot-toast'

interface UploadButtonProps {
  onUploadComplete?: (cid: string, url: string) => void
  userId?: string
}

export function UploadButton({ onUploadComplete, userId = 'user-001' }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      // Show success toast based on whether txHash is present
      if (data.txHash) {
        toast.success('Data uploaded and stored on-chain!')
      } else {
        toast.success('Data uploaded to IPFS (contract storage pending)')
      }

      onUploadComplete?.(data.cid, data.url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateAndUpload = async () => {
    setUploading(true)
    setError(null)

    try {
      const eegData = generateMockEegData(userId)
      const jsonString = eegDataToJson(eegData)

      const blob = new Blob([jsonString], { type: 'application/json' })
      const file = new File([blob], `eeg-${userId}-${Date.now()}.json`, {
        type: 'application/json',
      })

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      // Show success toast based on whether txHash is present
      if (data.txHash) {
        toast.success('Data uploaded and stored on-chain!')
      } else {
        toast.success('Data uploaded to IPFS (contract storage pending)')
      }

      onUploadComplete?.(data.cid, data.url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  return (
    <div>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        data-testid="upload-file-btn"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
      >
        {uploading && (
          <div
            className="animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4"
            data-testid="spinner"
            role="status"
          />
        )}
        <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
      </button>

      <button
        onClick={handleGenerateAndUpload}
        disabled={uploading}
        data-testid="generate-mock-btn"
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
      >
        {uploading && (
          <div
            className="animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4"
            data-testid="spinner"
            role="status"
          />
        )}
        <span>{uploading ? 'Generating...' : 'Generate Mock EEG'}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <div data-testid="upload-error" style={{ color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  )
}
