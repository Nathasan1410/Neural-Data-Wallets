'use client'

import { useState } from 'react'
import { GrantAccessButton } from './GrantAccessButton'
import { RevokeAccessButton } from './RevokeAccessButton'

interface AccessControlProps {
  onAccessGranted?: (address: string) => void
  onAccessRevoked?: (address: string) => void
}

export function AccessControl({ onAccessGranted, onAccessRevoked }: AccessControlProps) {
  const [researcherAddress, setResearcherAddress] = useState('')

  const isValidAddress = researcherAddress.length === 42 && researcherAddress.startsWith('0x')

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Manage Researcher Access</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Researcher Address
          </label>
          <input
            type="text"
            value={researcherAddress}
            onChange={(e) => setResearcherAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-2">
          <GrantAccessButton
            researcherAddress={researcherAddress}
            onSuccess={() => {
              onAccessGranted?.(researcherAddress)
              setResearcherAddress('')
            }}
          />

          <RevokeAccessButton
            researcherAddress={researcherAddress}
            onSuccess={() => {
              onAccessRevoked?.(researcherAddress)
              setResearcherAddress('')
            }}
          />
        </div>
      </div>
    </div>
  )
}