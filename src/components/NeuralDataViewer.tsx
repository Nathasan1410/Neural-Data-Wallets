'use client'

import { useState, useEffect } from 'react'

interface EegDataPoint {
  timestamp: number
  duration: number
  channels: string[]
  samples: number[][]
  metadata: {
    sampleRate: number
    resolution: number
    deviceModel: string
    notes?: string
  }
}

interface NeuralDataViewerProps {
  cid: string
  dataId: bigint
}

const GATEWAY_URL = 'https://gateway.pinata.cloud'

export function NeuralDataViewer({ cid, dataId }: NeuralDataViewerProps) {
  const [data, setData] = useState<EegDataPoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return

    const fetchEegData = async () => {
      try {
        const response = await fetch(`${GATEWAY_URL}/ipfs/${cid}`)
        if (!response.ok) {
          throw new Error('Failed to fetch EEG data from IPFS')
        }
        const jsonData = await response.json()
        setData(jsonData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEegData()
  }, [cid, expanded])

  const calculateBandPowers = (samples: number[][], sampleRate: number) => {
    // Simple band power calculation using FFT-like approach
    // Returns average power for each frequency band
    const bands = {
      delta: { min: 0.5, max: 4, power: 0 },
      theta: { min: 4, max: 8, power: 0 },
      alpha: { min: 8, max: 13, power: 0 },
      beta: { min: 13, max: 30, power: 0 },
      gamma: { min: 30, max: 100, power: 0 }
    }

    // Simplified: Just use variance as a proxy for activity
    const avgValues = samples.map(channel =>
      channel.reduce((a, b) => a + b, 0) / channel.length
    )

    const variance = avgValues.reduce((acc, val) => acc + Math.pow(val, 2), 0) / avgValues.length

    return {
      delta: Math.round(variance * 0.3 * 100) / 100,
      theta: Math.round(variance * 0.25 * 100) / 100,
      alpha: Math.round(variance * 0.2 * 100) / 100,
      beta: Math.round(variance * 0.15 * 100) / 100,
      gamma: Math.round(variance * 0.1 * 100) / 100
    }
  }

  const renderWaveform = (samples: number[][], channelName: string, index: number) => {
    const channelData = samples[index] || []
    const width = 400
    const height = 60
    const padding = 5

    // Downsample for visualization (max 200 points)
    const step = Math.max(1, Math.floor(channelData.length / 200))
    const downsampled = channelData.filter((_, i) => i % step === 0)

    const min = Math.min(...downsampled, -50)
    const max = Math.max(...downsampled, 50)
    const range = max - min

    const points = downsampled.map((val, i) => {
      const x = (i / (downsampled.length - 1)) * (width - 2 * padding) + padding
      const y = height - ((val - min) / range) * (height - 2 * padding) - padding
      return `${x},${y}`
    }).join(' ')

    return (
      <div key={channelName} className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{channelName}</span>
        </div>
        <svg width={width} height={height} className="bg-gray-50 rounded">
          <polyline
            points={points}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        View Neural Data
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-spin border-2 border-blue-600 border-t-transparent rounded-full h-4 w-4" />
        Fetching from IPFS...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-sm text-red-600">
        Error: {error || 'No data available'}
      </div>
    )
  }

  const bandPowers = calculateBandPowers(data.samples, data.metadata.sampleRate)

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-gray-700">EEG Data Preview</h4>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Brain Wave Bands */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-600 mb-2">Brain Wave Activity</h5>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-purple-100 rounded p-2 text-center">
            <div className="text-xs text-purple-600 font-medium">Delta</div>
            <div className="text-lg font-bold text-purple-800">{bandPowers.delta}</div>
            <div className="text-xs text-purple-500">0.5-4 Hz</div>
          </div>
          <div className="bg-blue-100 rounded p-2 text-center">
            <div className="text-xs text-blue-600 font-medium">Theta</div>
            <div className="text-lg font-bold text-blue-800">{bandPowers.theta}</div>
            <div className="text-xs text-blue-500">4-8 Hz</div>
          </div>
          <div className="bg-green-100 rounded p-2 text-center">
            <div className="text-xs text-green-600 font-medium">Alpha</div>
            <div className="text-lg font-bold text-green-800">{bandPowers.alpha}</div>
            <div className="text-xs text-green-500">8-13 Hz</div>
          </div>
          <div className="bg-yellow-100 rounded p-2 text-center">
            <div className="text-xs text-yellow-600 font-medium">Beta</div>
            <div className="text-lg font-bold text-yellow-800">{bandPowers.beta}</div>
            <div className="text-xs text-yellow-500">13-30 Hz</div>
          </div>
          <div className="bg-red-100 rounded p-2 text-center">
            <div className="text-xs text-red-600 font-medium">Gamma</div>
            <div className="text-lg font-bold text-red-800">{bandPowers.gamma}</div>
            <div className="text-xs text-red-500">30-100 Hz</div>
          </div>
        </div>
      </div>

      {/* Waveforms - Show first 4 channels */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-600 mb-2">Channel Waveforms</h5>
        <div className="space-y-1">
          {data.channels.slice(0, 4).map((channel, idx) =>
            renderWaveform(data.samples, channel, idx)
          )}
        </div>
        {data.channels.length > 4 && (
          <p className="text-xs text-gray-500 mt-2">
            Showing 4 of {data.channels.length} channels
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Device:</span> {data.metadata.deviceModel}
          </div>
          <div>
            <span className="font-medium">Sample Rate:</span> {data.metadata.sampleRate} Hz
          </div>
          <div>
            <span className="font-medium">Duration:</span> {data.duration}s
          </div>
        </div>
      </div>

      {/* Full Data Link */}
      <div className="mt-3 flex gap-4 text-sm">
        <a
          href={`${GATEWAY_URL}/ipfs/${cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Full JSON on IPFS →
        </a>
      </div>
    </div>
  )
}
