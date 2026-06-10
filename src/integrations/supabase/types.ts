export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          related_case_study_id: string | null
          related_project_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          related_case_study_id?: string | null
          related_project_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          related_case_study_id?: string | null
          related_project_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_related_case_study_id_fkey"
            columns: ["related_case_study_id"]
            isOneToOne: false
            referencedRelation: "case_studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_related_project_id_fkey"
            columns: ["related_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          category: string | null
          challenge: string | null
          cover_image_url: string | null
          created_at: string
          display_order: number
          execution: string | null
          external_links: Json | null
          id: string
          lessons: string | null
          outcome: string | null
          related_projects: string[] | null
          research: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          strategy: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          challenge?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          execution?: string | null
          external_links?: Json | null
          id?: string
          lessons?: string | null
          outcome?: string | null
          related_projects?: string[] | null
          research?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          strategy?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          challenge?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          execution?: string | null
          external_links?: Json | null
          id?: string
          lessons?: string | null
          outcome?: string | null
          related_projects?: string[] | null
          research?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          strategy?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          issued_on: string | null
          issuer: string
          name: string
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          issued_on?: string | null
          issuer: string
          name: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          issued_on?: string | null
          issuer?: string
          name?: string
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          end_date: string | null
          id: string
          logo_url: string | null
          organization: string
          responsibilities: string[] | null
          role: string
          skills_gained: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          logo_url?: string | null
          organization: string
          responsibilities?: string[] | null
          role: string
          skills_gained?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          logo_url?: string | null
          organization?: string
          responsibilities?: string[] | null
          role?: string
          skills_gained?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: []
      }
      hero: {
        Row: {
          cta_primary_href: string | null
          cta_primary_label: string | null
          cta_secondary_href: string | null
          cta_secondary_label: string | null
          eyebrow: string | null
          heading: string
          id: string
          intro: string | null
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          eyebrow?: string | null
          heading?: string
          id?: string
          intro?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          eyebrow?: string | null
          heading?: string
          id?: string
          intro?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      marketing_work: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          external_link: string | null
          id: string
          image_url: string | null
          metrics: Json | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          external_link?: string | null
          id?: string
          image_url?: string | null
          metrics?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          external_link?: string | null
          id?: string
          image_url?: string | null
          metrics?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      nav_links: {
        Row: {
          created_at: string
          display_order: number
          href: string
          id: string
          label: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          display_order?: number
          href: string
          id?: string
          label: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          display_order?: number
          href?: string
          id?: string
          label?: string
          visible?: boolean
        }
        Relationships: []
      }
      projects: {
        Row: {
          bento_size: string
          case_study_link: string | null
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          featured: boolean
          featured_image_url: string | null
          id: string
          live_link: string | null
          name: string
          problem: string | null
          process: string | null
          related_projects: string[] | null
          results: string | null
          role: string | null
          slug: string
          solution: string | null
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          tools: string[] | null
          updated_at: string
        }
        Insert: {
          bento_size?: string
          case_study_link?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          featured_image_url?: string | null
          id?: string
          live_link?: string | null
          name: string
          problem?: string | null
          process?: string | null
          related_projects?: string[] | null
          results?: string | null
          role?: string | null
          slug: string
          solution?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          tools?: string[] | null
          updated_at?: string
        }
        Update: {
          bento_size?: string
          case_study_link?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          featured?: boolean
          featured_image_url?: string | null
          id?: string
          live_link?: string | null
          name?: string
          problem?: string | null
          process?: string | null
          related_projects?: string[] | null
          results?: string | null
          role?: string | null
          slug?: string
          solution?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          tools?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          default_seo_description: string | null
          default_seo_title: string | null
          email: string | null
          favicon_url: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          logo_url: string | null
          primary_color: string | null
          site_name: string
          twitter_url: string | null
          updated_at: string
          whatsapp_url: string | null
        }
        Insert: {
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string | null
          favicon_url?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string
          twitter_url?: string | null
          updated_at?: string
          whatsapp_url?: string | null
        }
        Update: {
          default_seo_description?: string | null
          default_seo_title?: string | null
          email?: string | null
          favicon_url?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string
          twitter_url?: string | null
          updated_at?: string
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          icon_url: string | null
          id: string
          name: string
          proficiency: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          name: string
          proficiency?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          icon_url?: string | null
          id?: string
          name?: string
          proficiency?: number | null
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          value?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          name: string
          quote: string
          relationship: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name: string
          quote: string
          relationship?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          name?: string
          quote?: string
          relationship?: string | null
          role?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
      content_status: "draft" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      content_status: ["draft", "published"],
    },
  },
} as const
