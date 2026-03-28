import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccessibleDataList } from './AccessibleDataList'

describe('AccessibleDataList', () => {
  const mockData = [
    {
      dataId: BigInt(0),
      cid: 'QmABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
      timestamp: BigInt(1711411200),
      metadata: '0x',
      ipfsData: { timestamp: '2024-03-26T00:00:00Z', duration: 30 },
      ipfsError: undefined
    },
    {
      dataId: BigInt(1),
      cid: 'QmXYZ123456789ABCDEFGHIJKLMNOPQRSTUVW',
      timestamp: BigInt(1711497600),
      metadata: '0x',
      ipfsData: { timestamp: '2024-03-27T00:00:00Z', duration: 60 },
      ipfsError: undefined
    }
  ]

  it('should show loading state', () => {
    render(
      <AccessibleDataList
        data={[]}
        isLoading={true}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should show error state', () => {
    render(
      <AccessibleDataList
        data={[]}
        isLoading={false}
        error="Network error"
        ipfsLoading={false}
      />
    )
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })

  it('should show empty state when no data', () => {
    render(
      <AccessibleDataList
        data={[]}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.getByText(/No data accessible/)).toBeInTheDocument()
  })

  it('should display data table with accessible items', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })

  it('should display table headers', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('CID')).toBeInTheDocument()
    expect(screen.getByText('Timestamp')).toBeInTheDocument()
    expect(screen.getByText('IPFS Data')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should truncate long CIDs', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    const truncatedCid = screen.getByText(/Qm[A-F0-9]{4}\.\.\.[A-F0-9]{4}/)
    expect(truncatedCid).toBeInTheDocument()
  })

  it('should format timestamp as readable date', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    const dates = screen.getAllByText(/2024/)
    expect(dates.length).toBeGreaterThan(0)
  })

  it('should have IPFS gateway link for each item', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    const links = screen.getAllByText('View on IPFS')
    expect(links).toHaveLength(2)
  })

  it('should open IPFS links in new tab', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    const links = screen.getAllByText('View on IPFS')
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('should display correct ID for each row', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByText('#0')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('should show IPFS data preview when ipfsData exists', () => {
    render(
      <AccessibleDataList
        data={mockData}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    // Should show JSON preview of ipfsData
    expect(screen.getByText(/"timestamp":"2024-03-26T00:00:00Z"/)).toBeInTheDocument()
  })

  it('should show ipfsError in red when present', () => {
    const dataWithError = [
      {
        dataId: BigInt(0),
        cid: 'QmABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
        timestamp: BigInt(1711411200),
        metadata: '0x',
        ipfsData: undefined,
        ipfsError: 'Failed to fetch from IPFS'
      }
    ]
    render(
      <AccessibleDataList
        data={dataWithError}
        isLoading={false}
        error={null}
        ipfsLoading={false}
      />
    )
    expect(screen.getByText('Failed to fetch from IPFS')).toBeInTheDocument()
  })
})
