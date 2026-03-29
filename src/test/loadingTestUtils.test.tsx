import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import {
  assertSpinnerVisible,
  assertLoadingTextVisible,
  assertLoadingHidden,
  waitForLoadingComplete,
  waitForLoadingText,
} from '@/test/loadingTestUtils'

// Test component that renders a spinner
const SpinnerComponent = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div data-testid="loading-container">
        <div
          className="animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4"
          data-testid="spinner"
          role="status"
        />
        <span>Loading...</span>
      </div>
    )
  }
  return <div data-testid="content">Content loaded</div>
}

// Test component with custom loading text
const CustomLoadingComponent = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return (
      <div>
        <div className="animate-spin h-4 w-4" />
        <span>Uploading...</span>
      </div>
    )
  }
  return <div>Done</div>
}

describe('loadingTestUtils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('assertSpinnerVisible', () => {
    it('should find spinner by role=status', () => {
      render(<SpinnerComponent loading={true} />)
      const spinner = assertSpinnerVisible()
      expect(spinner).toBeInTheDocument()
    })

    it('should find spinner by animate-spin class', () => {
      render(<CustomLoadingComponent loading={true} />)
      const spinner = assertSpinnerVisible()
      expect(spinner).toBeInTheDocument()
    })

    it('should find spinner by data-testid=spinner', () => {
      render(<SpinnerComponent loading={true} />)
      const spinner = assertSpinnerVisible()
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('assertLoadingTextVisible', () => {
    it('should find generic Loading... text', () => {
      render(<SpinnerComponent loading={true} />)
      const element = assertLoadingTextVisible()
      expect(element).toBeInTheDocument()
    })

    it('should find specific loading text', () => {
      render(<CustomLoadingComponent loading={true} />)
      const element = assertLoadingTextVisible('Uploading...')
      expect(element).toBeInTheDocument()
      expect(element.textContent).toBe('Uploading...')
    })
  })

  describe('assertLoadingHidden', () => {
    it('should return true when no spinners present', () => {
      render(<SpinnerComponent loading={false} />)
      const result = assertLoadingHidden()
      expect(result).toBe(true)
    })

    it('should throw when spinner is present', () => {
      render(<SpinnerComponent loading={true} />)
      expect(() => assertLoadingHidden()).toThrow('Expected no spinners')
    })
  })

  describe('waitForLoadingComplete', () => {
    it('should resolve when spinner disappears', async () => {
      const { rerender } = render(<SpinnerComponent loading={true} />)

      // Simulate loading completing after 50ms
      setTimeout(() => {
        rerender(<SpinnerComponent loading={false} />)
      }, 50)

      await waitForLoadingComplete(1000)
      // If we get here without timeout, test passes
      expect(true).toBe(true)
    })
  })

  describe('waitForLoadingText', () => {
    it('should find loading text when it appears', async () => {
      const { rerender } = render(<div>Initial</div>)

      // Simulate loading text appearing after 50ms
      setTimeout(() => {
        rerender(<CustomLoadingComponent loading={true} />)
      }, 50)

      const element = await waitForLoadingText('Uploading...', 1000)
      expect(element).toBeInTheDocument()
    })
  })
})
