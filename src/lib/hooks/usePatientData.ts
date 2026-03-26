import { useReadContract } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'

export interface UploadedData {
  dataId: bigint
  cid: string
  timestamp: bigint
  metadata: string
}

export function usePatientData() {
  const { address: userAddress } = useAccount()

  const { data: dataCount, isLoading: isLoadingCount, refetch: refetchCount } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getDataCount',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const count = Number(dataCount || BigInt(0))

  const { data: data0 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 0 ? [BigInt(0)] : undefined,
    query: { enabled: count > 0 }
  })

  const { data: data1 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 1 ? [BigInt(1)] : undefined,
    query: { enabled: count > 1 }
  })

  const { data: data2 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 2 ? [BigInt(2)] : undefined,
    query: { enabled: count > 2 }
  })

  const { data: data3 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 3 ? [BigInt(3)] : undefined,
    query: { enabled: count > 3 }
  })

  const { data: data4 } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'getData',
    args: count > 4 ? [BigInt(4)] : undefined,
    query: { enabled: count > 4 }
  })

  const uploadedData: UploadedData[] = []

  if (data0) uploadedData.push({ dataId: BigInt(0), cid: data0.cid, timestamp: data0.timestamp, metadata: data0.metadata })
  if (data1) uploadedData.push({ dataId: BigInt(1), cid: data1.cid, timestamp: data1.timestamp, metadata: data1.metadata })
  if (data2) uploadedData.push({ dataId: BigInt(2), cid: data2.cid, timestamp: data2.timestamp, metadata: data2.metadata })
  if (data3) uploadedData.push({ dataId: BigInt(3), cid: data3.cid, timestamp: data3.timestamp, metadata: data3.metadata })
  if (data4) uploadedData.push({ dataId: BigInt(4), cid: data4.cid, timestamp: data4.timestamp, metadata: data4.metadata })

  const isLoading = isLoadingCount

  return {
    uploadedData,
    isLoading,
    error: null,
    refetch: refetchCount,
  }
}
