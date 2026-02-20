'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  MapPin,
  Tag,
  Shield,
  AlertTriangle,
  Activity,
  FileText,
  Globe,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { api } from '@/lib/api'
import { SeverityBadge } from '@/components/SeverityBadge'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const { data: incident, isLoading, isError } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => api.getIncidentById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-cyber-border rounded w-1/3" />
        <div className="h-4 bg-cyber-border rounded w-1/2" />
        <div className="h-48 bg-cyber-card border border-cyber-border rounded-xl" />
      </div>
    )
  }

  if (isError || !incident) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-cyber-danger mx-auto mb-4" />
        <p className="text-cyber-muted">Incident introuvable</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-cyber-primary hover:underline text-sm"
        >
          Retour
        </button>
      </div>
    )
  }

  const statusColors = {
    new: 'text-cyber-primary border-cyber-primary/30 bg-cyber-primary/10',
    in_progress: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    resolved: 'text-green-400 border-green-400/30 bg-green-400/10',
  }

  const statusLabels = {
    new: 'Nouveau',
    in_progress: 'En cours',
    resolved: 'Résolu',
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-cyber-muted hover:text-cyber-text transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux incidents
      </button>

      {/* Header */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-cyber-text flex-1">{incident.title}</h1>
          <SeverityBadge severity={incident.severity} size="lg" />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[incident.status]}`}>
            <Activity className="w-3 h-3" />
            {statusLabels[incident.status]}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
            <Shield className="w-3 h-3" />
            {incident.incident_type}
          </span>
          {incident.country && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <MapPin className="w-3 h-3" />
              {incident.country}
            </span>
          )}
          {incident.sector && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <Globe className="w-3 h-3" />
              {incident.sector}
            </span>
          )}
          {incident.threat_actor && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <Tag className="w-3 h-3" />
              {incident.threat_actor}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-cyber-muted">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Publié le{' '}
            {format(new Date(incident.date_published), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </div>
          <a
            href={incident.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-cyber-primary transition-colors"
          >
            {incident.source_name}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          {incident.ai_summary && (
            <div className="bg-cyber-card border border-cyber-primary/30 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-primary mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Résumé IA
              </h2>
              <p className="text-sm text-cyber-text leading-relaxed">{incident.ai_summary}</p>
            </div>
          )}

          {/* Description */}
          {incident.description && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-text mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h2>
              <p className="text-sm text-cyber-muted leading-relaxed whitespace-pre-wrap">
                {incident.description}
              </p>
            </div>
          )}

          {/* IOCs */}
          {Object.keys(incident.iocs || {}).length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyber-danger" />
                Indicateurs de Compromission (IOCs)
              </h2>
              <div className="space-y-3">
                {Object.entries(incident.iocs).map(([type, values]) => (
                  <div key={type}>
                    <p className="text-xs font-semibold text-cyber-muted uppercase tracking-wide mb-2">{type}</p>
                    <div className="flex flex-wrap gap-1">
                      {values.map((val, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-text font-mono break-all"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CVEs */}
          {incident.cve_ids?.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">CVEs associés</h3>
              <div className="flex flex-wrap gap-2">
                {incident.cve_ids.map((cve) => (
                  <a
                    key={cve}
                    href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 rounded bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger font-mono hover:bg-cyber-danger/20 transition-colors"
                  >
                    {cve}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {incident.tags?.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {incident.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Confidence */}
          {incident.confidence_score !== null && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">Score de confiance</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-cyber-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-primary rounded-full"
                    style={{ width: `${(incident.confidence_score ?? 0) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-cyber-primary">
                  {Math.round((incident.confidence_score ?? 0) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-cyber-text mb-3">Métadonnées</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-cyber-muted">Ingéré le</dt>
                <dd className="text-cyber-text">
                  {format(new Date(incident.date_ingested), 'dd/MM/yyyy', { locale: fr })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cyber-muted">Source</dt>
                <dd className="text-cyber-text">{incident.source_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cyber-muted">ID</dt>
                <dd className="text-cyber-text font-mono">#{incident.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
