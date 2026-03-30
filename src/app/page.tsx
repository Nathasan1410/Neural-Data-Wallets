'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            {/* Hero Section */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
                Neural Data Wallet
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Secure, decentralized neural data management powered by IPFS and Web3. Control your EEG data and share it with researchers on your terms.
              </p>
              
              {isConnected ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/patient"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-800 transition-colors"
                  >
                    Patient Dashboard
                  </Link>
                  <Link
                    href="/researcher"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white border border-primary-700 text-primary-700 font-medium rounded-md hover:bg-surface transition-colors"
                  >
                    Researcher Dashboard
                  </Link>
                </div>
              ) : (
                <p className="text-text-secondary">Connect your wallet to get started</p>
              )}
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 bg-surface border border-[#E2E8F0] rounded-md">
                <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  🔒
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Secure & Private</h3>
                <p className="text-text-secondary text-sm">
                  Your neural data is encrypted and stored on IPFS with smart contract-based access control.
                </p>
              </div>

              <div className="p-6 bg-surface border border-[#E2E8F0] rounded-md">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  🧠
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">EEG Visualization</h3>
                <p className="text-text-secondary text-sm">
                  View detailed EEG waveforms and brain wave analysis with real-time frequency band data.
                </p>
              </div>

              <div className="p-6 bg-surface border border-[#E2E8F0] rounded-md">
                <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center text-white text-xl mb-4">
                  ⛓️
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Web3 Native</h3>
                <p className="text-text-secondary text-sm">
                  Full Web3 integration with wallet authentication and on-chain data provenance.
                </p>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-surface border border-[#E2E8F0] rounded-md p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Upload</h4>
                  <p className="text-sm text-text-secondary">
                    Upload your EEG data as JSON files
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Store</h4>
                  <p className="text-sm text-text-secondary">
                    Data stored on IPFS with blockchain proof
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Share</h4>
                  <p className="text-sm text-text-secondary">
                    Grant selective access to researchers
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    4
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Analyze</h4>
                  <p className="text-sm text-text-secondary">
                    Researchers access and analyze data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
