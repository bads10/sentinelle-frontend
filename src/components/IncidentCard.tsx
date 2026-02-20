import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ExternalLink, Clock, MapPin, Tag, Shield } from 'lucide-react'
import { Incident } from '@/lib/api'
import { SeverityBadge } from '@/components/SeverityBadge'

interface IncidentCardProps {
  incident: Incident
}

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="block bg-cyber-card border border-cyber-border rounded-xl p-5 hover:border-cyber-primary/50 transition-all hover:shadow-lg hover:shadow-cyber-primary/5 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-cyber-text line-clamp-2 group-hover:text-cyber-primary transition-colors">
          {incident.title}
        </h3>
        <SeverityBadge severity={incident.severity} size="sm" />
      </div>

      {incident.ai_summary && (
        <p className="text-xs text-cyber-muted line-clamp-2 mb-3">
          {incident.ai_summary}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
          <Shield className="w-3 h-3" />
          {incident.incident_type}
        </span>
        {incident.country && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
            <MapPin className="w-3 h-3" />
            {incident.country}
          </span>
        )}
        {incident.threat_actor && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
            <Tag className="w-3 h-3" />
            {incident.threat_actor}
          </span>
        )}
      </div>

      {incident.cve_ids?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {incident.cve_ids.slice(0, 3).map((cve) => (
            <span
              key={cve}
              className="text-xs px-1.5 py-0.5 rounded bg-cyber-danger/10 border border-cyber-danger/30 text-cyber-danger font-mono"
            >
              {cve}
            </span>
          ))}
          {incident.cve_ids.length > 3 && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
              +{incident.cve_ids.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-cyber-muted">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(incident.date_published), {
            addSuffix: true,
            locale: fr,
          })}
        </div>
        <div className="flex items-center gap-1 hover:text-cyber-primary transition-colors">
          <span>{incident.source_name}</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </Link>
  )
}
