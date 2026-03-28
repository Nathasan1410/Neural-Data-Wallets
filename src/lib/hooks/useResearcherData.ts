import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
  ipfsLoading: boolean
}

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'

/**
 * Hook for fetching data accessible to a researcher.
 *
 * This hook queries the smart contract for data IDs the connected wallet has access to,
 * then fetches the metadata and IPFS content for each record.
 *
 * @returns Object containing accessible data, loading states, and errors
 */
export function useResearcherData(): UseResearcherDataReturn {
  const { address: userAddress } = useAccount()
  const [ipfsLoading, setIpfsLoading] = useState(false)
  const [accessibleData, setAccessibleData] = useState<AccessibleData[]>([])
  const [showToast, setShowToast] = useState(false)

  // Call getAllAccessibleData contract function
  const { data: contractData, isLoading, error } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getAllAccessibleData',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
    }
  })

  // Parse contract result and fetch IPFS data
  useEffect(() => {
    if (!contractData) {
      setAccessibleData([])
      return
    }

    const [dataIds, dataList] = contractData as [bigint[], { cid: string; timestamp: bigint; metadata: string }[]]

    if (!dataList || dataList.length === 0) {
      setAccessibleData([])
      return
    }

    const fetchData = async () => {
      setIpfsLoading(true)
      const results: AccessibleData[] = []
      let accessDeniedCount = 0

      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i]
        const record: AccessibleData = {
          dataId: dataIds[i],
          cid: item.cid,
          timestamp: item.timestamp,
          metadata: item.metadata,
        }

        // Fetch IPFS data from Pinata gateway
        try {
          const response = await fetch(`https://${PINATA_GATEWAY}/ipfs/${item.cid}`)
          if (response.ok) {
            record.ipfsData = await response.json()
          } else if (response.status === 403) {
            // Access denied - patient has revoked access or never granted
            record.ipfsError = 'Access denied - this data is no longer accessible'
            accessDeniedCount++
          } else {
            record.ipfsError = `IPFS fetch failed: ${response.status}`
          }
        } catch (err) {
          record.ipfsError = err instanceof Error ? err.message : 'Unknown IPFS error'
        }

        results.push(record)
      }

      // Show toast notification if ALL data access fails
      if (accessDeniedCount === dataList.length && !showToast) {
        toast.error('Some data inaccessible - access denied by contract')
        setShowToast(true)
      }

      setAccessibleData(results)
      setIpfsLoading(false)
    }

    fetchData()
  }, [contractData, showToast])

  return {
    accessibleData,
    isLoading,
    error: error?.message ?? null,
    ipfsLoading,
  }
}
