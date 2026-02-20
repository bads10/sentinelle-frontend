'use client'

import { useQuery } from '@tanstack/react-query'
import { Shield, AlertTriangle, Activity, TrendingUp, Clock, Database } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { StatsCard } from '@/components/StatsCard'
import { IncidentCard } from '@/components/IncidentCard'
import { ThreatChart } from '@/components/ThreatChart'
import { SeverityBadge } from '@/components/SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    refetchInterval: 60000, // refresh every minute
  })

  const { data: recentIncidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['incidents', 'recent'],
    queryFn: () => api.getIncidents({ limit: 10, sort: 'date_published', order: 'desc' }),
    refetchInterval: 30000,
  })

  const { data: criticalIncidents } = useQuery({
    queryKey: ['incidents', 'critical'],
    queryFn: () => api.getIncidents({ severity: 'critical', limit: 5 }),
    refetchInterval: 30000,
  })

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-primary flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Dashboard Sentinelle
          </h1>
          <p className="text-cyber-muted mt-1">Veille cybersécurité en temps réel</p>
        </div>
        <div className="flex items-center gap-2 text-cyber-accent text-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Live</span>
          <span className="text-cyber-muted">– MAJ toutes les 30s</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Incidents Totaux"
          value={stats?.total_incidents ?? '–'}
          icon={<Database className="w-5 h-5" />}
          color="primary"
          loading={statsLoading}
        />
        <StatsCard
          title="Critiques (24h)"
          value={stats?.critical_24h ?? '–'}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="danger"
          loading={statsLoading}
        />
        <StatsCard
          title="Nouveaux Aujourd'hui"
          value={stats?.new_today ?? '–'}
          icon={<TrendingUp className="w-5 h-5" />}
          color="warning"
          loading={statsLoading}
        />
        <StatsCard
          title="Sources Actives"
          value={stats?.active_sources ?? '–'}
          icon={<Activity className="w-5 h-5" />}
          color="accent"
          loading={statsLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Chart */}
        <div className="lg:col-span-2 bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-primary" />
            Activité des Menaces (7 jours)
          </h2>
          <ThreatChart data={stats?.weekly_activity ?? []} />
        </div>

        {/* Critical Alerts */}
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-cyber-text mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyber-danger" />
            Alertes Critiques
          </h2>
          <div className="space-y-3">
            {criticalIncidents?.items?.slice(0, 5).map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block p-3 bg-cyber-surface rounded-lg border border-cyber-border hover:border-cyber-danger transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-cyber-text font-medium line-clamp-2">{incident.title}</p>
                  <SeverityBadge severity={incident.severity} size="sm" />
                </div>
                <p className="text-xs text-cyber-muted mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(incident.date_published), { addSuffix: true, locale: fr })}
                </p>
              </Link>
            ))}
            {!criticalIncidents?.items?.length && (
              <p className="text-cyber-muted text-sm text-center py-4">Aucune alerte critique</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cyber-text">Incidents Récents</h2>
          <Link
            href="/incidents"
            className="text-cyber-primary hover:text-cyber-primary/80 text-sm font-medium transition-colors"
          >
            Voir tous les incidents →
          </Link>
        </div>
        {incidentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-cyber-card border border-cyber-border rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-cyber-border rounded w-3/4 mb-3" />
                <div className="h-3 bg-cyber-border rounded w-1/2 mb-2" />
                <div className="h-3 bg-cyber-border rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentIncidents?.items?.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
