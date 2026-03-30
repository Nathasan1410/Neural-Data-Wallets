'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo/Branding */}
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center text-white text-sm font-bold">
              CV
            </div>
            <span className="text-lg font-semibold hidden sm:inline">CortexVault</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-700 border-b-2 border-primary-700'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/patient"
              className={`text-sm font-medium transition-colors ${
                isActive('/patient')
                  ? 'text-primary-700 border-b-2 border-primary-700'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Patient
            </Link>
            <Link
              href="/researcher"
              className={`text-sm font-medium transition-colors ${
                isActive('/researcher')
                  ? 'text-primary-700 border-b-2 border-primary-700'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Researcher
            </Link>
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 pt-4 border-t border-border flex gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-primary-700'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            href="/patient"
            className={`text-sm font-medium transition-colors ${
              isActive('/patient')
                ? 'text-primary-700'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Patient
          </Link>
          <Link
            href="/researcher"
            className={`text-sm font-medium transition-colors ${
              isActive('/researcher')
                ? 'text-primary-700'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Researcher
          </Link>
        </nav>
      </div>
    </header>
  )
}
