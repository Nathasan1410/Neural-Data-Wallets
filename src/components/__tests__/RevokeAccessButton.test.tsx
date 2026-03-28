import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RevokeAccessButton } from '@/components/RevokeAccessButton'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(() => ({
    data: '0xtesthash',
    writeContract: vi.fn(),
    isPending: false,
    error: null,
    reset: vi.fn(),
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import toast from 'react-hot-toast'

describe('RevokeAccessButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render revoke access button', () => {
    render(<RevokeAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(screen.getByText('Revoke Access')).toBeInTheDocument()
  })

  it('should be disabled when no researcher address provided', () => {
    render(<RevokeAccessButton researcherAddress="" />)

    expect(screen.getByText('Revoke Access')).toBeDisabled()
  })

  it('should be disabled while transaction is pending', () => {
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: true,
      error: null,
      reset: vi.fn(),
    })

    render(<RevokeAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(screen.getByText('Confirming...')).toBeDisabled()
  })

  it('should call writeContract with correct arguments when clicked', () => {
    const mockWriteContract = vi.fn()
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: mockWriteContract,
      isPending: false,
      error: null,
      reset: vi.fn(),
    })

    render(<RevokeAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    fireEvent.click(screen.getByText('Revoke Access'))

    expect(mockWriteContract).toHaveBeenCalledWith({
      address: expect.any(String),
      abi: expect.any(Array),
      functionName: 'revokeAccess',
      args: ['0x1234567890123456789012345678901234567890'],
    })
  })

  it('should call toast success on transaction success', () => {
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: true,
    })

    render(<RevokeAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(toast.success).toHaveBeenCalledWith('Access revoked successfully!')
  })

  it('should call toast error on transaction error', () => {
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: false,
      error: new Error('Transaction failed'),
      reset: vi.fn(),
    })

    render(<RevokeAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(toast.error).toHaveBeenCalledWith('Failed to revoke access: Transaction failed')
  })
})
