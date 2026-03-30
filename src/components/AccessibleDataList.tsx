'use client'

import { AccessibleData } from '@/lib/hooks/useResearcherData'

interface AccessibleDataListProps {
  data: AccessibleData[]
  isLoading: boolean
  error: string | null
  ipfsLoading: boolean
}

export function AccessibleDataList({
  data,
  isLoading,
  error,
  ipfsLoading
}: AccessibleDataListProps) {
  const truncateCid = (cid: string) => {
    if (cid.length <= 10) return cid
    return `${cid.slice(0, 6)}...${cid.slice(-4)}`
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const getIpfsGatewayUrl = (cid: string) => {
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
    return `https://${gateway}/ipfs/${cid}`
  }

  const getIpfsDataPreview = (ipfsData: any) => {
    if (!ipfsData) return 'No data'
    const jsonStr = JSON.stringify(ipfsData)
    if (jsonStr.length <= 100) return jsonStr
    return jsonStr.slice(0, 100) + '...'
  }

  if (isLoading) {
    return (
      <div data-testid="loading" className="flex flex-col items-center justify-center p-12">
        <div
          className="animate-spin border-4 border-primary-700 border-t-transparent rounded-full h-8 w-8 mb-3"
          data-testid="spinner"
          role="status"
        />
        <span className="text-text-secondary text-sm">Loading accessible data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="error" className="p-4 bg-error/10 border border-error text-error rounded-md text-sm">
        Error: {error}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div data-testid="empty" className="p-8 text-center text-text-secondary">
        No data accessible. Ask patients to grant you access.
      </div>
    )
  }

  return (
    <div data-testid="data-table" className="overflow-x-auto border border-border rounded-md">
      <table className="w-full">
        <thead className="bg-surface border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              CID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              IPFS Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr key={item.dataId.toString()} className="hover:bg-surface/50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-text-primary">
                #{item.dataId.toString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-text-secondary">
                {truncateCid(item.cid)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                {formatTimestamp(item.timestamp)}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary">
                {item.ipfsError ? (
                  <span className="text-error">{item.ipfsError}</span>
                ) : ipfsLoading ? (
                  <span className="text-text-secondary">Loading...</span>
                ) : (
                  <pre className="text-xs bg-surface p-2 rounded max-w-xs overflow-hidden text-ellipsis font-mono">
                    {getIpfsDataPreview(item.ipfsData)}
                  </pre>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <a
                  href={getIpfsGatewayUrl(item.cid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-700 hover:text-primary-800 transition-colors font-medium"
                >
                  View on IPFS
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
