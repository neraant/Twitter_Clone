import { render, screen } from '@testing-library/react';

import { User } from '../../model';
import { UserSmallCard } from '../UserSmallCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid='user-avatar' />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock('@/features/follow-button/ui', () => ({
  FollowButton: ({
    targetUserId,
  }: {
    targetUserId: string;
    currentUserId: string;
  }) => <button data-testid='follow-button'>Follow {targetUserId}</button>,
}));

jest.mock('@/shared/config/routes', () => ({
  routes: {
    app: {
      profile: '/profile',
    },
  },
}));

jest.mock('../../lib', () => ({
  UNNAMED_USER: 'Unnamed User',
}));

describe('UserSmallCard', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    user_telegram: '@johndoe',
  };

  it('should return null when user is not provided', () => {
    const { container } = render(<UserSmallCard user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render user information with avatar and name', () => {
    render(<UserSmallCard user={mockUser} />);

    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
  });

  it('should use default avatar when avatar_url is null', () => {
    const userWithoutAvatar = { ...mockUser, avatar_url: null };
    render(<UserSmallCard user={userWithoutAvatar} />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveAttribute('src', '/images/user-avatar.webp');
  });

  it('should display unnamed user when name is null', () => {
    const userWithoutName = { ...mockUser, name: null };
    render(<UserSmallCard user={userWithoutName} />);

    expect(screen.getByText('Unnamed User')).toBeInTheDocument();
  });

  it('should link to own profile when isOwnProfile is true', () => {
    render(<UserSmallCard user={mockUser} isOwnProfile />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('should link to user profile when isOwnProfile is false', () => {
    render(<UserSmallCard user={mockUser} isOwnProfile={false} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/profile/user-123');
  });

  it('should show follow button when not own profile and currentUserId provided', () => {
    render(
      <UserSmallCard
        user={mockUser}
        isOwnProfile={false}
        currentUserId='current-user-123'
      />,
    );

    expect(screen.getByTestId('follow-button')).toBeInTheDocument();
  });

  it('should not show follow button when isOwnProfile is true', () => {
    render(
      <UserSmallCard user={mockUser} isOwnProfile currentUserId='user-123' />,
    );

    expect(screen.queryByTestId('follow-button')).not.toBeInTheDocument();
  });

  it('should not show follow button when currentUserId is not provided', () => {
    render(<UserSmallCard user={mockUser} isOwnProfile={false} />);

    expect(screen.queryByTestId('follow-button')).not.toBeInTheDocument();
  });

  it('should not show follow button when currentUserId equals user id', () => {
    render(
      <UserSmallCard
        user={mockUser}
        isOwnProfile={false}
        currentUserId='user-123'
      />,
    );

    expect(screen.queryByTestId('follow-button')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <UserSmallCard user={mockUser} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set title attribute for name', () => {
    render(<UserSmallCard user={mockUser} />);

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toHaveAttribute('title', 'John Doe');
  });

  it('should set title attribute for unnamed user', () => {
    const userWithoutName = { ...mockUser, name: null };
    render(<UserSmallCard user={userWithoutName} />);

    const nameElement = screen.getByText('Unnamed User');
    expect(nameElement).toHaveAttribute('title', 'Unnamed User');
  });

  it('should handle undefined user_telegram', () => {
    const userWithoutTelegram = {
      ...mockUser,
      user_telegram: undefined,
    } as unknown as User;
    render(<UserSmallCard user={userWithoutTelegram} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('@johndoe')).not.toBeInTheDocument();
  });
});
