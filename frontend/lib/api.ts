import type { Profile } from '../../backend/types/database.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('arcus_token')
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  const token = getToken()
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string }
      return { data: null, error: body.error ?? `Request failed (${res.status})` }
    }

    const data = await res.json() as T
    return { data, error: null }
  } catch {
    return { data: null, error: 'Could not reach the server. Is the backend running?' }
  }
}

// ── Auth ─────────────────────────────────────────────────────

interface LoginResponse {
  session: { access_token: string }
  user: { id: string }
  username: string
}

interface SignupResponse {
  session: { access_token: string } | null
  user: { id: string }
  requiresConfirmation: boolean
}

export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

export interface IncomingRequest extends Connection {
  requester: import('../../backend/types/database.types').Profile
}

export interface AcceptedOutgoing extends Connection {
  acceptee: import('../../backend/types/database.types').Profile
}

export interface ConnectedUser {
  connection_id: string
  connected_at: string
  profile: import('../../backend/types/database.types').Profile
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, name: string) =>
    apiFetch<SignupResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () =>
    apiFetch<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
}

// ── Profile ──────────────────────────────────────────────────

export const profileApi = {
  get: () =>
    apiFetch<Profile>('/api/profile'),

  update: (data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) =>
    apiFetch<Profile>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// ── Connect ──────────────────────────────────────────────────

export const connectApi = {
  getUsers: (params?: { position?: string; skills?: string[] }) => {
    const qs = new URLSearchParams()
    if (params?.position) qs.set('position', params.position)
    if (params?.skills?.length) qs.set('skills', params.skills.join(','))
    const query = qs.toString()
    return apiFetch<Profile[]>(`/api/connect${query ? `?${query}` : ''}`)
  },
}

// ── Connections ───────────────────────────────────────────────

export const connectionsApi = {
  getAll: () =>
    apiFetch<Connection[]>('/api/connections'),

  getIncoming: () =>
    apiFetch<IncomingRequest[]>('/api/connections/requests'),

  getCount: () =>
    apiFetch<{ count: number }>('/api/connections/count'),

  sendRequest: (addresseeId: string) =>
    apiFetch<Connection>('/api/connections/request', {
      method: 'POST',
      body: JSON.stringify({ addresseeId }),
    }),

  accept: (id: string) =>
    apiFetch<Connection>(`/api/connections/${id}/accept`, { method: 'POST' }),

  decline: (id: string) =>
    apiFetch<Connection>(`/api/connections/${id}/decline`, { method: 'POST' }),

  getAcceptedOutgoing: () =>
    apiFetch<AcceptedOutgoing[]>('/api/connections/accepted-outgoing'),

  disconnect: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/connections/${id}`, { method: 'DELETE' }),

  getList: () =>
    apiFetch<ConnectedUser[]>('/api/connections/list'),
}

// ── Onboarding / Roadmap ──────────────────────────────────────

export interface OnboardingPayload {
  startup_stage: string
  position: string
  revenue_range: string
  looking_for: string
  skills: string[]
  experience: string
  university?: string
  bio?: string
  referral_source?: string
}

export interface RoadmapProgress {
  roadmap_id: string | null
  progress: { node_id: string; status: string; progress: number }[]
}

export const onboardingApi = {
  get: () =>
    apiFetch<{ roadmap_id: string; revenue_range: string; looking_for: string } | null>('/api/onboarding'),

  submit: (payload: OnboardingPayload) =>
    apiFetch<{ roadmap_id: string }>('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProgress: () =>
    apiFetch<RoadmapProgress>('/api/onboarding/progress'),

  updateNode: (nodeId: string, data: { status?: string; progress?: number }) =>
    apiFetch(`/api/onboarding/progress/${nodeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
