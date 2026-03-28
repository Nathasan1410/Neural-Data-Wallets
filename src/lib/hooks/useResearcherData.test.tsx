import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useResearcherData } from './useResearcherData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'

// Create a test config with mock connector
const testConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      ],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <WagmiProvider config={testConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Mock wagmi's useReadContract and useAccount
vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useReadContract: vi.fn(),
    useAccount: vi.fn(),
  }
})

// Mock global fetch for IPFS calls
const originalFetch = global.fetch
beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  global.fetch = originalFetch
})

const { useReadContract, useAccount } = await import('wagmi')

describe('useResearcherData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty data when wallet is not connected', () => {
    vi.mocked(useAccount).mockReturnValue({ address: undefined })
    vi.mocked(useReadContract).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    expect(result.current.accessibleData).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('should return loading state initially', () => {
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    expect(result.current.isLoading).toBe(true)
  })

  it('should fetch accessible data when wallet is connected', async () => {
    const mockDataIds = [BigInt(0), BigInt(1)]
    const mockDataList = [
      { cid: 'bafkreitest1', timestamp: BigInt(1234567890), metadata: '0x' },
      { cid: 'bafkreitest2', timestamp: BigInt(1234567891), metadata: '0x' },
    ]

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: [mockDataIds, mockDataList],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    // Mock IPFS fetch to resolve immediately
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    } as any)

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    await waitFor(() => {
      expect(result.current.accessibleData.length).toBeGreaterThan(0)
    }, { timeout: 2000 })

    expect(result.current.accessibleData).toHaveLength(2)
  })

  it('should fetch IPFS data for each CID from Pinata gateway', async () => {
    const mockDataIds = [BigInt(0)]
    const mockDataList = [
      { cid: 'bafkreihello', timestamp: BigInt(1234567890), metadata: '0x' },
    ]

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: [mockDataIds, mockDataList],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    // Mock successful IPFS fetch
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ neuralData: 'test data' }),
    } as any)

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    await waitFor(() => {
      expect(result.current.accessibleData.length).toBeGreaterThan(0)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://gateway.pinata.cloud/ipfs/bafkreihello'
    )
  })

  it('should handle IPFS fetch errors gracefully', async () => {
    const mockDataIds = [BigInt(0)]
    const mockDataList = [
      { cid: 'bafkrei404', timestamp: BigInt(1234567890), metadata: '0x' },
    ]

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: [mockDataIds, mockDataList],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    // Mock IPFS 404 error
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as any)

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    await waitFor(() => {
      expect(result.current.accessibleData.length).toBeGreaterThan(0)
    })

    // Should have ipfsError set
    expect(result.current.accessibleData[0]?.ipfsError).toBeDefined()
  })

  it('should handle contract read errors gracefully', async () => {
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Contract read failed'),
      refetch: vi.fn(),
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    expect(result.current.error).toBe('Contract read failed')
    expect(result.current.accessibleData).toEqual([])
  })

  it('should provide ipfsLoading state', () => {
    const mockDataIds = [BigInt(0)]
    const mockDataList = [
      { cid: 'bafkreitest', timestamp: BigInt(1234567890), metadata: '0x' },
    ]

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: [mockDataIds, mockDataList],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useResearcherData(), { wrapper: testWrapper })

    expect(result.current.ipfsLoading).toBeDefined()
  })
})
