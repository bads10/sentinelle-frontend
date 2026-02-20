import { ReactNode } from 'react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: 'primary' | 'danger' | 'warning' | 'accent'
  loading?: boolean
  trend?: {
    value: number
    label: string
  }
}

const colorMap = {
  primary: 'text-cyber-primary border-cyber-primary/30 bg-cyber-primary/10',
  danger: 'text-cyber-danger border-cyber-danger/30 bg-cyber-danger/10',
  warning: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  accent: 'text-cyber-accent border-cyber-accent/30 bg-cyber-accent/10',
}

export function StatsCard({
  title,
  value,
  icon,
  color = 'primary',
  loading = false,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 flex flex-col gap-3 hover:border-cyber-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-sm text-cyber-muted font-medium">{title}</p>
        <div className={clsx('p-2 rounded-lg border', colorMap[color])}>
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-8 bg-cyber-border rounded animate-pulse w-1/2" />
      ) : (
        <p className="text-3xl font-bold text-cyber-text">{value}</p>
      )}
      {trend && (
        <p
          className={clsx(
            'text-xs font-medium',
            trend.value >= 0 ? 'text-cyber-danger' : 'text-green-400'
          )}
        >
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </div>
  )
}
