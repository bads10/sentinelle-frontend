'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  Bell,
  Clock,
  Shield,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { api } from '@/lib/api'
import { SeverityBadge } from '@/components/SeverityBadge'

const SEVERITY_TABS = [
  { value: 'critical', label: 'Critique', color: 'text-cyber-danger border-cyber-danger', bg: 'bg-cyber-danger/10' },
  { value: 'high', label: 'Haut', color: 'text-orange-400 border-orange-400', bg: 'bg-orange-400/10' },
  { value: 'medium', label: 'Moyen', color: 'text-yellow-400 border-yellow-400', bg: 'bg-yellow-400/10' },
] as const

export default function AlertsPage() {
  const [activeSeverity, setActiveSeverity] = useState<'critical' | 'high' | 'medium'>('critical')

  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['alerts', activeSeverity],
    queryFn: () =>
      api.getIncidents({
        severity: activeSeverity,
        limit: 20,
      }),
    refetchInterval: 60000,
  })

  const lastUpdate = dataUpdatedAt
    ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true, locale: fr })
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-danger/10 border border-cyber-danger/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-cyber-danger" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyber-text">Alertes de Sécurité</h1>
            <p className="text-xs text-cyber-muted mt-0.5">Incidents prioritaires en temps réel</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 text-xs text-cyber-muted hover:text-cyber-text border border-cyber-border rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {lastUpdate ? `MAJ ${lastUpdate}` : 'Actualiser'}
        </button>
      </div>

      {/* Severity tabs */}
      <div className="flex gap-2">
        {SEVERITY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveSeverity(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              activeSeverity === tab.value
                ? `${tab.color} ${tab.bg}`
                : 'border-cyber-border text-cyber-muted hover:text-cyber-text'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {tab.label}
            {data && activeSeverity === tab.value && (
              <span className="ml-1 text-xs font-bold opacity-80">{data.total}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-cyber-card border border-cyber-border rounded-xl p-5 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-cyber-border rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cyber-border rounded w-3/4" />
                  <div className="h-3 bg-cyber-border rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items?.map((incident) => {
            const accentColor =
              incident.severity === 'critical'
                ? 'bg-cyber-danger'
                : incident.severity === 'high'
                ? 'bg-orange-400'
                : 'bg-yellow-400'
            const dateStr = incident.published_at || incident.discovered_at
            return (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block bg-cyber-card border border-cyber-border rounded-xl p-5 hover:border-cyber-primary/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Accent bar */}
                  <div className={`w-1 h-full min-h-[48px] rounded-full ${accentColor} opacity-70 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-cyber-text group-hover:text-cyber-primary transition-colors line-clamp-2">
                        {incident.title}
                      </h3>
                      <div className="shrink-0">
                        <SeverityBadge severity={incident.severity} size="sm" />
                      </div>
                    </div>
                    {incident.summary && (
                      <p className="text-xs text-cyber-muted line-clamp-2 mb-3">
                        {incident.summary}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-3 text-xs text-cyber-muted">
                      {incident.incident_type && (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {incident.incident_type}
                        </span>
                      )}
                      {incident.source_name && (
                        <span className="font-mono text-cyber-primary/80">
                          {incident.source_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(dateStr), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyber-border group-hover:text-cyber-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            )
          })}
          {!data?.items?.length && (
            <div className="text-center py-20 text-cyber-muted">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune alerte {activeSeverity} pour le moment</p>
            </div>
          )}
        </div>
      )}

      {/* Footer info */}
      {data && data.total > 20 && (
        <div className="text-center">
          <Link
            href={`/incidents?severity=${activeSeverity}`}
            className="text-sm text-cyber-primary hover:underline"
          >
            Voir les {data.total} alertes {activeSeverity} →
          </Link>
        </div>
      )}
    </div>
  )
}
