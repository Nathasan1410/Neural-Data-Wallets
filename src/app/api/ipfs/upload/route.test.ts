import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Shared mock that can be reconfigured between tests
const mockPinataUploadFile = vi.fn().mockResolvedValue({ IpfsHash: 'bafkreitesthash' })

// Mock PinataSDK as a class constructor
vi.mock('pinata-web3', () => {
  return {
    PinataSDK: class MockPinataSDK {
      private config: any
      constructor(config: any) {
        this.config = config
      }
      upload = {
        file: mockPinataUploadFile,
      }
    },
  }
})

// Mock serverSigner
vi.mock('@/lib/contracts/serverSigner', () => ({
  uploadDataToContract: vi.fn().mockResolvedValue({ txHash: '0xtesttxhash' }),
}))

// Mock environment variables
const originalEnv = process.env

describe('POST /api/ipfs/upload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPinataUploadFile.mockResolvedValue({ IpfsHash: 'bafkreitesthash' })
    process.env = {
      ...originalEnv,
      PINATA_JWT: 'test-jwt',
      NEXT_PUBLIC_PINATA_GATEWAY: 'gateway.pinata.cloud',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should exist and export POST handler', async () => {
    const route = await import('./route')
    expect(route.POST).toBeDefined()
    expect(typeof route.POST).toBe('function')
  })

  it('should return 400 when no file provided', async () => {
    const { POST } = await import('./route')

    const mockFormData = new FormData()
    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No file provided')
  })

  it('should return cid, url, and txHash on success', async () => {
    const { POST } = await import('./route')

    const mockFile = new File(['test content'], 'test.json', { type: 'application/json' })
    const mockFormData = new FormData()
    mockFormData.append('file', mockFile)

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.cid).toBe('bafkreitesthash')
    expect(json.url).toContain('bafkreitesthash')
    expect(json.txHash).toBe('0xtesttxhash')
  })

  it('should gracefully handle contract errors without failing IPFS upload', async () => {
    const { uploadDataToContract } = await import('@/lib/contracts/serverSigner')
    vi.mocked(uploadDataToContract).mockRejectedValue(new Error('Contract write failed'))

    const { POST } = await import('./route')

    const mockFile = new File(['test content'], 'test.json', { type: 'application/json' })
    const mockFormData = new FormData()
    mockFormData.append('file', mockFile)

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const json = await response.json()

    // IPFS upload should succeed
    expect(response.status).toBe(200)
    expect(json.cid).toBe('bafkreitesthash')
    expect(json.url).toContain('bafkreitesthash')
    // Contract error should be recorded but not fail the request
    expect(json.contractError).toBeDefined()
    expect(json.txHash).toBeUndefined()
  })

  it('should use custom gateway when configured', async () => {
    process.env.NEXT_PUBLIC_PINATA_GATEWAY = 'custom.gateway.io'

    const { POST } = await import('./route')

    const mockFile = new File(['test content'], 'test.json', { type: 'application/json' })
    const mockFormData = new FormData()
    mockFormData.append('file', mockFile)

    const mockRequest = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    } as unknown as NextRequest

    const response = await POST(mockRequest)
    const json = await response.json()

    expect(json.url).toContain('custom.gateway.io')
  })
})
