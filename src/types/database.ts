export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      check_ins: {
        Row: {
          acted_on_urges: boolean | null
          anything_hiding: string | null
          check_in_date: string
          close_calls: string | null
          coping_strategies: string[] | null
          created_at: string | null
          created_by: string
          god_connection: string | null
          god_showed_up: string | null
          halt_angry: boolean | null
          halt_hungry: boolean | null
          halt_lonely: boolean | null
          halt_tired: boolean | null
          id: string
          partnership_id: string
          planned_boundaries: string | null
          proud_of: string | null
          rating_emotional: number | null
          rating_spiritual: number | null
          rating_stress: number | null
          scripture_notes: string | null
          scripture_reading: boolean | null
          stress_points: string | null
          support_needed: string | null
          trigger_days: string[] | null
          trigger_locations: string[] | null
          trigger_preceding_events: string | null
          trigger_times: string[] | null
          upcoming_challenges: string | null
          updated_at: string | null
          urge_details: string | null
          urge_level: string | null
          weekly_goal: string | null
          weighing_on_mind: string | null
          what_helped: string | null
          what_went_well: string | null
        }
        Insert: {
          acted_on_urges?: boolean | null
          anything_hiding?: string | null
          check_in_date?: string
          close_calls?: string | null
          coping_strategies?: string[] | null
          created_at?: string | null
          created_by: string
          god_connection?: string | null
          god_showed_up?: string | null
          halt_angry?: boolean | null
          halt_hungry?: boolean | null
          halt_lonely?: boolean | null
          halt_tired?: boolean | null
          id?: string
          partnership_id: string
          planned_boundaries?: string | null
          proud_of?: string | null
          rating_emotional?: number | null
          rating_spiritual?: number | null
          rating_stress?: number | null
          scripture_notes?: string | null
          scripture_reading?: boolean | null
          stress_points?: string | null
          support_needed?: string | null
          trigger_days?: string[] | null
          trigger_locations?: string[] | null
          trigger_preceding_events?: string | null
          trigger_times?: string[] | null
          upcoming_challenges?: string | null
          updated_at?: string | null
          urge_details?: string | null
          urge_level?: string | null
          weekly_goal?: string | null
          weighing_on_mind?: string | null
          what_helped?: string | null
          what_went_well?: string | null
        }
        Update: {
          acted_on_urges?: boolean | null
          anything_hiding?: string | null
          check_in_date?: string
          close_calls?: string | null
          coping_strategies?: string[] | null
          created_at?: string | null
          created_by?: string
          god_connection?: string | null
          god_showed_up?: string | null
          halt_angry?: boolean | null
          halt_hungry?: boolean | null
          halt_lonely?: boolean | null
          halt_tired?: boolean | null
          id?: string
          partnership_id?: string
          planned_boundaries?: string | null
          proud_of?: string | null
          rating_emotional?: number | null
          rating_spiritual?: number | null
          rating_stress?: number | null
          scripture_notes?: string | null
          scripture_reading?: boolean | null
          stress_points?: string | null
          support_needed?: string | null
          trigger_days?: string[] | null
          trigger_locations?: string[] | null
          trigger_preceding_events?: string | null
          trigger_times?: string[] | null
          upcoming_challenges?: string | null
          updated_at?: string | null
          urge_details?: string | null
          urge_level?: string | null
          weekly_goal?: string | null
          weighing_on_mind?: string | null
          what_helped?: string | null
          what_went_well?: string | null
        }
      }
      partnerships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          partner_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          partner_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          partner_id?: string
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
      }
      reminder_settings: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          last_reminder_sent: string | null
          reminder_hour: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_reminder_sent?: string | null
          reminder_hour?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_reminder_sent?: string | null
          reminder_hour?: number | null
          updated_at?: string | null
          user_id?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      is_partnership_member: {
        Args: { p_partnership_id: string }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Partnership = Database['public']['Tables']['partnerships']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']
export type CheckInInsert = Database['public']['Tables']['check_ins']['Insert']
export type ReminderSettings = Database['public']['Tables']['reminder_settings']['Row']
