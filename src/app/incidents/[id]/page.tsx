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
  Users,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { api } from '@/lib/api'
import { SeverityBadge } from '@/components/SeverityBadge'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params.id)

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

  const dateStr = incident.published_at || incident.discovered_at

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
          {incident.category && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <Shield className="w-3 h-3" />
              {incident.category}
            </span>
          )}
          {incident.country_origin && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <MapPin className="w-3 h-3" />
              {incident.country_origin}
            </span>
          )}
          {incident.affected_sectors?.slice(0, 2).map((sector) => (
            <span key={sector} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <Globe className="w-3 h-3" />
              {sector}
            </span>
          ))}
          {incident.threat_actors?.slice(0, 1).map((actor) => (
            <span key={actor} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-cyber-border text-cyber-muted">
              <Users className="w-3 h-3" />
              {actor}
            </span>
          ))}
          {incident.is_verified && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-green-400/30 text-green-400 bg-green-400/10">
              <Activity className="w-3 h-3" />
              Vérifié
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-cyber-muted">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })}
            {incident.published_at && (
              <span className="ml-1">
                &middot; {format(new Date(incident.published_at), 'dd MMM yyyy', { locale: fr })}
              </span>
            )}
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
          {incident.summary && (
            <div className="bg-cyber-card border border-cyber-primary/30 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-primary mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Résumé
              </h2>
              <p className="text-sm text-cyber-text leading-relaxed">{incident.summary}</p>
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
          {/* TTPs */}
          {incident.ttps && incident.ttps.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-text mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyber-danger" />
                TTPs (MITRE ATT&amp;CK)
              </h2>
              <div className="flex flex-wrap gap-2">
                {incident.ttps.map((ttp) => (
                  <span
                    key={ttp}
                    className="text-xs px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-text font-mono"
                  >
                    {ttp}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Malware */}
          {incident.malware_families && incident.malware_families.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-cyber-text mb-4">
                Familles de malware
              </h2>
              <div className="flex flex-wrap gap-2">
                {incident.malware_families.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-2 py-1 rounded bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* CVE */}
          {incident.cve_id && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">CVE associé</h3>
              <a
                href={`https://nvd.nist.gov/vuln/detail/${incident.cve_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 rounded bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger font-mono hover:bg-cyber-danger/20 transition-colors"
              >
                {incident.cve_id}
              </a>
              {incident.cvss_score !== null && (
                <p className="text-xs text-cyber-muted mt-2">CVSS: {incident.cvss_score}</p>
              )}
            </div>
          )}
          {/* Tags */}
          {incident.tags && incident.tags.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {incident.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-muted"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Affected Products */}
          {incident.affected_products && incident.affected_products.length > 0 && (
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-cyber-text mb-3">Produits affectés</h3>
              <div className="flex flex-wrap gap-2">
                {incident.affected_products.map((p) => (
                  <span key={p} className="text-xs px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">{p}</span>
                ))}
              </div>
            </div>
          )}
          {/* Metadata */}
          <div className="bg-cyber-card border border-cyber-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-cyber-text mb-3">Métadonnées</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-cyber-muted">Découvert le</dt>
                <dd className="text-cyber-text">
                  {format(new Date(incident.discovered_at), 'dd/MM/yyyy', { locale: fr })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cyber-muted">Source</dt>
                <dd className="text-cyber-text">{incident.source_name}</dd>
              </div>
              {incident.source_category && (
                <div className="flex justify-between">
                  <dt className="text-cyber-muted">Catégorie source</dt>
                  <dd className="text-cyber-text">{incident.source_category}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-cyber-muted">ID</dt>
                <dd className="text-cyber-text font-mono text-[10px] break-all">{incident.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
