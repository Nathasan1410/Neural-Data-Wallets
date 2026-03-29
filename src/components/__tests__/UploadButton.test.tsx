import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UploadButton } from '@/components/UploadButton'

// Mock FormData and fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import toast from 'react-hot-toast'

describe('UploadButton', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.clearAllMocks()
  })

  it('should render upload buttons', () => {
    render(<UploadButton />)

    expect(screen.getByText('Upload File')).toBeInTheDocument()
    expect(screen.getByText('Generate Mock EEG')).toBeInTheDocument()
  })

  it('should disable buttons while uploading', async () => {
    // Mock fetch to delay so we can check disabled state
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    }), 100)))

    render(<UploadButton />)

    const uploadButton = screen.getByTestId('upload-file-btn')
    const generateButton = screen.getByTestId('generate-mock-btn')
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    // Create a mock file and trigger file input change
    const mockFile = new File(['test data'], 'test.json', { type: 'application/json' })
    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    // Buttons should be disabled during upload
    expect(uploadButton).toBeDisabled()
    expect(generateButton).toBeDisabled()
  })

  it('should call onUploadComplete callback on successful upload', async () => {
    const mockOnUploadComplete = vi.fn()
    const mockFile = new File(['test data'], 'test.json', { type: 'application/json' })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    })

    render(<UploadButton onUploadComplete={mockOnUploadComplete} />)

    // Trigger file input via ref by clicking the upload button
    const uploadButton = screen.getByTestId('upload-file-btn')
    fireEvent.click(uploadButton)

    // Get the hidden file input and trigger change
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    // Wait for upload to complete
    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalledWith('QmTestCid', 'https://ipfs.io/ipfs/QmTestCid')
    })
  })

  it('should display error message on failed upload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Upload failed' }),
    })

    render(<UploadButton />)

    // Use generate button which doesn't require file input
    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    // Wait for error message to appear
    const errorMessage = await screen.findByTestId('upload-error')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage.textContent).toContain('Upload failed')
  })

  it('should generate mock EEG data and upload on generate button click', async () => {
    const mockOnUploadComplete = vi.fn()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cid: 'QmMockEEGCid', url: 'https://ipfs.io/ipfs/QmMockEEGCid' }),
    })

    render(<UploadButton userId="test-user" onUploadComplete={mockOnUploadComplete} />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/ipfs/upload', expect.any(Object))
    })
  })

  it('shows success toast when upload completes with txHash', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        cid: 'QmTestCid',
        url: 'https://ipfs.io/ipfs/QmTestCid',
        txHash: '0x1234567890abcdef'
      }),
    })

    render(<UploadButton userId="test-user" />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Data uploaded and stored on-chain!')
    })
  })

  it('shows success toast when upload completes without txHash (IPFS only)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    })

    render(<UploadButton userId="test-user" />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Data uploaded to IPFS (contract storage pending)')
    })
  })

  it('shows error toast when upload API returns error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Upload failed' }),
    })

    render(<UploadButton userId="test-user" />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload failed')
    })
  })

  it('shows error toast when network error occurs', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<UploadButton userId="test-user" />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  it('calls onUploadComplete callback with cid and url on success', async () => {
    const mockOnUploadComplete = vi.fn()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    })

    render(<UploadButton userId="test-user" onUploadComplete={mockOnUploadComplete} />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalledWith('QmTestCid', 'https://ipfs.io/ipfs/QmTestCid')
    })
  })

  it('shows spinner while uploading', async () => {
    // Mock fetch to delay so spinner is visible
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    }), 200)))

    render(<UploadButton />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    // Spinners should be visible during upload (both buttons have spinners)
    const spinners = screen.getAllByTestId('spinner')
    expect(spinners).toHaveLength(2)
    spinners.forEach(spinner => {
      expect(spinner).toHaveClass('animate-spin')
    })

    // Wait for upload to complete and spinners to disappear
    await waitFor(() => {
      expect(screen.queryAllByTestId('spinner')).toHaveLength(0)
    })
  })

  it('shows uploading text with spinner', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      ok: true,
      json: async () => ({ cid: 'QmTestCid', url: 'https://ipfs.io/ipfs/QmTestCid' }),
    }), 200)))

    render(<UploadButton />)

    const generateButton = screen.getByTestId('generate-mock-btn')
    fireEvent.click(generateButton)

    // Should show "Generating..." text while uploading
    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })
})
