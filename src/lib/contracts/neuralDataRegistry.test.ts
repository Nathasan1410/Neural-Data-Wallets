import { describe, it, expect } from 'vitest'
import { NEURAL_DATA_CONTRACT, NEURAL_DATA_ABI } from './neuralDataRegistry'

describe('neuralDataRegistry contract', () => {
  describe('NEURAL_DATA_CONTRACT', () => {
    it('should be a valid Ethereum address', () => {
      expect(NEURAL_DATA_CONTRACT).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it('should be the deployed Base Sepolia address', () => {
      expect(NEURAL_DATA_CONTRACT).toBe('0x2700C2B1268B115cF06136b881341903aBC7DC4a')
    })
  })

  describe('NEURAL_DATA_ABI', () => {
    it('should be an array', () => {
      expect(Array.isArray(NEURAL_DATA_ABI)).toBe(true)
    })

    it('should contain uploadData function', () => {
      const uploadData = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'uploadData'
      )
      expect(uploadData).toBeDefined()
      expect(uploadData?.inputs).toEqual([{ name: 'cid', type: 'string' }])
      expect(uploadData?.outputs?.[0]?.type).toBe('uint256')
    })

    it('should contain grantAccess function', () => {
      const grantAccess = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'grantAccess'
      )
      expect(grantAccess).toBeDefined()
      expect(grantAccess?.inputs).toEqual([{ name: 'researcher', type: 'address' }])
    })

    it('should contain revokeAccess function', () => {
      const revokeAccess = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'revokeAccess'
      )
      expect(revokeAccess).toBeDefined()
      expect(revokeAccess?.inputs).toEqual([{ name: 'researcher', type: 'address' }])
    })

    it('should contain hasAccess view function', () => {
      const hasAccess = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'hasAccess'
      )
      expect(hasAccess).toBeDefined()
      expect(hasAccess?.stateMutability).toBe('view')
      expect(hasAccess?.inputs).toHaveLength(2)
      expect(hasAccess?.outputs?.[0]?.type).toBe('bool')
    })

    it('should contain getData view function', () => {
      const getData = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'getData'
      )
      expect(getData).toBeDefined()
      expect(getData?.stateMutability).toBe('view')
      expect(getData?.inputs).toEqual([{ name: 'dataId', type: 'uint256' }])
      expect(getData?.outputs?.[0]?.type).toBe('tuple')
    })

    it('should contain getDataCount view function', () => {
      const getDataCount = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'getDataCount'
      )
      expect(getDataCount).toBeDefined()
      expect(getDataCount?.stateMutability).toBe('view')
      expect(getDataCount?.inputs).toEqual([{ name: 'owner', type: 'address' }])
      expect(getDataCount?.outputs?.[0]?.type).toBe('uint256')
    })

    it('should contain DataRegistered event', () => {
      const dataRegistered = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'event' && item.name === 'DataRegistered'
      )
      expect(dataRegistered).toBeDefined()
      expect(dataRegistered?.inputs).toEqual([
        { name: 'owner', type: 'address', indexed: true },
        { name: 'cid', type: 'string', indexed: false },
        { name: 'timestamp', type: 'uint256', indexed: false }
      ])
    })

    it('should contain AccessGranted event', () => {
      const accessGranted = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'event' && item.name === 'AccessGranted'
      )
      expect(accessGranted).toBeDefined()
      expect(accessGranted?.inputs).toEqual([
        { name: 'owner', type: 'address', indexed: true },
        { name: 'researcher', type: 'address', indexed: true }
      ])
    })

    it('should contain AccessRevoked event', () => {
      const accessRevoked = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'event' && item.name === 'AccessRevoked'
      )
      expect(accessRevoked).toBeDefined()
      expect(accessRevoked?.inputs).toEqual([
        { name: 'owner', type: 'address', indexed: true },
        { name: 'researcher', type: 'address', indexed: true }
      ])
    })

    it('should have correct number of ABI entries', () => {
      expect(NEURAL_DATA_ABI).toHaveLength(12) // 9 functions + 3 events
    })

    it('should contain getAllAccessibleData function', () => {
      const getAllAccessibleData = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'getAllAccessibleData'
      )
      expect(getAllAccessibleData).toBeDefined()
      expect(getAllAccessibleData?.inputs).toEqual([
        { name: 'researcher', type: 'address' }
      ])
      expect(getAllAccessibleData?.outputs).toHaveLength(2)
    })

    it('should contain getDataByOwnerPaginated function', () => {
      const getDataByOwnerPaginated = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'getDataByOwnerPaginated'
      )
      expect(getDataByOwnerPaginated).toBeDefined()
      expect(getDataByOwnerPaginated?.inputs).toEqual([
        { name: 'owner', type: 'address' },
        { name: 'offset', type: 'uint256' },
        { name: 'limit', type: 'uint256' }
      ])
    })

    it('should contain hasAccessToData function', () => {
      const hasAccessToData = NEURAL_DATA_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'hasAccessToData'
      )
      expect(hasAccessToData).toBeDefined()
      expect(hasAccessToData?.inputs).toEqual([
        { name: 'user', type: 'address' },
        { name: 'researcher', type: 'address' }
      ])
      expect(hasAccessToData?.outputs).toEqual([
        { name: '', type: 'bool' }
      ])
    })
  })
})
