'use client'

import { UploadedData } from '@/lib/hooks/usePatientData'
import { NeuralDataViewer } from '@/components/NeuralDataViewer'

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
      <div data-testid="loading" className="flex items-center justify-center p-8">
        <div
          className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full h-8 w-8"
          data-testid="spinner"
          role="status"
        />
        <span className="ml-3 text-gray-600">Loading data...</span>
      </div>
    )
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>
  }

  if (data.length === 0) {
    return <div data-testid="empty">No uploads yet</div>
  }

  return (
    <div className="overflow-x-auto" data-testid="data-table">
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
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex flex-col gap-2">
                  <NeuralDataViewer cid={item.cid} dataId={item.dataId} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
