export interface EegData {
  userId: string
  timestamp: number
  duration: number // seconds
  channels: string[]
  samples: number[][] // [channel][sample]
  metadata: {
    sampleRate: number // Hz
    resolution: number // bits
    deviceModel: string
    notes?: string
  }
}

export function generateMockEegData(
  userId: string,
  duration: number = 60,
  sampleRate: number = 256
): EegData {
  const channels = ['FP1', 'FP2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2']
  const totalSamples = duration * sampleRate

  return {
    userId,
    timestamp: Date.now(),
    duration,
    channels,
    samples: channels.map(() =>
      Array.from({ length: totalSamples }, () =>
        Math.sin(Math.random() * Math.PI * 2) * 50 + (Math.random() - 0.5) * 10
      )
    ),
    metadata: {
      sampleRate,
      resolution: 24,
      deviceModel: 'MockEEG-Pro',
      notes: 'Synthetic data for testing'
    }
  }
}

export function eegDataToJson(data: EegData): string {
  return JSON.stringify(data, null, 2)
}