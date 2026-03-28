import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'

export interface UploadedData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
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

  const count = Math.min(Number(dataCount || BigInt(0)), MAX_DATA_ITEMS)

  // Pre-declare all possible data reads (hooks cannot be called in loops)
  const { data: data0, error: error0 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 0 ? [BigInt(0)] : undefined,
    query: { enabled: count > 0 }
  })

  const { data: data1, error: error1 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 1 ? [BigInt(1)] : undefined,
    query: { enabled: count > 1 }
  })

  const { data: data2, error: error2 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 2 ? [BigInt(2)] : undefined,
    query: { enabled: count > 2 }
  })

  const { data: data3, error: error3 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 3 ? [BigInt(3)] : undefined,
    query: { enabled: count > 3 }
  })

  const { data: data4, error: error4 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 4 ? [BigInt(4)] : undefined,
    query: { enabled: count > 4 }
  })

  const { data: data5, error: error5 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 5 ? [BigInt(5)] : undefined,
    query: { enabled: count > 5 }
  })

  const { data: data6, error: error6 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 6 ? [BigInt(6)] : undefined,
    query: { enabled: count > 6 }
  })

  const { data: data7, error: error7 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 7 ? [BigInt(7)] : undefined,
    query: { enabled: count > 7 }
  })

  const { data: data8, error: error8 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 8 ? [BigInt(8)] : undefined,
    query: { enabled: count > 8 }
  })

  const { data: data9, error: error9 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 9 ? [BigInt(9)] : undefined,
    query: { enabled: count > 9 }
  })

  const uploadedData: UploadedData[] = []
  const dataItems = [data0, data1, data2, data3, data4, data5, data6, data7, data8, data9]
  const errors = [error0, error1, error2, error3, error4, error5, error6, error7, error8, error9]

  for (let i = 0; i < count && i < dataItems.length; i++) {
    if (dataItems[i]) {
      uploadedData.push({
        dataId: BigInt(i),
        cid: dataItems[i]!.cid,
        timestamp: dataItems[i]!.timestamp,
        metadata: dataItems[i]!.metadata
      })
    }
  }

  const isLoading = isLoadingCount
  // Aggregate errors - use first error found
  const allErrors = [countError, ...errors]
  const error = allErrors.find(e => e !== undefined && e !== null) as Error | null

  return {
    uploadedData,
    isLoading,
    error: error?.message ?? null,
    refetch: refetchCount,
  }
}
