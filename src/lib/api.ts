import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Types
export interface Incident {
  id: number
  title: string
  description: string | null
  incident_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'new' | 'in_progress' | 'resolved'
  source_url: string
  source_name: string
  date_published: string
  date_ingested: string
  country: string | null
  sector: string | null
  threat_actor: string | null
  cve_ids: string[]
  iocs: Record<string, string[]>
  tags: string[]
  ai_summary: string | null
  confidence_score: number | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface Stats {
  total_incidents: number
  critical_24h: number
  new_today: number
  active_sources: number
  by_severity: Record<string, number>
  by_type: Record<string, number>
  by_country: Record<string, number>
  weekly_activity: Array<{ date: string; count: number }>
}

export interface IncidentFilters {
  page?: number
  limit?: number
  severity?: string
  incident_type?: string
  country?: string
  sector?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  date_from?: string
  date_to?: string
}

// API functions
export const api = {
  // Incidents
  getIncidents: async (filters: IncidentFilters = {}): Promise<PaginatedResponse<Incident>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    const response = await apiClient.get(`/api/v1/incidents?${params.toString()}`)
    return response.data
  },

  getIncidentById: async (id: number): Promise<Incident> => {
    const response = await apiClient.get(`/api/v1/incidents/${id}`)
    return response.data
  },

  getStats: async (): Promise<Stats> => {
    const response = await apiClient.get('/api/v1/stats')
    return response.data
  },

  // Sources
  getSources: async () => {
    const response = await apiClient.get('/api/v1/sources')
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default api
