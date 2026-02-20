'use client'
import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  TrendingUp,
  Globe,
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
  AreaChart,
  Area,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { api } from '@/lib/api'

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

const TYPE_COLORS = [
  '#000d4ff', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#6b7280',
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

  // Prepare chart data
  const severityData = stats
    ? Object.entries(stats.by_severity).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        fill: SEVERITY_COLORS[key] ?? '#6b7280',
      }))
    : []

  const typeData = stats
    ? Object.entries(stats.by_type)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([key, value], i) => ({
          name: key,
          value,
          fill: TYPE_COLORS[i % TYPE_COLORS.length],
        }))
    : []

  const countryData = stats
    ? Object.entries(stats.by_country)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, value]) => ({ name: key, value }))
    : []

  const weeklyData = stats?.weekly_activity?.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'EEE dd/MM', { locale: fr }),
  })) ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-cyber-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-cyber-text">Statistiques</h1>
          <p className="text-xs text-cyber-muted mt-0.5">Vue agregée des incidents</p>
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
          title="Critiques 24h"
          value={stats?.critical_24h ?? '–'}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="danger"
          loading={isLoading}
        />
        <StatCard
          title="Nouveaux Aujourd’hui"
          value={stats?.new_today ?? '–'}
          icon={<TrendingUp className="w-4 h-4" />}
          color="warning"
          loading={isLoading}
        />
        <StatCard
          title="Sources Actives"
          value={stats?.active_sources ?? '–'}
          icon={<Activity className="w-4 h-4" />}
          color="accent"
          loading={isLoading}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly activity */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyber-primary" />
            Activité sur 7 jours
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#000d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141c2e', border: '1px solid #1e2d45', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#000d4ff' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#000d4ff"
                  strokeWidth={2}
                  fill="url(#gradWeekly)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Severity pie */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber-primary" />
            Répartition par sévérité
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By type */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyber-warning" />
            Incidents par type
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141c2e', border: '1px solid #1e2d45', borderRadius: 8 }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By country */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyber-accent" />
            Top 10 pays ciblés
          </h2>
          {isLoading ? (
            <div className="h-48 bg-cyber-border/20 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              {countryData.map((item, i) => {
                const max = countryData[0]?.value ?? 1
                const pct = Math.round((item.value / max) * 100)
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-xs text-cyber-muted w-4 text-right">{i + 1}</span>
                    <span className="text-xs text-cyber-text w-24 truncate">{item.name}</span>
                    <div className="flex-1 h-2 bg-cyber-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyber-accent rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-cyber-muted w-8 text-right font-mono">{item.value}</span>
                  </div>
                )
              })}
              {countryData.length === 0 && (
                <p className="text-cyber-muted text-sm text-center py-8">Aucune donnée disponible</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
