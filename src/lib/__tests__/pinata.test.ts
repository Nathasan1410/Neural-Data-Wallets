import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getPinataClient, PINATA_GATEWAY } from '../pinata'

describe('pinata.ts', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getPinataClient', () => {
    it('throws error when PINATA_JWT is not configured', () => {
      delete process.env.PINATA_JWT
      expect(() => getPinataClient()).toThrow('PINATA_JWT not configured')
    })

    it('creates PinataSDK instance with correct config when PINATA_JWT is set', () => {
      process.env.PINATA_JWT = 'test-jwt-token'
      process.env.NEXT_PUBLIC_PINATA_GATEWAY = 'test.gateway.com'

      const client = getPinataClient()

      expect(client).toBeDefined()
      expect(client.constructor.name).toBe('PinataSDK')
    })

    it('uses default gateway when NEXT_PUBLIC_PINATA_GATEWAY is not set', () => {
      process.env.PINATA_JWT = 'test-jwt-token'
      delete process.env.NEXT_PUBLIC_PINATA_GATEWAY

      const client = getPinataClient()

      expect(client).toBeDefined()
    })
  })

  describe('PINATA_GATEWAY constant', () => {
    it('uses default pinata gateway', () => {
      // Note: The constant is evaluated at module load time
      // We can only verify it contains the expected default pattern
      expect(PINATA_GATEWAY).toMatch(/https:\/\/.*gateway\.pinata\.cloud/)
    })

    it('includes https protocol', () => {
      expect(PINATA_GATEWAY).toContain('https://')
    })
  })
})
