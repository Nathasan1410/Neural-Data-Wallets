import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccessList } from './AccessList'

describe('AccessList', () => {
  it('should show loading state', () => {
    render(
      <AccessList
        dataId={BigInt(0)}
        grantedAddresses={[]}
        isLoading={true}
      />
    )
    expect(screen.getByTestId('access-loading')).toBeInTheDocument()
  })

  it('should show "no access granted" when empty', () => {
    render(
      <AccessList
        dataId={BigInt(0)}
        grantedAddresses={[]}
        isLoading={false}
      />
    )
    expect(screen.getByTestId('no-access')).toBeInTheDocument()
    expect(screen.getByText('No access granted')).toBeInTheDocument()
  })

  it('should show "no access granted" when null', () => {
    render(
      <AccessList
        dataId={BigInt(0)}
        grantedAddresses={null as any}
        isLoading={false}
      />
    )
    expect(screen.getByTestId('no-access')).toBeInTheDocument()
  })

  it('should display list of granted addresses', () => {
    const addresses = [
      '0x1234567890123456789012345678901234567890',
      '0xABCDEF1234567890ABCDEF1234567890ABCDEF12'
    ]

    render(
      <AccessList
        dataId={BigInt(0)}
        grantedAddresses={addresses}
        isLoading={false}
      />
    )

    expect(screen.getByTestId('access-list')).toBeInTheDocument()
    expect(screen.getByText('Granted to:')).toBeInTheDocument()
    expect(screen.getByText(addresses[0])).toBeInTheDocument()
    expect(screen.getByText(addresses[1])).toBeInTheDocument()
  })

  it('should render multiple addresses as list items', () => {
    const addresses = [
      '0x1234567890123456789012345678901234567890',
      '0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
      '0x9999999999999999999999999999999999999999'
    ]

    render(
      <AccessList
        dataId={BigInt(0)}
        grantedAddresses={addresses}
        isLoading={false}
      />
    )

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })
})
