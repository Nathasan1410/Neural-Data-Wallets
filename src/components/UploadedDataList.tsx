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
      <div data-testid="loading" className="flex flex-col items-center justify-center p-12">
        <div
          className="animate-spin border-4 border-primary-700 border-t-transparent rounded-full h-8 w-8 mb-3"
          data-testid="spinner"
          role="status"
        />
        <span className="text-text-secondary text-sm">Loading data...</span>
      </div>
    )
  }

  if (error) {
    return <div data-testid="error" className="p-4 bg-error/10 border border-error text-error rounded-md text-sm">Error: {error}</div>
  }

  if (data.length === 0) {
    return <div data-testid="empty" className="p-8 text-center text-text-secondary">No uploads yet</div>
  }

  return (
    <div className="overflow-x-auto border border-border rounded-md" data-testid="data-table">
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
