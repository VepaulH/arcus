export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          university: string | null
          bio: string | null
          position: string | null
          skills: string[] | null
          startup_stage: string | null
          experience: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          university?: string | null
          bio?: string | null
          position?: string | null
          skills?: string[] | null
          startup_stage?: string | null
          experience?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string | null
          email?: string | null
          university?: string | null
          bio?: string | null
          position?: string | null
          skills?: string[] | null
          startup_stage?: string | null
          experience?: string | null
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          content?: string
        }
      }
      roadmap_progress: {
        Row: {
          id: string
          user_id: string
          node_id: string
          status: 'active' | 'available' | 'locked'
          progress: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          node_id: string
          status?: 'active' | 'available' | 'locked'
          progress?: number
          updated_at?: string
        }
        Update: {
          status?: 'active' | 'available' | 'locked'
          progress?: number
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
        Update: {
          status?: 'pending' | 'accepted' | 'declined'
        }
      }
      onboarding_data: {
        Row: {
          id: string
          user_id: string
          revenue_range: string | null
          looking_for: string | null
          referral_source: string | null
          roadmap_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          revenue_range?: string | null
          looking_for?: string | null
          referral_source?: string | null
          roadmap_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          revenue_range?: string | null
          looking_for?: string | null
          referral_source?: string | null
          roadmap_id?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type OnboardingData = {
  id: string
  user_id: string
  revenue_range: string | null
  looking_for: string | null
  referral_source: string | null
  roadmap_id: string
  created_at: string
  updated_at: string
}
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type RoadmapProgress = Database['public']['Tables']['roadmap_progress']['Row']

export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

export interface IncomingRequest extends Connection {
  requester: Profile
}
