import React from 'react'

export interface StatCard {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  icon?: React.ReactNode
}

export interface DashboardStatsProps {
  stats: StatCard[]
  isLoading?: boolean
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 border border-slate-200 rounded-md p-4 h-24 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-md p-4 hover:shadow-sm transition-shadow duration-200"
          data-testid={`stat-card-${index}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            {stat.icon && (
              <div className="text-blue-700 opacity-80">{stat.icon}</div>
            )}
          </div>

          {stat.trend && (
            <div
              className={`text-xs font-medium ${
                stat.trend.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {stat.trend.direction === 'up' ? '↑' : '↓'} {Math.abs(
                stat.trend.value
              )}%
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
