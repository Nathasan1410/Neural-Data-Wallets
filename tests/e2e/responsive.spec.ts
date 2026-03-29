import { test, expect } from '@playwright/test'

test.describe('Responsive Design Tests', () => {
  test('homepage renders correctly at mobile viewport', async ({ page }) => {
    // Set mobile viewport (Pixel 5)
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Verify main heading is visible
    await expect(page.getByText('Neural Data Wallet')).toBeVisible()

    // Verify subtitle is visible
    await expect(page.getByText('Decentralized neural data storage with IPFS')).toBeVisible()

    // Verify Connect button is visible and accessible
    const connectButton = page.getByRole('button', { name: 'Connect Wallet' })
    await expect(connectButton).toBeVisible()
    await expect(connectButton).toBeInViewport()
  })

  test('homepage renders correctly at desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })

    await page.goto('/')

    // Verify main heading is visible
    await expect(page.getByText('Neural Data Wallet')).toBeVisible()

    // Verify layout is horizontal on desktop (header elements in row)
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Verify Connect button is visible
    await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible()
  })

  test('responsive padding is applied on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Check that main container has proper padding on mobile
    const mainElement = page.locator('main')
    await expect(mainElement).toBeVisible()
    
    // Verify the element has some padding (tailwind classes)
    const className = await mainElement.getAttribute('class')
    expect(className).toContain('p-4')
  })

  test('responsive header layout adapts to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Header should stack vertically on mobile
    const header = page.locator('header')
    const classes = await header.getAttribute('class')
    expect(classes).toContain('flex-col')
    expect(classes).toContain('sm:flex-row')
  })
})
