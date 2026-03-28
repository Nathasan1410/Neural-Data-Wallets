import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePatientData } from './usePatientData'
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

const { useReadContract, useAccount } = await import('wagmi')

describe('usePatientData', () => {
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
    const { result } = renderHook(() => usePatientData(), { wrapper: testWrapper })

    expect(result.current.uploadedData).toEqual([])
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
    const { result } = renderHook(() => usePatientData(), { wrapper: testWrapper })

    expect(result.current.isLoading).toBe(true)
  })

  it('should fetch data count and individual data items', async () => {
    const mockDataCount = BigInt(2)
    const mockDataItems = [
      { cid: 'bafkreitest1', timestamp: BigInt(1234567890), metadata: '0x' },
      { cid: 'bafkreitest2', timestamp: BigInt(1234567891), metadata: '0x' },
    ]

    // First call returns data count
    // Subsequent calls return individual data items
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract)
      .mockReturnValueOnce({
        data: mockDataCount,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })
      .mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => usePatientData(), { wrapper: testWrapper })

    await waitFor(() => {
      expect(result.current.uploadedData).toBeDefined()
    })

    // Initial render should have empty data
    expect(result.current.uploadedData).toEqual([])
  })

  it('should provide refetch function', () => {
    const mockRefetch = vi.fn()
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: BigInt(0),
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => usePatientData(), { wrapper: testWrapper })

    expect(result.current.refetch).toBeDefined()
    expect(typeof result.current.refetch).toBe('function')
  })

  it('should transform contract data into UploadedData format', () => {
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })

    // Mock data count = 1
    vi.mocked(useReadContract)
      .mockReturnValueOnce({
        data: BigInt(1),
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })
      // Mock getData(0) call
      .mockReturnValueOnce({
        data: { cid: 'bafkreihello', timestamp: BigInt(1234567890), metadata: '0xmetadata' },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })
      // Mock remaining getData calls (return undefined for count <= index)
      .mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => usePatientData(), { wrapper: testWrapper })

    expect(result.current.uploadedData).toHaveLength(1)
    expect(result.current.uploadedData[0]).toEqual({
      dataId: BigInt(0),
      cid: 'bafkreihello',
      timestamp: BigInt(1234567890),
      metadata: '0xmetadata',
    })
  })
})
