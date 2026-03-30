'use client'

interface IPFSDataViewerProps {
  data: any
  loading?: boolean
  error?: string
}

export function IPFSDataViewer({ data, loading, error }: IPFSDataViewerProps) {
  // Loading state
  if (loading) {
    return (
      <div
        data-testid="loading"
        className="p-4 text-text-secondary flex items-center gap-2 text-sm"
      >
        <span className="animate-pulse">Loading data...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        data-testid="error"
        className="p-4 text-error bg-error/10 rounded-md border border-error"
      >
        {error}
      </div>
    )
  }

  // Empty state
  if (!data) {
    return (
      <div
        data-testid="empty"
        className="p-4 text-text-secondary text-center text-sm"
      >
        No data available
      </div>
    )
  }

  // Handle string data (attempt to parse JSON)
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      return (
        <div
          data-testid="error"
          className="p-4 text-error bg-error/10 rounded-md border border-error"
        >
          Failed to parse data: {(e as Error).message}
        </div>
      )
    }
  }

  // Format JSON for display
  const jsonString = JSON.stringify(data, null, 2)
  const isLargeData = jsonString.length > 5000

  return (
    <div className="w-full">
      <div
        data-testid="data"
        className={`bg-surface border border-[#E2E8F0] rounded-md p-4 font-mono text-xs text-text-primary ${
          isLargeData ? 'max-h-96 overflow-auto' : ''
        }`}
      >
        <pre className="whitespace-pre-wrap break-words">{jsonString}</pre>
      </div>
    </div>
  )
}
