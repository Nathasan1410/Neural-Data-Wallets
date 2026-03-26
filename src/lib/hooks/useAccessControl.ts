import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '../contracts/neuralDataRegistry'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

export function useAccessControl() {
  const { address: userAddress } = useAccount()
  const { data: hasAccessData, refetch: refetchHasAccess } = useReadContract({
    address: NEURAL_DATA_CONTRACT,
    abi: NEURAL_DATA_ABI,
    functionName: 'hasAccess',
    args: userAddress ? [userAddress, userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const grantAccess = (researcher: string) => {
    if (!userAddress) return

    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'grantAccess',
      args: [researcher as `0x${string}`],
    })
  }

  const revokeAccess = (researcher: string) => {
    if (!userAddress) return

    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'revokeAccess',
      args: [researcher as `0x${string}`],
    })
  }

  useEffect(() => {
    if (isSuccess) {
      refetchHasAccess()
    }
  }, [isSuccess, refetchHasAccess])

  return {
    isLoading: isPending || isConfirming,
    error,
    hasAccess: hasAccessData,
    grantAccess,
    revokeAccess,
    refetchHasAccess,
  }
}