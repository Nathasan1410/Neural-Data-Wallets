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
    <div className="p-6 bg-surface border border-border rounded-md">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Manage Researcher Access</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Researcher Address
          </label>
          <input
            type="text"
            value={researcherAddress}
            onChange={(e) => setResearcherAddress(e.target.value)}
            placeholder="0x..."
            className="min-h-11 w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
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
