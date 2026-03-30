import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Neural Data Wallet - CortexVault',
  description: 'Decentralized neural data storage and sharing with IPFS and Web3',
  keywords: ['neural data', 'EEG', 'Web3', 'IPFS', 'healthcare', 'blockchain'],
  authors: [{ name: 'CortexVault Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
}

export const viewport: Viewport = {
  themeColor: '#1E40AF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
