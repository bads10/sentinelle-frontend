import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// ---------------------------------------------------------------------------
// Types aligned with sentinelle-backend API
// ---------------------------------------------------------------------------

export interface Incident {
  id: string
  title: string
  description: string | null
  summary: string | null
  source_url: string
  source_name: string
  source_category: string | null
  // Classification
  category: string | null      // backfilled from incident_type by backend schema
  incident_type: string | null
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | null
  severity_score: number | null
  tags: string[] | null
  // CVE
  cve_id: string | null
  cvss_score: number | null
  cvss_vector: string | null
  // Geo
  country_origin: string | null
  countries_affected: string[] | null
  // Affected entities
  affected_products: string[] | null
  affected_vendors: string[] | null
  affected_sectors: string[] | null
  // Threat intel
  threat_actors: string[] | null
  malware_families: string[] | null
  ttps: string[] | null
  // Status
  is_active: boolean
  is_verified: boolean
  is_featured: boolean
  view_count: number
  read_time_minutes: number | null
  language: string | null
  // Dates
  published_at: string | null
  discovered_at: string
  updated_at: string
  created_at: string
}

export interface IncidentListItem {
  id: string
  title: string
  summary: string | null
  source_name: string
  source_url: string
  category: string | null
  incident_type: string | null
  severity: string | null
  severity_score: number | null
  cve_id: string | null
  tags: string[] | null
  is_featured: boolean
  is_verified: boolean
  published_at: string | null
  discovered_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface IncidentStats {
  total_incidents: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  info_count: number
  by_category: Record<string, number>
  by_source: Record<string, number>
  last_24h: number
  last_7d: number
  last_30d: number
}

export interface IncidentFilters {
  page?: number
  limit?: number
  type?: string        // maps to incident_type OR category
  severity?: string
  country?: string
  source?: string
  featured?: boolean
  verified?: boolean
  q?: string           // full-text search on title + organisation
  from?: string        // ISO date
  to?: string          // ISO date
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------
export const api = {
  // Incidents
  getIncidents: async (
    filters: IncidentFilters = {}
  ): Promise<PaginatedResponse<IncidentListItem>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    const response = await apiClient.get(
      `/api/v1/incidents?${params.toString()}`
    )
    return response.data
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    const response = await apiClient.get(`/api/v1/incidents/${id}`)
    return response.data
  },

  getStats: async (): Promise<IncidentStats> => {
    const response = await apiClient.get('/api/v1/incidents/stats')
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default api
