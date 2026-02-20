'use client'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  Database,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { api } from '@/lib/api'
import React from 'react'

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  info: '#3b82f6',
}

const CAT_COLORS = [
  '#00d4ff', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#6b7280', '#ec4899',
]

function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  loading,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: 'primary' | 'danger' | 'warning' | 'accent'
  loading?: boolean
}) {
  const colorMap = {
    primary: 'text-cyber-primary border-cyber-primary/20 bg-cyber-primary/5',
    danger: 'text-cyber-danger border-cyber-danger/20 bg-cyber-danger/5',
    warning: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    accent: 'text-cyber-accent border-cyber-accent/20 bg-cyber-accent/5',
  }
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-cyber-border rounded w-1/2" />
          <div className="h-8 bg-cyber-border rounded w-1/3" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-cyber-muted font-medium uppercase tracking-wide">{title}</p>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
              {icon}
            </div>
          </div>
          <p className={`text-3xl font-bold ${colorMap[color].split(' ')[0]}`}>{value}</p>
        </>
      )}
    </div>
  )
}

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    refetchInterval: 60000,
  })

  // Severity data from individual count fields
  const severityData = stats
    ? [
        { name: 'Critical', value: stats.critical_count, fill: SEVERITY_COLORS.critical },
        { name: 'High', value: stats.high_count, fill: SEVERITY_COLORS.high },
        { name: 'Medium', value: stats.medium_count, fill: SEVERITY_COLORS.medium },
        { name: 'Low', value: stats.low_count, fill: SEVERITY_COLORS.low },
        { name: 'Info', value: stats.info_count, fill: SEVERITY_COLORS.info },
      ].filter((d) => d.value > 0)
    : []

  // Category data from by_category
  const categoryData = stats?.by_category
    ? Object.entries(stats.by_category)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, value], i) => ({
          name: key,
          value,
          fill: CAT_COLORS[i % CAT_COLORS.length],
        }))
    : []

  // Source data from by_source
  const sourceData = stats?.by_source
    ? Object.entries(stats.by_source)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, value]) => ({ name: key, value }))
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-cyber-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-cyber-text">Statistiques</h1>
          <p className="text-xs text-cyber-muted mt-0.5">Vue agrégée des incidents</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={stats?.total_incidents ?? '–'}
          icon={<Database className="w-4 h-4" />}
          color="primary"
          loading={isLoading}
        />
        <StatCard
          title="Critiques"
          value={stats?.critical_count ?? '–'}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="danger"
          loading={isLoading}
        />
        <StatCard
          title="Dernières 24h"
          value={stats?.last_24h ?? '–'}
          icon={<TrendingUp className="w-4 h-4" />}
          color="warning"
          loading={isLoading}
        />
        <StatCard
          title="Dernière semaine"
          value={stats?.last_7d ?? '–'}
          icon={<Activity className="w-4 h-4" />}
          color="accent"
          loading={isLoading}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity pie */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-primary" />
            Répartition par sévérité
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141c2e', border: '1px solid #1e2d45', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category bar */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyber-warning" />
            Incidents par catégorie
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141c2e', border: '1px solid #1e2d45', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-cyber-text mb-4">Top sources</h2>
        {isLoading ? (
          <div className="h-24 bg-cyber-border/20 rounded animate-pulse" />
        ) : (
          <div className="space-y-2">
            {sourceData.map((item, i) => {
              const max = sourceData[0]?.value ?? 1
              const pct = Math.round((item.value / max) * 100)
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-cyber-muted w-4 text-right">{i + 1}</span>
                  <span className="text-xs text-cyber-text w-32 truncate">{item.name}</span>
                  <div className="flex-1 h-2 bg-cyber-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyber-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-cyber-muted w-8 text-right font-mono">{item.value}</span>
                </div>
              )
            })}
            {sourceData.length === 0 && (
              <p className="text-cyber-muted text-sm text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
