import { clsx } from 'clsx'

type Severity = 'low' | 'medium' | 'high' | 'critical' | 'info'

interface SeverityBadgeProps {
  severity: string | null | undefined
  size?: 'sm' | 'md' | 'lg'
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  low: {
    label: 'Faible',
    className: 'bg-green-900/30 text-green-400 border-green-800',
  },
  medium: {
    label: 'Moyen',
    className: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  },
  high: {
    label: 'Haut',
    className: 'bg-orange-900/30 text-orange-400 border-orange-800',
  },
  critical: {
    label: 'Critique',
    className: 'bg-red-900/30 text-red-400 border-red-800 severity-critical',
  },
  info: {
    label: 'Info',
    className: 'bg-blue-900/30 text-blue-400 border-blue-800',
  },
}

const VALID_SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical', 'info']

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const key = (severity ?? '') as Severity
  const config = VALID_SEVERITIES.includes(key)
    ? severityConfig[key]
    : severityConfig.medium
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded border font-semibold whitespace-nowrap',
        config.className,
        size === 'sm' && 'text-xs px-1.5 py-0.5',
        size === 'md' && 'text-xs px-2 py-1',
        size === 'lg' && 'text-sm px-3 py-1',
      )}
    >
      {config.label}
    </span>
  )
}
