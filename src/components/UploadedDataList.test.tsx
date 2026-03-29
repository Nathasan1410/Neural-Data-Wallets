import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UploadedDataList } from './UploadedDataList'

describe('UploadedDataList', () => {
  const mockData = [
    {
      dataId: BigInt(0),
      cid: 'QmABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
      timestamp: BigInt(1711411200),
      metadata: '0x'
    },
    {
      dataId: BigInt(1),
      cid: 'QmXYZ123456789ABCDEFGHIJKLMNOPQRSTUVW',
      timestamp: BigInt(1711497600),
      metadata: '0x'
    }
  ]

  it('should show loading state', () => {
    render(<UploadedDataList data={[]} isLoading={true} error={null} />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should show spinner while loading', () => {
    render(<UploadedDataList data={[]} isLoading={true} error={null} />)
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    render(<UploadedDataList data={[]} isLoading={false} error="Network error" />)
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })

  it('should show empty state when no data', () => {
    render(<UploadedDataList data={[]} isLoading={false} error={null} />)
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.getByText('No uploads yet')).toBeInTheDocument()
  })

  it('should display data table with uploaded items', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
  })

  it('should display table headers', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('CID')).toBeInTheDocument()
    expect(screen.getByText('Timestamp')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should truncate long CIDs', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    // First CID should be truncated: QmABCD...6789
    const truncatedCid = screen.getByText(/Qm[A-F0-9]{4}\.\.\.[A-F0-9]{4}/)
    expect(truncatedCid).toBeInTheDocument()
  })

  it('should format timestamp as readable date', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    // Timestamp 1711411200 = March 26, 2024
    const dates = screen.getAllByText(/2024/)
    expect(dates).toHaveLength(2)
    expect(dates[0]).toBeInTheDocument()
  })

  it('should have IPFS gateway link for each item', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    const links = screen.getAllByText('View on IPFS')
    expect(links).toHaveLength(2)

    expect(links[0]).toHaveAttribute('href', 'https://ipfs.io/ipfs/QmABCDEFGHIJKLMNOPQRSTUVWXYZ123456789')
    expect(links[1]).toHaveAttribute('href', 'https://ipfs.io/ipfs/QmXYZ123456789ABCDEFGHIJKLMNOPQRSTUVW')
  })

  it('should open IPFS links in new tab', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    const links = screen.getAllByText('View on IPFS')

    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('should display correct ID for each row', () => {
    render(<UploadedDataList data={mockData} isLoading={false} error={null} />)
    expect(screen.getByText('#0')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })
})
