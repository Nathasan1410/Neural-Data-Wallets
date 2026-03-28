import { describe, it, expect, beforeEach, vi } from 'vitest'
import { uploadDataToContract } from './serverSigner'
import { NEURAL_DATA_CONTRACT, NEURAL_DATA_ABI } from './neuralDataRegistry'

// Mock environment variables
const mockPrivateKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
const mockTxHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
const mockCid = 'QmTest123456789'

describe('serverSigner', () => {
  beforeEach(() => {
    vi.stubEnv('PRIVATE_KEY', mockPrivateKey)
  })

  describe('uploadDataToContract', () => {
    it('should have correct contract address', () => {
      expect(NEURAL_DATA_CONTRACT).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('should have uploadData function in ABI', () => {
      const uploadDataFunction = NEURAL_DATA_ABI.find(
        (item) => item.type === 'function' && item.name === 'uploadData'
      )
      expect(uploadDataFunction).toBeDefined()
      expect(uploadDataFunction?.inputs?.[0]?.name).toBe('cid')
      expect(uploadDataFunction?.inputs?.[0]?.type).toBe('string')
      expect(uploadDataFunction?.outputs?.[0]?.name).toBe('dataId')
      expect(uploadDataFunction?.outputs?.[0]?.type).toBe('uint256')
    })

    it('should throw error when PRIVATE_KEY is not set', async () => {
      vi.stubEnv('PRIVATE_KEY', '')
      await expect(uploadDataToContract(mockCid)).rejects.toThrow(
        'PRIVATE_KEY not configured'
      )
    })

    it('should have valid ABI structure', () => {
      expect(NEURAL_DATA_ABI).toBeInstanceOf(Array)
      expect(NEURAL_DATA_ABI.length).toBeGreaterThan(0)

      const functionNames = NEURAL_DATA_ABI
        .filter((item) => item.type === 'function')
        .map((item) => item.name)

      expect(functionNames).toContain('uploadData')
      expect(functionNames).toContain('getData')
      expect(functionNames).toContain('getDataCount')
    })
  })
})
