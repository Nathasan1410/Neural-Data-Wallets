'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { NEURAL_DATA_ABI, NEURAL_DATA_CONTRACT } from '@/lib/contracts/neuralDataRegistry'
import { useState } from 'react'

interface RevokeAccessButtonProps {
  researcherAddress: string
  onSuccess?: () => void
}

export function RevokeAccessButton({ researcherAddress, onSuccess }: RevokeAccessButtonProps) {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleRevoke = () => {
    writeContract({
      address: NEURAL_DATA_CONTRACT,
      abi: NEURAL_DATA_ABI,
      functionName: 'revokeAccess',
      args: [researcherAddress as `0x${string}`],
    })
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleRevoke}
        disabled={isLoading || !researcherAddress}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Confirming...' : 'Revoke Access'}
      </button>

      {error && (
        <p className="text-red-600 text-sm">Error: {error.message}</p>
      )}

      {isSuccess && (
        <p className="text-green-600 text-sm">Access revoked successfully!</p>
      )}
    </div>
  )
}