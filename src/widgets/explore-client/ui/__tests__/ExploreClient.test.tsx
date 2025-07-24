import { fireEvent, render, screen } from '@testing-library/react';

import { Post } from '@/entities/post';
import { User } from '@/entities/user';

import { useExploreSearch } from '../../lib';
import { ExploreClient } from '../ExploreClient';

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('next/server', () => ({
  headers: jest.fn(),
  cookies: jest.fn(),
}));

jest.mock('../../lib', () => ({
  useExploreSearch: jest.fn(),
  searchType: { posts: 'posts', users: 'users' },
  EXPLORE_TITLE: 'Search content',
  NO_RESULTS_TITLE: 'No results found',
  SKELETON_COUNT: 3,
}));

jest.mock('../ExploreInput', () => ({
  ExploreInput: ({
    onQueryChange,
    onSearch,
  }: {
    onQueryChange: (newVal: string) => void;
    onSearch: (newVal: string) => void;
  }) => (
    <input
      data-testid='explore-input'
      onChange={(e) => {
        onQueryChange(e.target.value);
        onSearch(e.target.value);
      }}
    />
  ),
}));

jest.mock('../ExploreTabs', () => ({
  ExploreTabs: ({ onTabSelect }: { onTabSelect: (index: number) => void }) => (
    <div>
      <button data-testid='posts-tab' onClick={() => onTabSelect(0)}>
        Posts
      </button>
      <button data-testid='users-tab' onClick={() => onTabSelect(1)}>
        Users
      </button>
    </div>
  ),
}));

jest.mock('../ExplorePosts', () => ({
  ExplorePosts: () => <div data-testid='explore-posts'>Posts content</div>,
}));

jest.mock('../ExploreUsers', () => ({
  ExploreUsers: () => <div data-testid='explore-users'>Users content</div>,
}));

const mockUseExploreSearch = useExploreSearch as jest.MockedFunction<
  typeof useExploreSearch
>;

describe('ExploreClient', () => {
  const defaultSearchHook = {
    posts: [],
    users: [],
    isLoading: false,
    hasSearched: false,
    setIsLoading: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExploreSearch.mockReturnValue(defaultSearchHook);
  });

  it('shows explore state when query is empty', () => {
    render(<ExploreClient />);
    expect(screen.getByText('Search content')).toBeInTheDocument();
  });

  it('shows no results when search has no results', () => {
    mockUseExploreSearch.mockReturnValue({
      ...defaultSearchHook,
      hasSearched: true,
    });

    render(<ExploreClient />);

    const input = screen.getByTestId('explore-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows posts when posts tab is active and has results', () => {
    mockUseExploreSearch.mockReturnValue({
      ...defaultSearchHook,
      posts: [{ id: '1', content: 'Test post' }] as Post[],
    });

    render(<ExploreClient />);

    const input = screen.getByTestId('explore-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTestId('explore-posts')).toBeInTheDocument();
  });

  it('shows users when users tab is active and has results', () => {
    mockUseExploreSearch.mockReturnValue({
      ...defaultSearchHook,
      users: [{ id: '1', name: 'Test user' }] as User[],
    });

    render(<ExploreClient />);

    const usersTab = screen.getByTestId('users-tab');
    fireEvent.click(usersTab);

    const input = screen.getByTestId('explore-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTestId('explore-users')).toBeInTheDocument();
  });

  it('calls search when tab changes with existing query', () => {
    const mockSearch = jest.fn();
    mockUseExploreSearch.mockReturnValue({
      ...defaultSearchHook,
      search: mockSearch,
    });

    render(<ExploreClient />);

    const input = screen.getByTestId('explore-input');
    fireEvent.change(input, { target: { value: 'test' } });

    const usersTab = screen.getByTestId('users-tab');
    fireEvent.click(usersTab);

    expect(mockSearch).toHaveBeenCalledWith('users', 'test');
  });
});
