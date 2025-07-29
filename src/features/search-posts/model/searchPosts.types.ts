import { Post } from '@/entities/post';

type PostWithinAuthorId = Omit<Post, 'author_id'>;

export interface SearchState {
  query: string;
  results: PostWithinAuthorId[];
  isLoading: boolean;
  hasSearched: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setQuery: (value: string) => void;
  search: (value: string) => Promise<void>;
}
