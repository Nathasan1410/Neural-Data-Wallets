'use client'

interface AccessListProps {
  dataId: bigint
  grantedAddresses: string[]
  isLoading: boolean
}

export function AccessList({ dataId, grantedAddresses, isLoading }: AccessListProps) {
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <div className="mt-2 space-y-2">
        <div className="animate-pulse bg-gray-100 rounded h-6 w-32"></div>
      </div>
    )
  }

  if (!grantedAddresses || grantedAddresses.length === 0) {
    return (
      <div className="mt-2 text-sm text-gray-500 italic">
        No access granted
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium text-gray-500 uppercase">Granted to:</p>
      <div className="flex flex-wrap gap-2">
        {grantedAddresses.map((address, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200"
          >
            {truncateAddress(address)}
          </span>
        ))}
      </div>
    </div>
  )
}
