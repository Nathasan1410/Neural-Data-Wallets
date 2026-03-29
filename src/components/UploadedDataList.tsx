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
    <table data-testid="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>CID</th>
          <th>Timestamp</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.dataId.toString()}>
            <td>#{item.dataId.toString()}</td>
            <td>{truncateCid(item.cid)}</td>
            <td>{formatTimestamp(item.timestamp)}</td>
            <td>
              <a
                href={getIpfsGatewayUrl(item.cid)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on IPFS
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
