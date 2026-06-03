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
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type RoadmapProgress = Database['public']['Tables']['roadmap_progress']['Row']
