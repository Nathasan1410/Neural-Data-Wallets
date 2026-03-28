'use client'

export interface AccessibleData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
  ipfsData?: any
  ipfsError?: string
}

export interface UseResearcherDataReturn {
  accessibleData: AccessibleData[]
  isLoading: boolean
  error: string | null
  ipfsLoading: Record<string, boolean>
}

/**
 * Hook for fetching data accessible to a researcher.
 *
 * This hook queries the smart contract for data IDs the connected wallet has access to,
 * then fetches the metadata and IPFS content for each record.
 *
 * @returns Object containing accessible data, loading states, and errors
 */
export function useResearcherData(): UseResearcherDataReturn {
  // TODO: Implement contract integration in 05-03
  // For now, return mock data for component development
  return {
    accessibleData: [],
    isLoading: false,
    error: null,
    ipfsLoading: {}
  }
}
