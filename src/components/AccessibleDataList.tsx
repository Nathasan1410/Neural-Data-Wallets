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
      <div data-testid="loading" className="flex items-center justify-center p-8">
        <div
          className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full h-8 w-8"
          data-testid="spinner"
          role="status"
        />
        <span className="ml-3 text-gray-600">Loading accessible data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="error" className="p-4 text-red-600">
        Error: {error}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div data-testid="empty" className="p-4 text-gray-500">
        No data accessible. Ask patients to grant you access.
      </div>
    )
  }

  return (
    <div data-testid="data-table" className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IPFS Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.dataId.toString()}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                #{item.dataId.toString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                {truncateCid(item.cid)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatTimestamp(item.timestamp)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {item.ipfsError ? (
                  <span className="text-red-600">{item.ipfsError}</span>
                ) : ipfsLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (
                  <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-hidden text-ellipsis">
                    {getIpfsDataPreview(item.ipfsData)}
                  </pre>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <a
                  href={getIpfsGatewayUrl(item.cid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
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
