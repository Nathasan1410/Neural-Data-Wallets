'use client'

import { UploadedData } from '@/lib/hooks/usePatientData'

interface UploadedDataListProps {
  data: UploadedData[]
  isLoading: boolean
  error: string | null
}

export function UploadedDataList({ data, isLoading, error }: UploadedDataListProps) {
  const truncateCid = (cid: string) => {
    if (cid.length <= 10) return cid
    return `${cid.slice(0, 6)}...${cid.slice(-4)}`
  }

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  const getIpfsGatewayUrl = (cid: string) => {
    const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'ipfs.io'
    return `https://${gateway}/ipfs/${cid}`
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
        <p>No uploads yet</p>
        <p className="text-sm mt-1">Upload neural data to see it here</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.dataId.toString()} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                #{item.dataId.toString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
                {truncateCid(item.cid)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {formatTimestamp(item.timestamp)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <a
                  href={getIpfsGatewayUrl(item.cid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
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
