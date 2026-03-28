import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GrantAccessButton } from '@/components/GrantAccessButton'
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

describe('GrantAccessButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render grant access button', () => {
    render(<GrantAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(screen.getByText('Grant Access')).toBeInTheDocument()
  })

  it('should be disabled when no researcher address provided', () => {
    render(<GrantAccessButton researcherAddress="" />)

    expect(screen.getByText('Grant Access')).toBeDisabled()
  })

  it('should be disabled while transaction is pending', () => {
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: true,
      error: null,
      reset: vi.fn(),
    })

    render(<GrantAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

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

    render(<GrantAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    fireEvent.click(screen.getByText('Grant Access'))

    expect(mockWriteContract).toHaveBeenCalledWith({
      address: expect.any(String),
      abi: expect.any(Array),
      functionName: 'grantAccess',
      args: ['0x1234567890123456789012345678901234567890'],
    })
  })

  it('should call toast success on transaction success', () => {
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: true,
    })

    render(<GrantAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(toast.success).toHaveBeenCalledWith('Access granted successfully!')
  })

  it('should call toast error on transaction error', () => {
    vi.mocked(useWriteContract).mockReturnValue({
      data: '0xtesthash',
      writeContract: vi.fn(),
      isPending: false,
      error: new Error('Transaction failed'),
      reset: vi.fn(),
    })

    render(<GrantAccessButton researcherAddress="0x1234567890123456789012345678901234567890" />)

    expect(toast.error).toHaveBeenCalledWith('Failed to grant access: Transaction failed')
  })
})
