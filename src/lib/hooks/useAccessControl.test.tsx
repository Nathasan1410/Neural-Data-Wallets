import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAccessControl } from './useAccessControl'
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

// Mock wagmi hooks
vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useReadContract: vi.fn(),
    useWriteContract: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
    useAccount: vi.fn(),
  }
})

const { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } = await import('wagmi')

describe('useAccessControl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should provide hasAccess, grantAccess, and revokeAccess functions', () => {
    const mockWriteContract = vi.fn()
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    expect(result.current.hasAccess).toBeDefined()
    expect(result.current.grantAccess).toBeDefined()
    expect(result.current.revokeAccess).toBeDefined()
    expect(typeof result.current.grantAccess).toBe('function')
    expect(typeof result.current.revokeAccess).toBe('function')
  })

  it('should return loading state during transaction confirmation', () => {
    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: true,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: true,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    expect(result.current.isLoading).toBe(true)
  })

  it('should call grantAccess with correct researcher address', () => {
    const mockWriteContract = vi.fn()
    const mockResearcherAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    act(() => {
      result.current.grantAccess(mockResearcherAddress)
    })

    expect(mockWriteContract).toHaveBeenCalledWith({
      address: '0x2700C2B1268B115cF06136b881341903aBC7DC4a',
      abi: expect.any(Array),
      functionName: 'grantAccess',
      args: [mockResearcherAddress],
    })
  })

  it('should call revokeAccess with correct researcher address', () => {
    const mockWriteContract = vi.fn()
    const mockResearcherAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: true,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    act(() => {
      result.current.revokeAccess(mockResearcherAddress)
    })

    expect(mockWriteContract).toHaveBeenCalledWith({
      address: '0x2700C2B1268B115cF06136b881341903aBC7DC4a',
      abi: expect.any(Array),
      functionName: 'revokeAccess',
      args: [mockResearcherAddress],
    })
  })

  it('should auto-refetch hasAccess after successful transaction', async () => {
    const mockRefetch = vi.fn()

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: false,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: true,
    })

    const testWrapper = createTestWrapper()
    renderHook(() => useAccessControl(), { wrapper: testWrapper })

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should return error state when transaction fails', () => {
    const mockError = new Error('Transaction failed')

    vi.mocked(useAccount).mockReturnValue({ address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: undefined,
      writeContract: vi.fn(),
      isPending: false,
      error: mockError,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    expect(result.current.error).toEqual(mockError)
  })

  it('should not call writeContract when user is not connected', () => {
    const mockWriteContract = vi.fn()

    vi.mocked(useAccount).mockReturnValue({ address: undefined })
    vi.mocked(useReadContract).mockReturnValue({
      data: false,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    })
    vi.mocked(useWriteContract).mockReturnValue({
      data: undefined,
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
    })
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    })

    const testWrapper = createTestWrapper()
    const { result } = renderHook(() => useAccessControl(), { wrapper: testWrapper })

    act(() => {
      result.current.grantAccess('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    })

    expect(mockWriteContract).not.toHaveBeenCalled()
  })
})
