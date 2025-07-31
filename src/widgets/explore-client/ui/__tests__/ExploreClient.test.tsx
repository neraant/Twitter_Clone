import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';

import { Post } from '@/entities/post';
import { User } from '@/entities/user';

import { ExploreClientProvider } from '../ExploreClientProvider';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('../ExploreInput', () => ({
  ExploreInput: ({
    onQueryChange,
  }: {
    onQueryChange: (newVal: string) => void;
  }) => (
    <input
      data-testid='explore-input'
      onChange={(e) => onQueryChange(e.target.value)}
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

describe('ExploreClientProvider', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;

  beforeEach(() => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'query') return '';
        if (key === 'tab') return undefined;
        return null;
      }),
      toString: () => '',
    });
  });

  it('shows explore state when query is empty', () => {
    render(<ExploreClientProvider initialPosts={[]} initialUsers={[]} />);
    expect(
      screen.getByText('Search here anything you want 😃'),
    ).toBeInTheDocument();
  });

  it('shows posts when posts are available', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'query') return 'test';
        if (key === 'tab') return 'posts';
        return null;
      }),
      toString: () => 'query=test&tab=posts',
    });

    render(
      <ExploreClientProvider
        initialPosts={[{ id: '1', content: 'Test post' }] as Post[]}
        initialUsers={[]}
      />,
    );

    expect(screen.getByTestId('explore-posts')).toBeInTheDocument();
  });

  it('shows users when users are available and the users tab is active', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'query') return 'test';
        if (key === 'tab') return 'users';
        return null;
      }),
      toString: () => 'query=test&tab=users',
    });

    render(
      <ExploreClientProvider
        initialPosts={[]}
        initialUsers={[{ id: '1', name: 'Test user' }] as User[]}
      />,
    );

    expect(screen.getByTestId('explore-users')).toBeInTheDocument();
  });
});
