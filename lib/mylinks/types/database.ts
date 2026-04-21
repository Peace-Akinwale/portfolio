export type PageType =
  | 'homepage'
  | 'blog_post'
  | 'category'
  | 'product'
  | 'service'
  | 'landing'
  | 'about'
  | 'contact'
  | 'other';

export type Confidence = 'low' | 'medium' | 'high';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';
export type CrawlStatus = 'running' | 'completed' | 'failed';
export type ArticleSource = 'paste' | 'google_doc';
export type LinkType = 'internal' | 'external';
export type DestinationSource = 'inventory' | 'client';
export type GoogleAccessStatus = 'pending' | 'approved' | 'rejected';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          email: string | null;
          full_name: string | null;
          found_via: string | null;
          beta_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          full_name?: string | null;
          found_via?: string | null;
          beta_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string | null;
          full_name?: string | null;
          found_via?: string | null;
          beta_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          domain: string;
          sitemap_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          domain: string;
          sitemap_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          domain?: string;
          sitemap_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          title: string | null;
          meta_description: string | null;
          h1: string | null;
          h2s: string[] | null;
          page_type: PageType;
          priority: number;
          word_count: number | null;
          status_code: number | null;
          last_crawled_at: string | null;
          published_at: string | null;
          embedding: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          url: string;
          title?: string | null;
          meta_description?: string | null;
          h1?: string | null;
          h2s?: string[] | null;
          page_type?: PageType;
          priority?: number;
          word_count?: number | null;
          status_code?: number | null;
          last_crawled_at?: string | null;
          published_at?: string | null;
          embedding?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          url?: string;
          title?: string | null;
          meta_description?: string | null;
          h1?: string | null;
          h2s?: string[] | null;
          page_type?: PageType;
          priority?: number;
          word_count?: number | null;
          status_code?: number | null;
          last_crawled_at?: string | null;
          published_at?: string | null;
          embedding?: string | null;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          source: ArticleSource;
          google_doc_id: string | null;
          content_html: string | null;
          content_text: string;
          word_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          source?: ArticleSource;
          google_doc_id?: string | null;
          content_html?: string | null;
          content_text: string;
          word_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          source?: ArticleSource;
          google_doc_id?: string | null;
          content_html?: string | null;
          content_text?: string;
          word_count?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      article_link_targets: {
        Row: {
          id: string;
          article_id: string;
          label: string | null;
          url: string;
          notes: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          label?: string | null;
          url: string;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          label?: string | null;
          url?: string;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      suggestions: {
        Row: {
          id: string;
          article_id: string;
          target_page_id: string | null;
          target_url: string;
          anchor_text: string;
          anchor_refinement: string | null;
          page_type: PageType | null;
          relevance_score: number;
          confidence: Confidence;
          paragraph_index: number | null;
          sentence_index: number | null;
          char_start: number;
          char_end: number;
          justification: string;
          duplicate_flag: boolean;
          over_optimization_flag: boolean;
          status: SuggestionStatus;
          gdoc_start_index: number | null;
          gdoc_end_index: number | null;
          sort_order: number;
          link_type: LinkType;
          destination_source: DestinationSource;
          reviewed_at: string | null;
          applied_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          target_page_id?: string | null;
          target_url: string;
          anchor_text: string;
          anchor_refinement?: string | null;
          page_type?: PageType | null;
          relevance_score: number;
          confidence?: Confidence;
          paragraph_index?: number | null;
          sentence_index?: number | null;
          char_start: number;
          char_end: number;
          justification: string;
          duplicate_flag?: boolean;
          over_optimization_flag?: boolean;
          status?: SuggestionStatus;
          gdoc_start_index?: number | null;
          gdoc_end_index?: number | null;
          sort_order?: number;
          link_type?: LinkType;
          destination_source?: DestinationSource;
          reviewed_at?: string | null;
          applied_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          target_page_id?: string | null;
          target_url?: string;
          anchor_text?: string;
          anchor_refinement?: string | null;
          page_type?: PageType | null;
          relevance_score?: number;
          confidence?: Confidence;
          paragraph_index?: number | null;
          sentence_index?: number | null;
          char_start?: number;
          char_end?: number;
          justification?: string;
          duplicate_flag?: boolean;
          over_optimization_flag?: boolean;
          status?: SuggestionStatus;
          gdoc_start_index?: number | null;
          gdoc_end_index?: number | null;
          sort_order?: number;
          link_type?: LinkType;
          destination_source?: DestinationSource;
          reviewed_at?: string | null;
          applied_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      google_tokens: {
        Row: {
          id: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scope: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scope: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          access_token?: string;
          refresh_token?: string;
          expires_at?: string;
          scope?: string;
        };
        Relationships: [];
      };
      google_access_requests: {
        Row: {
          id: string;
          user_id: string;
          status: GoogleAccessStatus;
          notes: string | null;
          requested_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: GoogleAccessStatus;
          notes?: string | null;
          requested_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: GoogleAccessStatus;
          notes?: string | null;
          requested_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
      crawl_logs: {
        Row: {
          id: string;
          project_id: string;
          status: CrawlStatus;
          total_urls: number | null;
          crawled_urls: number;
          failed_urls: number;
          error_message: string | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          status?: CrawlStatus;
          total_urls?: number | null;
          crawled_urls?: number;
          failed_urls?: number;
          error_message?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          status?: CrawlStatus;
          total_urls?: number | null;
          crawled_urls?: number;
          failed_urls?: number;
          error_message?: string | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      llm_usage_logs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          article_id: string | null;
          operation: string;
          provider: string;
          model: string;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          total_tokens: number | null;
          estimated_cost_usd: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          article_id?: string | null;
          operation: string;
          provider: string;
          model: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          estimated_cost_usd?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          article_id?: string | null;
          operation?: string;
          provider?: string;
          model?: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          total_tokens?: number | null;
          estimated_cost_usd?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: 'google_connected' | 'admin_user_connected_google' | 'suggestions_ready';
          message: string;
          metadata: Record<string, Json> | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: 'google_connected' | 'admin_user_connected_google' | 'suggestions_ready';
          message: string;
          metadata?: Record<string, Json> | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          type?: 'google_connected' | 'admin_user_connected_google' | 'suggestions_ready';
          message?: string;
          metadata?: Record<string, Json> | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      match_pages: {
        Args: {
          p_project_id: string;
          p_query_embedding: string;
          p_match_count?: number;
          p_published_after?: string | null;
        };
        Returns: {
          id: string;
          project_id: string;
          url: string;
          title: string | null;
          meta_description: string | null;
          h1: string | null;
          h2s: string[] | null;
          page_type: PageType;
          priority: number;
          word_count: number | null;
          status_code: number | null;
          last_crawled_at: string | null;
          published_at: string | null;
          similarity: number;
        }[];
      };
    };
    Enums: {
      page_type: PageType;
      confidence_level: Confidence;
      suggestion_status: SuggestionStatus;
      crawl_status: CrawlStatus;
      article_source: ArticleSource;
    };
    CompositeTypes: Record<never, never>;
  };
};
