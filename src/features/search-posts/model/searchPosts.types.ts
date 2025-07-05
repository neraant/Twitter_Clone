import { Post } from '@/entities/post';

export interface SearchState {
  query: string;
  results: Post[];
  isLoading: boolean;
  error: string | null;

  setQuery: (value: string) => void;
  search: (value: string) => Promise<void>;
}
