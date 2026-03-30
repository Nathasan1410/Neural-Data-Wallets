import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'

export interface UploadedData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string | `0x${string}`
}

const MAX_DATA_ITEMS = 20 // Maximum items to fetch per user

export function usePatientData() {
  const { address: userAddress } = useAccount()

  const { data: dataCount, isLoading: isLoadingCount, error: countError, refetch: refetchCount } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getDataCount',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
    }
  })

  const count = Number(dataCount || BigInt(0))
  const limit = Math.min(count, MAX_DATA_ITEMS)

  // Fetch actual dataIds owned by the user
  const { data: dataIdsArray } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getDataIdsByOwner',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      retry: 2,
      retryDelay: 1000,
    }
  })

  // Use getDataByOwnerPaginated to fetch all data in one call
  const { data: paginatedData, isLoading: isLoadingData, error: dataError } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getDataByOwnerPaginated',
    args: userAddress && limit > 0 ? [userAddress, BigInt(0), BigInt(limit)] : undefined,
    query: {
      enabled: !!userAddress && limit > 0,
      retry: 2,
      retryDelay: 1000,
    }
  })

  // Build uploadedData with ACTUAL dataIds from contract
  let uploadedData: UploadedData[] = []
  if (dataIdsArray && paginatedData) {
    const slicedIds = dataIdsArray.slice(0, limit)
    uploadedData = slicedIds
      .map((dataId, index) => {
        const item = paginatedData[index]
        if (!item) return null
        return {
          dataId,
          cid: item.cid,
          timestamp: item.timestamp,
          metadata: item.metadata
        } as UploadedData
      })
      .filter((item): item is UploadedData => item !== null)
  }

  const isLoading = isLoadingCount || isLoadingData
  const error = (countError || dataError)?.message ?? null

  return {
    uploadedData,
    isLoading,
    error,
    refetch: refetchCount,
  }
}
