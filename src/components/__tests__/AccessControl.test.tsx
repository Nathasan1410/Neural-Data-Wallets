import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AccessControl } from '@/components/AccessControl'

// Mock child components
vi.mock('@/components/GrantAccessButton', () => ({
  GrantAccessButton: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={() => onSuccess?.()} data-testid="grant-button">
      Grant Access
    </button>
  ),
}))

vi.mock('@/components/RevokeAccessButton', () => ({
  RevokeAccessButton: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={() => onSuccess?.()} data-testid="revoke-button">
      Revoke Access
    </button>
  ),
}))

describe('AccessControl', () => {
  it('should render access control section', () => {
    render(<AccessControl />)

    expect(screen.getByText('Manage Researcher Access')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/0x/)).toBeInTheDocument()
    expect(screen.getByTestId('grant-button')).toBeInTheDocument()
    expect(screen.getByTestId('revoke-button')).toBeInTheDocument()
  })

  it('should update researcher address input on change', () => {
    render(<AccessControl />)

    const input = screen.getByPlaceholderText(/0x/)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })

    expect(input).toHaveValue('0x1234567890123456789012345678901234567890')
  })

  it('should call onAccessGranted when grant succeeds', () => {
    const mockOnAccessGranted = vi.fn()
    const mockOnAccessRevoked = vi.fn()

    render(
      <AccessControl
        onAccessGranted={mockOnAccessGranted}
        onAccessRevoked={mockOnAccessRevoked}
      />
    )

    const input = screen.getByPlaceholderText(/0x/)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const grantButton = screen.getByTestId('grant-button')
    fireEvent.click(grantButton)

    expect(mockOnAccessGranted).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890')
  })

  it('should call onAccessRevoked when revoke succeeds', () => {
    const mockOnAccessGranted = vi.fn()
    const mockOnAccessRevoked = vi.fn()

    render(
      <AccessControl
        onAccessGranted={mockOnAccessGranted}
        onAccessRevoked={mockOnAccessRevoked}
      />
    )

    const input = screen.getByPlaceholderText(/0x/)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const revokeButton = screen.getByTestId('revoke-button')
    fireEvent.click(revokeButton)

    expect(mockOnAccessRevoked).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890')
  })

  it('should clear input after successful grant', () => {
    const mockOnAccessGranted = vi.fn()

    render(<AccessControl onAccessGranted={mockOnAccessGranted} />)

    const input = screen.getByPlaceholderText(/0x/)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const grantButton = screen.getByTestId('grant-button')
    fireEvent.click(grantButton)

    expect(input).toHaveValue('')
  })

  it('should clear input after successful revoke', () => {
    const mockOnAccessRevoked = vi.fn()

    render(<AccessControl onAccessRevoked={mockOnAccessRevoked} />)

    const input = screen.getByPlaceholderText(/0x/)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const revokeButton = screen.getByTestId('revoke-button')
    fireEvent.click(revokeButton)

    expect(input).toHaveValue('')
  })
})
