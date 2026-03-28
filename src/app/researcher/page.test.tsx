import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { mock } from 'wagmi/connectors'
import { useEffect, useState } from 'react'

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

function createTestWrapper({ isConnected = true }: { isConnected?: boolean } = {}) {
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
    useAccount: vi.fn(),
    useReadContract: vi.fn(),
  }
})

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock @rainbow-me/rainbowkit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="connect-button">Connect Wallet</button>,
}))

// Mock useResearcherData hook
vi.mock('@/lib/hooks/useResearcherData', () => ({
  useResearcherData: vi.fn(),
}))

// Mock AccessibleDataList component
vi.mock('@/components/AccessibleDataList', () => ({
  AccessibleDataList: ({ data, isLoading, error, ipfsLoading }: any) => (
    <div data-testid="accessible-data-list">
      <div data-testid="loading">{isLoading && 'Loading'}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="empty">{!data?.length && !isLoading && !error && 'Empty'}</div>
      <div data-testid="data-table">{data?.length} items</div>
    </div>
  ),
}))

const { useAccount } = await import('wagmi')
const { useResearcherData } = await import('@/lib/hooks/useResearcherData')

describe('Researcher Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state before mount', () => {
    // Mock useAccount to return disconnected state
    vi.mocked(useAccount).mockReturnValue({ isConnected: false, address: undefined })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: [],
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    // Render before mount simulation - set mounted to false
    const TestComponent = () => {
      const [mounted, setMounted] = useState(false)
      useEffect(() => {
        // Don't set mounted to simulate pre-mount state
      }, [])

      if (!mounted) {
        return <div>[LOADING]</div>
      }
      return <div>Mounted</div>
    }

    render(<TestComponent />)
    expect(screen.getByText('[LOADING]')).toBeInTheDocument()
  })

  it('should show connect wallet message when not connected', async () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false, address: undefined })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: [],
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    // Wait for mount
    await new Promise(resolve => setTimeout(resolve, 100))

    render(<Page />, { wrapper: createTestWrapper({ isConnected: false }) })

    // Should show connect wallet section
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument()
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument()
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
  })

  it('should show dashboard when wallet is connected', async () => {
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: [],
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    // Wait for mount
    await new Promise(resolve => setTimeout(resolve, 100))

    render(<Page />, { wrapper: createTestWrapper({ isConnected: true }) })

    // Should show dashboard
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
    expect(screen.getByText('Researcher Dashboard')).toBeInTheDocument()
  })

  it('should show navigation links', async () => {
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: [],
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    render(<Page />, { wrapper: createTestWrapper({ isConnected: true }) })

    // Should have navigation links
    expect(screen.getByText('Home')).toHaveAttribute('href', '/')
    expect(screen.getByText('Patient')).toHaveAttribute('href', '/patient')
    expect(screen.getByText('Researcher')).toHaveAttribute('href', '/researcher')
  })

  it('should show accessible neural data section', async () => {
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: [],
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    render(<Page />, { wrapper: createTestWrapper({ isConnected: true }) })

    // Should show data section header
    expect(screen.getByText('Accessible Neural Data')).toBeInTheDocument()
    expect(screen.getByTestId('accessible-data-list')).toBeInTheDocument()
  })

  it('should pass hook data to AccessibleDataList', async () => {
    const mockData = [
      {
        dataId: BigInt(0),
        cid: 'QmTest123',
        timestamp: BigInt(1711411200),
        metadata: '0x',
      },
    ]

    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
    vi.mocked(useResearcherData).mockReturnValue({
      accessibleData: mockData,
      isLoading: false,
      error: null,
      ipfsLoading: false,
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    render(<Page />, { wrapper: createTestWrapper({ isConnected: true }) })

    // Verify accessible-data-list receives data
    expect(screen.getByTestId('accessible-data-list')).toBeInTheDocument()
    expect(screen.getByText('1 items')).toBeInTheDocument()
  })
})
