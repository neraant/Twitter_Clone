import { Post } from '@/entities/post';

export interface SearchState {
  query: string;
  results: Post[];
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setQuery: (value: string) => void;
  search: (value: string) => Promise<void>;
}
