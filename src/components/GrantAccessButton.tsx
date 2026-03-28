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
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Confirming...' : 'Grant Access'}
    </button>
  )
}
