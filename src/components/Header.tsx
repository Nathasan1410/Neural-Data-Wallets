'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
              CV
            </div>
            <span className="text-lg font-semibold hidden sm:inline">CortexVault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              href="/patient"
              className={`text-sm font-medium transition-colors ${
                isActive('/patient') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient
            </Link>
            <Link
              href="/researcher"
              className={`text-sm font-medium transition-colors ${
                isActive('/researcher') ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Researcher
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>

        <nav className="md:hidden mt-4 pt-4 border-t border-slate-200 flex gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/patient"
            className={`text-sm font-medium transition-colors ${
              isActive('/patient') ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Patient
          </Link>
          <Link
            href="/researcher"
            className={`text-sm font-medium transition-colors ${
              isActive('/researcher') ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Researcher
          </Link>
        </nav>
      </div>
    </header>
  )
}
