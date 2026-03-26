import type { Metadata } from 'next'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Providers } from './providers'

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
      </body>
    </html>
  )
}