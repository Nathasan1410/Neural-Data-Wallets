import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateMockEegData, eegDataToJson, EegData } from '@/lib/mockEegData'

describe('mockEegData', () => {
  describe('generateMockEegData', () => {
    it('should generate EEG data with default parameters', () => {
      const data = generateMockEegData('user-001')

      expect(data.userId).toBe('user-001')
      expect(data.duration).toBe(60) // default duration
      expect(data.channels).toHaveLength(10)
      expect(data.channels).toEqual(['FP1', 'FP2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'])
      expect(data.metadata.sampleRate).toBe(256)
      expect(data.metadata.resolution).toBe(24)
      expect(data.metadata.deviceModel).toBe('MockEEG-Pro')
    })

    it('should generate EEG data with custom duration', () => {
      const data = generateMockEegData('user-002', 30)

      expect(data.duration).toBe(30)
      expect(data.samples[0]).toHaveLength(30 * 256) // duration * sampleRate
    })

    it('should generate EEG data with custom sample rate', () => {
      const data = generateMockEegData('user-003', 10, 128)

      expect(data.metadata.sampleRate).toBe(128)
      expect(data.samples[0]).toHaveLength(10 * 128) // duration * sampleRate
    })

    it('should generate unique timestamps', () => {
      const data1 = generateMockEegData('user-001')
      // Small delay to ensure different timestamp
      const data2 = generateMockEegData('user-001')

      expect(data2.timestamp).toBeGreaterThanOrEqual(data1.timestamp)
    })

    it('should generate random sample values', { timeout: 30000 }, () => {
      const data = generateMockEegData('user-001')

      // Check that samples are arrays of numbers
      data.samples.forEach((channelSamples) => {
        expect(Array.isArray(channelSamples)).toBe(true)
        channelSamples.forEach((sample) => {
          expect(typeof sample).toBe('number')
        })
      })
    })

    it('should generate different samples on each call', () => {
      const data1 = generateMockEegData('user-001')
      const data2 = generateMockEegData('user-001')

      // Samples should be different (random)
      expect(data1.samples[0][0]).not.toBe(data2.samples[0][0])
    })
  })

  describe('eegDataToJson', () => {
    it('should convert EEG data to JSON string', () => {
      const data = generateMockEegData('user-001')
      const json = eegDataToJson(data)

      expect(typeof json).toBe('string')
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('should preserve all data fields when converting to JSON', () => {
      const data = generateMockEegData('user-001')
      const json = eegDataToJson(data)
      const parsed = JSON.parse(json) as EegData

      expect(parsed.userId).toBe(data.userId)
      expect(parsed.duration).toBe(data.duration)
      expect(parsed.channels).toEqual(data.channels)
      expect(parsed.metadata).toEqual(data.metadata)
    })

    it('should produce formatted JSON output', () => {
      const data = generateMockEegData('user-001')
      const json = eegDataToJson(data)

      // Check for indentation (formatted output)
      expect(json).toContain('  "')
    })
  })
})
