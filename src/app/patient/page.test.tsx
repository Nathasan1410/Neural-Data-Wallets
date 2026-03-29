import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'
import PatientPage from '../patient/page'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock wagmi hooks
vi.mock('wagmi', async () => ({
  default: await vi.importActual('wagmi'),
  useAccount: () => ({ isConnected: false, address: null }),
}))

// Mock @rainbow-me/rainbowkit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="connect-button">Connect Wallet</button>,
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock usePatientData hook
vi.mock('@/lib/hooks/usePatientData', () => ({
  usePatientData: () => ({
    uploadedData: [],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

// Mock UploadButton component
vi.mock('@/components/UploadButton', () => ({
  UploadButton: () => <button data-testid="upload-button">Upload</button>,
}))

// Mock UploadedDataList component
vi.mock('@/components/UploadedDataList', () => ({
  UploadedDataList: ({ data, isLoading, error }: { data: any[]; isLoading: boolean; error: string | null }) => (
    <div data-testid="uploaded-data-list">
      {isLoading ? 'Loading...' : error ? `Error: ${error}` : data.length === 0 ? 'No data' : `${data.length} items`}
    </div>
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

describe('PatientPage (patient/page.tsx)', () => {
  it('renders the patient dashboard heading', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Patient Dashboard')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Patient')).toBeInTheDocument()
    expect(screen.getByText('Researcher')).toBeInTheDocument()
  })

  it('shows upload section when wallet is connected', () => {
    // Mock connected state
    vi.mock('wagmi', async () => {
      const actual = await vi.importActual('wagmi')
      return {
        ...actual,
        useAccount: () => ({ isConnected: true, address: '0x1234567890' }),
      }
    })

    vi.resetModules()

    render(<PatientPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Your Uploaded Data')).toBeInTheDocument()
    expect(screen.getByTestId('upload-button')).toBeInTheDocument()
  })

  it('shows refresh button', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('has responsive container padding', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    // The main container with padding is the outer div with min-h-screen
    const container = screen.getByText('Patient Dashboard').closest('.min-h-screen')
    expect(container).toHaveClass('p-4')
    expect(container).toHaveClass('md:p-8')
  })

  it('has responsive typography', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    const heading = screen.getByText('Patient Dashboard')
    expect(heading).toHaveClass('text-2xl')
    expect(heading).toHaveClass('md:text-3xl')
  })

  it('renders UploadedDataList component', () => {
    render(<PatientPage />, { wrapper: createWrapper() })

    expect(screen.getByTestId('uploaded-data-list')).toBeInTheDocument()
  })
})
