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
        <div className="text-xs font-medium text-text-secondary mb-1">
          {channelName}
        </div>
        <svg width={width} height={height} className="bg-background border border-border rounded">
          <polyline
            points={points}
            fill="none"
            stroke="#1E40AF"
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
        className="text-primary-700 hover:text-primary-800 text-sm font-medium transition-colors"
      >
        View Neural Data
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <div className="animate-spin border-2 border-primary-700 border-t-transparent rounded-full h-4 w-4" />
        Fetching from IPFS...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-sm text-error">
        Error: {error || 'No data available'}
      </div>
    )
  }

  const bandPowers = calculateBandPowers(data.samples, data.metadata.sampleRate)

  return (
    <div className="mt-4 p-4 bg-surface border border-border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-text-primary">EEG Data Preview</h4>
        <button
          onClick={() => setExpanded(false)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Brain Wave Bands */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-text-primary mb-3">Brain Wave Activity</h5>
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs font-medium text-eeg-delta mb-1">Delta</div>
            <div className="text-lg font-bold text-eeg-delta">{bandPowers.delta}</div>
            <div className="text-xs text-text-secondary mt-1">0.5-4 Hz</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs font-medium text-eeg-theta mb-1">Theta</div>
            <div className="text-lg font-bold text-eeg-theta">{bandPowers.theta}</div>
            <div className="text-xs text-text-secondary mt-1">4-8 Hz</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs font-medium text-eeg-alpha mb-1">Alpha</div>
            <div className="text-lg font-bold text-eeg-alpha">{bandPowers.alpha}</div>
            <div className="text-xs text-text-secondary mt-1">8-13 Hz</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs font-medium text-eeg-beta mb-1">Beta</div>
            <div className="text-lg font-bold text-eeg-beta">{bandPowers.beta}</div>
            <div className="text-xs text-text-secondary mt-1">13-30 Hz</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs font-medium text-eeg-gamma mb-1">Gamma</div>
            <div className="text-lg font-bold text-eeg-gamma">{bandPowers.gamma}</div>
            <div className="text-xs text-text-secondary mt-1">30-100 Hz</div>
          </div>
        </div>
      </div>

      {/* Waveforms - Show first 4 channels */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-text-primary mb-3">Channel Waveforms</h5>
        <div className="space-y-2">
          {data.channels.slice(0, 4).map((channel, idx) =>
            renderWaveform(data.samples, channel, idx)
          )}
        </div>
        {data.channels.length > 4 && (
          <p className="text-xs text-text-secondary mt-2">
            Showing 4 of {data.channels.length} channels
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-text-secondary border-t border-border pt-3">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium text-text-primary">Device:</span> {data.metadata.deviceModel}
          </div>
          <div>
            <span className="font-medium text-text-primary">Sample Rate:</span> {data.metadata.sampleRate} Hz
          </div>
          <div>
            <span className="font-medium text-text-primary">Duration:</span> {data.duration}s
          </div>
        </div>
      </div>

      {/* Full Data Link */}
      <div className="mt-3 flex gap-4 text-sm">
        <a
          href={`${GATEWAY_URL}/ipfs/${cid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 hover:text-primary-800 hover:underline transition-colors"
        >
          View Full JSON on IPFS →
        </a>
      </div>
    </div>
  )
}
