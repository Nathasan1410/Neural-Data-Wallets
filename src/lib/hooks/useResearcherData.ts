import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

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
          } else {
            record.ipfsError = `IPFS fetch failed: ${response.status}`
          }
        } catch (err) {
          record.ipfsError = err instanceof Error ? err.message : 'Unknown IPFS error'
        }

        results.push(record)
      }

      setAccessibleData(results)
      setIpfsLoading(false)
    }

    fetchData()
  }, [contractData])

  return {
    accessibleData,
    isLoading,
    error: error?.message ?? null,
    ipfsLoading,
  }
}
