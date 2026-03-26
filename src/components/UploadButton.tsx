'use client'

import { useState, useRef } from 'react'
import { generateMockEegData, eegDataToJson } from '@/lib/mockEegData'

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
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete?.(data.cid, data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateAndUpload = async () => {
    setUploading(true)
    setError(null)

    try {
      // Generate mock EEG data
      const eegData = generateMockEegData(userId)
      const jsonString = eegDataToJson(eegData)

      // Create file from JSON
      const blob = new Blob([jsonString], { type: 'application/json' })
      const file = new File([blob], `eeg-${userId}-${Date.now()}.json`, {
        type: 'application/json',
      })

      // Upload to IPFS
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete?.(data.cid, data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        <button
          onClick={handleGenerateAndUpload}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Generating...' : 'Generate Mock EEG'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}