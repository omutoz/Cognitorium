export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: number
          name: string
          url: string
          feed_url: string | null
          method: 'rss' | 'html'
          is_active: boolean
          is_top_lab: boolean
          color: string | null
        }
        Insert: {
          id?: number
          name: string
          url: string
          feed_url?: string | null
          method: 'rss' | 'html'
          is_active?: boolean
          is_top_lab?: boolean
          color?: string | null
        }
        Update: {
          id?: number
          name?: string
          url?: string
          feed_url?: string | null
          method?: 'rss' | 'html'
          is_active?: boolean
          is_top_lab?: boolean
          color?: string | null
        }
      }
      articles: {
        Row: {
          id: string
          source_id: number
          url: string
          title_ua: string | null
          title_en: string | null
          description_ua: string | null
          description_en: string | null
          tag: string | null
          published_at: string | null
          fetched_at: string
          lang_original: string
        }
        Insert: {
          id?: string
          source_id: number
          url: string
          title_ua?: string | null
          title_en?: string | null
          description_ua?: string | null
          description_en?: string | null
          tag?: string | null
          published_at?: string | null
          fetched_at?: string
          lang_original?: string
        }
        Update: {
          id?: string
          source_id?: number
          url?: string
          title_ua?: string | null
          title_en?: string | null
          description_ua?: string | null
          description_en?: string | null
          tag?: string | null
          published_at?: string | null
          fetched_at?: string
          lang_original?: string
        }
      }
    }
  }
}
