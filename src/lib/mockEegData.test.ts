import { describe, it, expect } from 'vitest'
import { generateMockEegData, eegDataToJson, type EegData } from './mockEegData'

describe('mockEegData', () => {
  describe('generateMockEegData', () => {
    it('should generate EEG data with correct structure', () => {
      const result = generateMockEegData('user-123')

      expect(result).toHaveProperty('userId', 'user-123')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('duration')
      expect(result).toHaveProperty('channels')
      expect(result).toHaveProperty('samples')
      expect(result).toHaveProperty('metadata')
    })

    it('should use provided userId', () => {
      const result = generateMockEegData('test-user')
      expect(result.userId).toBe('test-user')
    })

    it('should use custom duration when provided', () => {
      const result = generateMockEegData('user-123', 30)
      expect(result.duration).toBe(30)
    })

    it('should use custom sampleRate when provided', () => {
      const result = generateMockEegData('user-123', 60, 512)
      expect(result.metadata.sampleRate).toBe(512)
    })

    it('should generate correct number of channels', () => {
      const result = generateMockEegData('user-123')
      expect(result.channels).toHaveLength(10)
      expect(result.channels).toEqual([
        'FP1', 'FP2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'
      ])
    })

    it('should generate correct number of samples per channel', () => {
      const duration = 2
      const sampleRate = 256
      const result = generateMockEegData('user-123', duration, sampleRate)
      const expectedSamples = duration * sampleRate

      result.samples.forEach(channel => {
        expect(channel).toHaveLength(expectedSamples)
      })
    })

    it('should generate numeric sample values', () => {
      const result = generateMockEegData('user-123')
      result.samples.forEach(channel => {
        channel.forEach(sample => {
          expect(typeof sample).toBe('number')
        })
      })
    }, 10000)

    it('should have correct metadata structure', () => {
      const result = generateMockEegData('user-123')
      expect(result.metadata).toEqual({
        sampleRate: 256,
        resolution: 24,
        deviceModel: 'MockEEG-Pro',
        notes: 'Synthetic data for testing'
      })
    })

    it('should generate different data on each call', () => {
      const result1 = generateMockEegData('user-123')
      const result2 = generateMockEegData('user-123')

      // Timestamps should be different (or at least not guaranteed same)
      expect(result1.timestamp).not.toBe(result2.timestamp)

      // Samples should be different due to random generation
      expect(result1.samples[0][0]).not.toBe(result2.samples[0][0])
    })
  })

  describe('eegDataToJson', () => {
    it('should convert EEG data to JSON string', () => {
      const data = generateMockEegData('user-123')
      const json = eegDataToJson(data)

      expect(typeof json).toBe('string')
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('should produce valid JSON that can be parsed back', () => {
      const data = generateMockEegData('user-123')
      const json = eegDataToJson(data)
      const parsed = JSON.parse(json)

      expect(parsed.userId).toBe(data.userId)
      expect(parsed.duration).toBe(data.duration)
      expect(parsed.channels).toEqual(data.channels)
      expect(parsed.metadata).toEqual(data.metadata)
    })

    it('should preserve all samples in JSON', () => {
      const data = generateMockEegData('user-123', 1, 100)
      const json = eegDataToJson(data)
      const parsed = JSON.parse(json)

      expect(parsed.samples).toHaveLength(data.channels.length)
      expect(parsed.samples[0]).toHaveLength(data.samples[0].length)
    })

    it('should format JSON with indentation', () => {
      const data = generateMockEegData('user-123')
      const json = eegDataToJson(data)

      // Should contain newlines and indentation (pretty printed)
      expect(json).toContain('\n')
      expect(json).toContain('  ') // 2-space indentation
    })
  })
})
