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
        className="p-4 text-gray-500 flex items-center gap-2"
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
        className="p-4 text-red-600 bg-red-50 rounded border border-red-200"
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
        className="p-4 text-gray-500 text-center"
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
          className="p-4 text-red-600 bg-red-50 rounded border border-red-200"
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
        className={`bg-gray-50 border border-gray-200 rounded p-4 font-mono text-xs text-gray-800 ${
          isLargeData ? 'max-h-96 overflow-auto' : ''
        }`}
      >
        <pre className="whitespace-pre-wrap break-words">{jsonString}</pre>
      </div>
    </div>
  )
}
