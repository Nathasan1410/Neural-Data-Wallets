import { screen, waitFor } from '@testing-library/react'

/**
 * Assert that a loading spinner is visible on the screen.
 * Looks for elements with animate-spin class or data-testid="spinner".
 */
export function assertSpinnerVisible(container?: HTMLElement) {
  const spinner = container
    ? container.querySelector('[class*="animate-spin"]') ||
      container.querySelector('[data-testid="spinner"]')
    : screen.queryByRole('status') ||
      document.querySelector('[class*="animate-spin"]') ||
      document.querySelector('[data-testid="spinner"]')

  if (!spinner) {
    throw new Error('Spinner not found')
  }
  return spinner
}

/**
 * Assert that loading text is present on the screen.
 * Looks for common loading text patterns.
 */
export function assertLoadingTextVisible(expectedText?: string) {
  const patterns = [
    expectedText,
    'Loading...',
    'Uploading...',
    'Generating...',
    'Confirming...',
    'Loading accessible data...',
    'Fetching data from IPFS...',
    'Loading data...',
    'Loading accesses...',
  ].filter(Boolean) as string[]

  for (const text of patterns) {
    const element = screen.queryByText(text)
    if (element) {
      return element
    }
  }

  // Fall back to data-testid
  const loadingElement = screen.queryByTestId(/loading|spinner/i)
  if (loadingElement) {
    return loadingElement
  }

  throw new Error(
    `No loading text found. Expected one of: ${patterns.join(', ')}`
  )
}

/**
 * Assert that loading state is hidden (spinner and loading text not visible).
 * Returns true if no loading elements found, throws otherwise.
 */
export function assertLoadingHidden(): boolean {
  const spinners = document.querySelectorAll('[class*="animate-spin"]')
  if (spinners.length > 0) {
    throw new Error(`Expected no spinners, but found ${spinners.length}`)
  }

  const loadingElements = screen.queryAllByTestId(/loading|spinner/i)
  if (loadingElements.length > 0) {
    throw new Error(`Expected no loading elements, but found ${loadingElements.length}`)
  }

  return true
}

/**
 * Wait for loading to complete by waiting for spinner to disappear.
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 */
export async function waitForLoadingComplete(timeout = 5000) {
  await waitFor(() => {
    const spinners = document.querySelectorAll('[class*="animate-spin"]')
    if (spinners.length > 0) {
      throw new Error('Spinner still visible')
    }
  }, { timeout })
}

/**
 * Wait for a specific loading text to appear.
 * @param text - The loading text to wait for
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 */
export async function waitForLoadingText(text: string, timeout = 5000) {
  const element = await screen.findByText(text, {}, { timeout })
  return element
}
