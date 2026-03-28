import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IPFSDataViewer } from './IPFSDataViewer'

describe('IPFSDataViewer', () => {
  const mockEegData = {
    timestamp: '2024-03-26T00:00:00Z',
    duration: 30,
    sampleRate: 256,
    channels: ['Fp1', 'Fp2', 'F3', 'F4'],
    samples: [[1.2, 2.3, 3.4], [4.5, 5.6, 6.7]],
    metadata: {
      patient: 'patient-123',
      task: 'resting-state'
    }
  }

  it('should show loading state when loading prop is true', () => {
    render(<IPFSDataViewer data={null} loading={true} />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })

  it('should show error state when error prop is provided', () => {
    render(<IPFSDataViewer data={null} error="Failed to fetch data" />)
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument()
  })

  it('should show "No data available" for null data', () => {
    render(<IPFSDataViewer data={null} />)
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should show "No data available" for undefined data', () => {
    render(<IPFSDataViewer data={undefined} />)
    expect(screen.getByTestId('empty')).toBeInTheDocument()
  })

  it('should display JSON data in preformatted format', () => {
    render(<IPFSDataViewer data={mockEegData} />)
    expect(screen.getByTestId('data')).toBeInTheDocument()
  })

  it('should format nested EEG data structure correctly', () => {
    render(<IPFSDataViewer data={mockEegData} />)
    // Should display key EEG data fields
    expect(screen.getByText(/"timestamp":/)).toBeInTheDocument()
    expect(screen.getByText(/"duration":/)).toBeInTheDocument()
    expect(screen.getByText(/"sampleRate":/)).toBeInTheDocument()
    expect(screen.getByText(/"channels":/)).toBeInTheDocument()
  })

  it('should show parse error for invalid JSON string data', () => {
    render(<IPFSDataViewer data="invalid json{" />)
    expect(screen.getByTestId('error')).toBeInTheDocument()
    expect(screen.getByText(/Failed to parse data/)).toBeInTheDocument()
  })

  it('should apply scrollable container for large data', () => {
    const largeData = {
      ...mockEegData,
      samples: Array(1000).fill([1, 2, 3, 4])
    }
    render(<IPFSDataViewer data={largeData} />)
    const container = screen.getByTestId('data')
    expect(container).toHaveClass('max-h-96')
    expect(container).toHaveClass('overflow-auto')
  })
})
