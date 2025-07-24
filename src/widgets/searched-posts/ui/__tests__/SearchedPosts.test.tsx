import { render, screen } from '@testing-library/react';

import { useSearchPostsStore } from '@/features/search-posts/model';

import { SearchedPosts } from '../SearchedPosts';

jest.mock('@/features/search-posts/model');
jest.mock('@/features/search-posts', () => ({
  PostSearchInput: () => (
    <div data-testid='post-search-input'>Search Input</div>
  ),
}));

jest.mock('../Gallery', () => ({
  Gallery: () => <div data-testid='gallery'>Gallery</div>,
}));

jest.mock('@/entities/post/ui/PostSearchCard', () => ({
  PostSearchCard: ({ content, name }: Record<string, string>) => (
    <div data-testid='post-card'>
      {content} by {name}
    </div>
  ),
}));

jest.mock('@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton', () => ({
  UserSmallCardSkeleton: () => <div data-testid='skeleton'>Loading...</div>,
}));

const mockUseSearchPostsStore = useSearchPostsStore as jest.MockedFunction<
  typeof useSearchPostsStore
>;

describe('SearchedPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows gallery when query is empty', () => {
    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        isLoading: false,
        results: [],
        query: '',
        hasSearched: false,
      };

      return selector(state as never);
    });

    render(<SearchedPosts />);
    expect(screen.getByTestId('gallery')).toBeInTheDocument();
  });

  it('shows skeletons when loading', () => {
    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        isLoading: true,
        results: [],
        query: 'test',
        hasSearched: false,
      };
      return selector(state as never);
    });

    render(<SearchedPosts />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('shows no results message', () => {
    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        isLoading: false,
        results: [],
        query: 'test',
        hasSearched: true,
      };
      return selector(state as never);
    });

    render(<SearchedPosts />);
    expect(screen.getByText('No results were found 😕')).toBeInTheDocument();
  });

  it('shows search results', () => {
    const posts = [
      {
        id: '1',
        content: 'Test post',
        author_name: 'John',
        author_avatar: null,
      },
    ];

    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        isLoading: false,
        results: posts,
        query: 'test',
        hasSearched: true,
      };
      return selector(state as never);
    });

    render(<SearchedPosts />);
    expect(screen.getByTestId('post-card')).toBeInTheDocument();
    expect(screen.getByText('Test post by John')).toBeInTheDocument();
  });
});
