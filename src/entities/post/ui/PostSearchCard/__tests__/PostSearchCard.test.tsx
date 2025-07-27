import { render, screen } from '@testing-library/react';

import { PostSearchCard } from '../PostSearchCard';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: never) => <img src={src} alt={alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: never) => <a href={href}>{children}</a>,
}));

describe('PostSearchCard', () => {
  const defaultProps = {
    avatar: '/avatar.jpg',
    name: 'John Doe',
    content: 'Search result content',
    postId: 'post-1',
  };

  it('renders post search card correctly', () => {
    render(<PostSearchCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Search result content')).toBeInTheDocument();
    expect(screen.getByAltText('avatar')).toBeInTheDocument();
  });

  it('uses default avatar when avatar is null', () => {
    render(<PostSearchCard {...defaultProps} avatar={null} />);

    const avatarImg = screen.getByAltText('avatar');
    expect(avatarImg).toHaveAttribute('src', '/images/user-avatar.webp');
  });

  it('links to correct post', () => {
    render(<PostSearchCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('post-1'));
  });
});
