'use client'
import { useState, useCallback } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Shield, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { api, IncidentFilters } from '@/lib/api'
import { IncidentCard } from '@/components/IncidentCard'

const SEVERITY_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'critical', label: 'Critique' },
  { value: 'high', label: 'Haut' },
  { value: 'medium', label: 'Moyen' },
  { value: 'low', label: 'Faible' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'Tous types' },
  { value: 'ransomware', label: 'Ransomware' },
  { value: 'phishing', label: 'Phishing' },
  { value: 'data_breach', label: 'Fuite de données' },
  { value: 'ddos', label: 'DDoS' },
  { value: 'apt', label: 'APT' },
  { value: 'vulnerability', label: 'Vulnérabilité' },
]

export default function IncidentsPage() {
  const [filters, setFilters] = useState<IncidentFilters>({
    page: 1,
    limit: 12,
  })
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => api.getIncidents(filters),
    placeholderData: keepPreviousData,
  })

  const handleSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, q: search || undefined, page: 1 }))
  }, [search])

  const handleFilter = (key: keyof IncidentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const handlePage = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-cyber-primary" />
        <h1 className="text-2xl font-bold text-cyber-primary">Incidents de Sécurité</h1>
      </div>

      {/* Filters */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-4 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-muted" />
            <input
              type="text"
              placeholder="Rechercher un incident..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-cyber-surface border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-sm text-cyber-text placeholder:text-cyber-muted focus:outline-none focus:border-cyber-primary transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-cyber-primary text-cyber-bg rounded-lg text-sm font-semibold hover:bg-cyber-primary/80 transition-colors"
          >
            Rechercher
          </button>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-cyber-muted" />
          <select
            onChange={(e) => handleFilter('severity', e.target.value)}
            className="bg-cyber-surface border border-cyber-border rounded-lg px-3 py-1.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-primary"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => handleFilter('type', e.target.value)}
            className="bg-cyber-surface border border-cyber-border rounded-lg px-3 py-1.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-primary"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {data && (
            <span className="ml-auto text-xs text-cyber-muted">
              {data.total} résultat{data.total > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-cyber-card border border-cyber-border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-cyber-border rounded w-3/4 mb-3" />
              <div className="h-3 bg-cyber-border rounded w-full mb-2" />
              <div className="h-3 bg-cyber-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items?.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
          {!data?.items?.length && (
            <div className="col-span-full text-center py-16 text-cyber-muted">
              Aucun incident trouvé
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePage((filters.page ?? 1) - 1)}
            disabled={(filters.page ?? 1) <= 1}
            className="p-2 rounded-lg border border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-cyber-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-cyber-muted">
            Page {filters.page} / {data.pages}
          </span>
          <button
            onClick={() => handlePage((filters.page ?? 1) + 1)}
            disabled={(filters.page ?? 1) >= data.pages}
            className="p-2 rounded-lg border border-cyber-border text-cyber-muted hover:text-cyber-text hover:border-cyber-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
