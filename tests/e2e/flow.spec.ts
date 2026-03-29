import { test, expect } from '@playwright/test'

test.describe('Neural Data Wallet E2E Flow', () => {
  test('homepage loads and displays expected content', async ({ page }) => {
    await page.goto('/')

    // Verify main heading
    await expect(page.getByText('Neural Data Wallet')).toBeVisible()
    
    // Verify subtitle
    await expect(page.getByText('Decentralized neural data storage with IPFS')).toBeVisible()

    // Verify Connect button is present
    await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible()
  })

  test('wallet connection modal opens when clicking Connect', async ({ page }) => {
    await page.goto('/')

    // Click Connect Button
    await page.getByRole('button', { name: 'Connect Wallet' }).click()

    // Verify the RainbowKit modal opens
    await expect(page.getByText('Connect a Wallet')).toBeVisible()
    
    // Verify the dialog is visible
    const modal = page.getByRole('dialog', { name: 'Connect a Wallet' })
    await expect(modal).toBeVisible({ timeout: 5000 })
  })

  test('connected state shows upload sections after manual connection', async ({ page }) => {
    // Note: This test requires a real wallet connection or browser extension
    // For CI/CD, use wallet mocking library like synpress
    test.skip(true, 'Requires real wallet connection - use synpress for CI')
    
    await page.goto('/')
    
    // Would connect wallet here with real extension
    // Then verify:
    // - "Wallet connected!" message
    // - Upload Neural Data section
    // - Manage Access section
    await expect(true).toBeTruthy()
  })
})
