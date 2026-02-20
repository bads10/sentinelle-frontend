'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ThreatChartProps {
  data: Array<{ date: string; count: number }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-cyber-muted mb-1">
          {label
            ? format(parseISO(label), 'dd MMM yyyy', { locale: fr })
            : ''}
        </p>
        <p className="text-sm font-semibold text-cyber-primary">
          {payload[0].value} incidents
        </p>
      </div>
    )
  }
  return null
}

export function ThreatChart({ data }: ThreatChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-cyber-muted text-sm">
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(val) =>
            format(parseISO(val), 'dd/MM', { locale: fr })
          }
          tick={{ fill: '#4a6fa5', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#4a6fa5', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#00d4ff"
          strokeWidth={2}
          fill="url(#threatGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#00d4ff', stroke: '#0a0f1e', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
