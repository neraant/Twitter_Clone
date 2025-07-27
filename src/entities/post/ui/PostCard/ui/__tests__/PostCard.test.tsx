import { render, screen } from '@testing-library/react';

import { Post } from '@/entities/post/model';

import { PostCard } from '../PostCard';

jest.mock('@/features/like-buton', () => ({
  LikeButton: ({ isActive, likeQuantity }: never) => (
    <button data-testid='like-button'>
      {isActive ? 'Liked' : 'Like'} ({likeQuantity})
    </button>
  ),
}));

jest.mock('@/features/manage-post', () => ({
  ManagePost: () => <div data-testid='manage-post'>Manage Post</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: never) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: never) => <a href={href}>{children}</a>,
}));

const mockPost: Post = {
  id: '1',
  author_id: 'author-1',
  author_avatar: '/avatar.jpg',
  author_name: 'John Doe',
  content: 'Test post content',
  image_urls: ['image1.jpg', 'image2.jpg'],
  created_at: '2024-01-01T12:00:00Z',
  likes_count: 5,
  is_liked: false,
  is_deleted: null,
};

describe('PostCard', () => {
  const defaultProps = {
    post: mockPost,
    currentUserId: 'user-1',
  };

  it('renders post content correctly', () => {
    render(<PostCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
  });

  it('shows manage post for owner', () => {
    render(<PostCard {...defaultProps} currentUserId='author-1' />);

    expect(screen.getByTestId('manage-post')).toBeInTheDocument();
  });

  it('does not show manage post for non-owner', () => {
    render(<PostCard {...defaultProps} />);

    expect(screen.queryByTestId('manage-post')).not.toBeInTheDocument();
  });

  it('renders in preview mode correctly', () => {
    render(<PostCard {...defaultProps} isPreview />);

    expect(screen.queryByTestId('manage-post')).not.toBeInTheDocument();
    expect(screen.getByText('Test post content')).toBeInTheDocument();
  });

  it('renders images when provided', () => {
    render(<PostCard {...defaultProps} />);

    expect(screen.getByAltText('post image 1')).toBeInTheDocument();
    expect(screen.getByAltText('post image 2')).toBeInTheDocument();
  });
});
