'use client'

interface AccessListProps {
  dataId: bigint
  grantedAddresses: string[]
  isLoading: boolean
}

export function AccessList({ dataId, grantedAddresses, isLoading }: AccessListProps) {
  if (isLoading) {
    return <div data-testid="access-loading" className="text-sm text-text-secondary">Loading accesses...</div>
  }

  if (!grantedAddresses || grantedAddresses.length === 0) {
    return <div data-testid="no-access" className="text-sm text-text-secondary">No access granted</div>
  }

  return (
    <div data-testid="access-list" className="space-y-2">
      <p className="text-sm font-medium text-text-primary">Granted to:</p>
      <div className="flex flex-wrap gap-2">
        {grantedAddresses.map((addr) => (
          <div
            key={addr}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-text-secondary font-mono"
          >
            <div className="w-2 h-2 rounded-full bg-success" />
            {addr}
          </div>
        ))}
      </div>
    </div>
  )
}
