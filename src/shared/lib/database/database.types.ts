export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string | null;
          content: string | null;
          created_at: string;
          id: string;
          post_id: string | null;
        };
        Insert: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'post_with_author';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'follows_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'follows_following_id_fkey';
            columns: ['following_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'likes_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'post_with_author';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'likes_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string | null;
          content: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
        };
        Insert: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          followers_count: number;
          following_count: number;
          gender: string | null;
          id: string;
          name: string | null;
          phone_number: string | null;
          updated_at: string | null;
          user_telegram: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          followers_count?: number;
          following_count?: number;
          gender?: string | null;
          id?: string;
          name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_telegram?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          followers_count?: number;
          following_count?: number;
          gender?: string | null;
          id?: string;
          name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
          user_telegram?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      post_with_author: {
        Row: {
          author_avatar: string | null;
          author_id: string | null;
          author_name: string | null;
          content: string | null;
          created_at: string | null;
          id: string | null;
          image_url: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      decrement_followers_count: {
        Args: { target_user_id: string };
        Returns: undefined;
      };
      decrement_following_count: {
        Args: { current_user_id: string };
        Returns: undefined;
      };
      increment_followers_count: {
        Args: { target_user_id: string };
        Returns: undefined;
      };
      increment_following_count: {
        Args: { current_user_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
