'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ThreatChartProps {
  data: Array<{ date: string; count: number }>
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

const COLORS = [
  '#00d4ff', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#6b7280',
]

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-cyber-muted mb-1">{label}</p>
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
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
        <XAxis
          dataKey="date"
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
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
