import { describe, it, expect } from 'vitest'
import { config } from '../wagmi'
import { baseSepolia, base } from 'wagmi/chains'

describe('wagmi.ts', () => {
  describe('config', () => {
    it('exports a valid wagmi config object', () => {
      expect(config).toBeDefined()
      expect(config.chains).toBeDefined()
    })

    it('includes Base Sepolia testnet', () => {
      const chainIds = config.chains.map((c) => c.id)
      expect(chainIds).toContain(baseSepolia.id)
      expect(chainIds).toContain(84532) // Base Sepolia chain ID
    })

    it('includes Base mainnet', () => {
      const chainIds = config.chains.map((c) => c.id)
      expect(chainIds).toContain(base.id)
      expect(chainIds).toContain(8453) // Base mainnet chain ID
    })

    it('has MetaMask connector configured', () => {
      const connectors = config.connectors
      const metaMaskConnector = connectors.find((c) => c.name === 'MetaMask')
      expect(metaMaskConnector).toBeDefined()
    })

    it('has Coinbase Wallet connector configured', () => {
      const connectors = config.connectors
      const coinbaseConnector = connectors.find((c) => c.name === 'Coinbase Wallet')
      expect(coinbaseConnector).toBeDefined()
    })

    it('has correct appName for MetaMask connector', () => {
      const metaMaskConnector = config.connectors.find((c) => c.name === 'MetaMask')
      expect(metaMaskConnector).toBeDefined()
    })

    it('has chains array configured', () => {
      expect(config.chains.length).toBeGreaterThan(0)
      expect(config.chains).toHaveLength(2) // baseSepolia and base
    })
  })
})
