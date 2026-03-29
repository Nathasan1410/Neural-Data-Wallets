'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '@/lib/contracts/neuralDataRegistry'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface RevokeAccessButtonProps {
  researcherAddress: string
  onSuccess?: () => void
}

export function RevokeAccessButton({ researcherAddress, onSuccess }: RevokeAccessButtonProps) {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (error) {
      toast.error(`Failed to revoke access: ${error.message}`)
      reset()
    }
  }, [error, reset])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Access revoked successfully!')
      onSuccess?.()
    }
  }, [isSuccess, onSuccess])

  const handleRevoke = () => {
    if (!researcherAddress) {
      toast.error('Please enter a researcher address')
      return
    }
    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'revokeAccess',
      args: [researcherAddress as `0x${string}`],
    })
  }

  const isLoading = isPending || isConfirming

  return (
    <button
      onClick={handleRevoke}
      disabled={isLoading || !researcherAddress}
      className="min-h-[44px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Confirming...' : 'Revoke Access'}
    </button>
  )
}
