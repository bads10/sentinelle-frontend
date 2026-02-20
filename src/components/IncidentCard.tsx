import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ExternalLink, Clock, Tag, Shield } from 'lucide-react'
import { IncidentListItem } from '@/lib/api'
import { SeverityBadge } from '@/components/SeverityBadge'

interface IncidentCardProps {
  incident: IncidentListItem
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const dateStr = incident.published_at || incident.discovered_at

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

      {incident.summary && (
        <p className="text-xs text-cyber-muted line-clamp-2 mb-3">
          {incident.summary}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {incident.category && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
            <Shield className="w-3 h-3" />
            {incident.category}
          </span>
        )}
        {incident.cve_id && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
            <Tag className="w-3 h-3" />
            {incident.cve_id}
          </span>
        )}
        {incident.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-cyber-muted">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(dateStr), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
        <span className="flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          {incident.source_name}
        </span>
      </div>
    </Link>
  )
}
