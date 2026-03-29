import { test, expect } from '@playwright/test'

test.describe('Neural Data Wallet E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock window.ethereum for wallet connection
    await page.addInitScript(() => {
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async ({ method }: { method: string }) => {
          if (method === 'eth_requestAccounts') {
            return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']
          }
          if (method === 'eth_chainId') {
            return '0x14a33' // 84532 in hex (Base Sepolia)
          }
          if (method === 'eth_accounts') {
            return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']
          }
          return null
        },
        on: () => {},
        removeListener: () => {},
      }
    })
  })

  test('patient can connect wallet and generate mock EEG data', async ({ page }) => {
    await page.goto('/')

    // Verify homepage loads
    await expect(page.getByText('Neural Data Wallet')).toBeVisible()

    // Click Connect Button (RainbowKit)
    await page.getByRole('button', { name: /connect/i }).click()

    // Wait for wallet connection (mocked)
    await page.waitForTimeout(1000)

    // Verify wallet connected message appears
    await expect(page.getByText(/wallet connected/i)).toBeVisible()

    // Click Generate Mock EEG button
    await page.getByTestId('generate-mock-btn').click()

    // Wait for upload to complete
    await page.waitForTimeout(2000)

    // Verify success toast appears
    await expect(page.getByText(/data uploaded/i)).toBeVisible()
  })

  test('homepage shows upload and access control sections when connected', async ({ page }) => {
    await page.goto('/')

    // Mock wallet connection before page loads
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

    // Connect wallet
    await page.getByRole('button', { name: /connect/i }).click()
    await page.waitForTimeout(1000)

    // Verify Upload Neural Data section is visible
    await expect(page.getByText('Upload Neural Data')).toBeVisible()

    // Verify Manage Access section is visible
    await expect(page.getByText('Manage Access')).toBeVisible()

    // Verify upload button is enabled
    await expect(page.getByTestId('upload-file-btn')).toBeEnabled()
    await expect(page.getByTestId('generate-mock-btn')).toBeEnabled()
  })
})
