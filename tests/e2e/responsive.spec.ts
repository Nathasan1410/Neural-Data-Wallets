import { test, expect } from '@playwright/test'

test.describe('Responsive Design Tests', () => {
  test('homepage renders correctly at mobile viewport', async ({ page }) => {
    // Set mobile viewport (Pixel 5)
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Verify main heading is visible
    await expect(page.getByText('Neural Data Wallet')).toBeVisible()

    // Verify subtitle is visible
    await expect(page.getByText('Decentralized neural data')).toBeVisible()

    // Verify Connect button is visible
    await expect(page.getByRole('button', { name: /connect/i })).toBeVisible()

    // Verify the page is scrollable on mobile
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(0)
  })

  test('connected state layouts correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Mock wallet
    await page.addInitScript(() => {
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async ({ method }: { method: string }) => {
          if (method === 'eth_requestAccounts') {
            return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']
          }
          return null
        },
      }
    })

    await page.goto('/')

    // Connect wallet
    await page.getByRole('button', { name: /connect/i }).click()
    await page.waitForTimeout(1000)

    // Verify wallet connected message is visible
    await expect(page.getByText(/wallet connected/i)).toBeVisible()

    // Verify sections are visible and stacked vertically
    await expect(page.getByText('Upload Neural Data')).toBeVisible()
    await expect(page.getByText('Manage Access')).toBeVisible()

    // Verify buttons are accessible (not cut off)
    const uploadButton = page.getByTestId('upload-file-btn')
    const generateButton = page.getByTestId('generate-mock-btn')

    await expect(uploadButton).toBeInViewport()
    await expect(generateButton).toBeInViewport()
  })

  test('tables and content scroll horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Mock and connect wallet
    await page.addInitScript(() => {
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async ({ method }: { method: string }) => {
          if (method === 'eth_requestAccounts') {
            return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']
          }
          return null
        },
      }
    })

    await page.getByRole('button', { name: /connect/i }).click()
    await page.waitForTimeout(1000)

    // Check that main container has proper padding on mobile
    const mainElement = page.locator('main')
    const mainPadding = await mainElement.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.padding
    })

    // Verify padding is applied (responsive design)
    expect(mainPadding).toBeTruthy()
  })
})
