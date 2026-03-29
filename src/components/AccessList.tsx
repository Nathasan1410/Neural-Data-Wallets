'use client'

interface AccessListProps {
  dataId: bigint
  grantedAddresses: string[]
  isLoading: boolean
}

export function AccessList({ dataId, grantedAddresses, isLoading }: AccessListProps) {
  if (isLoading) {
    return <div data-testid="access-loading">Loading accesses...</div>
  }

  if (!grantedAddresses || grantedAddresses.length === 0) {
    return <div data-testid="no-access">No access granted</div>
  }

  return (
    <div data-testid="access-list">
      <strong>Granted to:</strong>
      <ul>
        {grantedAddresses.map((addr) => (
          <li key={addr}>{addr}</li>
        ))}
      </ul>
    </div>
  )
}
