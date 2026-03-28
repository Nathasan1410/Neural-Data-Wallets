import type { Metadata } from 'next'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Neural Data Wallet',
  description: 'Decentralized neural data storage with IPFS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}