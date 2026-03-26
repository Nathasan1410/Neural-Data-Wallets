'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '@/lib/contracts/neuralDataRegistry'
import { useState } from 'react'

interface GrantAccessButtonProps {
  researcherAddress: string
  onSuccess?: () => void
}

export function GrantAccessButton({ researcherAddress, onSuccess }: GrantAccessButtonProps) {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleGrant = () => {
    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'grantAccess',
      args: [researcherAddress as `0x${string}`],
    })
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGrant}
        disabled={isLoading || !researcherAddress}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Confirming...' : 'Grant Access'}
      </button>

      {error && (
        <p className="text-red-600 text-sm">Error: {error.message}</p>
      )}

      {isSuccess && (
        <p className="text-green-600 text-sm">Access granted successfully!</p>
      )}
    </div>
  )
}