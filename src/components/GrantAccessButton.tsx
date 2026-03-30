'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '@/lib/contracts/neuralDataRegistry'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface GrantAccessButtonProps {
  researcherAddress: string
  onSuccess?: () => void
}

export function GrantAccessButton({ researcherAddress, onSuccess }: GrantAccessButtonProps) {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (error) {
      toast.error(`Failed to grant access: ${error.message}`)
      reset()
    }
  }, [error, reset])

  useEffect(() => {
    if (isSuccess) {
      toast.success('Access granted successfully!')
      onSuccess?.()
    }
  }, [isSuccess, onSuccess])

  const handleGrant = () => {
    if (!researcherAddress) {
      toast.error('Please enter a researcher address')
      return
    }
    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'grantAccess',
      args: [researcherAddress as `0x${string}`],
    })
  }

  const isLoading = isPending || isConfirming

  return (
    <button
      onClick={handleGrant}
      disabled={isLoading || !researcherAddress}
      className="inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 bg-success text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
    >
      {isLoading && (
        <div className="animate-spin border-2 border-current border-t-transparent rounded-full h-4 w-4" />
      )}
      <span>{isLoading ? 'Confirming...' : 'Grant Access'}</span>
    </button>
  )
}
