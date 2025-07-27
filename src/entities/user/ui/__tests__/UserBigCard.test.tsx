import { render, screen } from '@testing-library/react';

import { User } from '../../model';
import { UserBigCard } from '../UserBigCard';

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
    target,
  }: {
    href: string;
    children: React.ReactNode;
    className: string;
    target: string;
  }) => (
    <a
      href={href}
      className={className}
      target={target}
      data-testid='telegram-link'
    >
      {children}
    </a>
  ),
}));

describe('UserBigCard', () => {
  const mockUser = {
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    user_telegram: '@johndoe',
    bio: 'Software developer and tech enthusiast',
  };

  it('should return null when user is not provided', () => {
    const { container } = render(<UserBigCard user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render user information with avatar, name and bio', () => {
    render(<UserBigCard user={mockUser} />);

    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.getByText('Software developer and tech enthusiast'),
    ).toBeInTheDocument();
  });

  it('should use default avatar when avatar_url is null', () => {
    const userWithoutAvatar = { ...mockUser, avatar_url: null };
    render(<UserBigCard user={userWithoutAvatar} />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveAttribute('src', '/images/user-avatar.webp');
  });

  it('should render telegram link with @ prefix', () => {
    render(<UserBigCard user={mockUser} />);

    const telegramLink = screen.getByTestId('telegram-link');
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/johndoe');
    expect(telegramLink).toHaveAttribute('target', '_blank');
    expect(telegramLink).toHaveTextContent('@johndoe');
  });

  it('should render telegram link without @ prefix when not present', () => {
    const userWithoutAtPrefix = { ...mockUser, user_telegram: 'johndoe' };
    render(<UserBigCard user={userWithoutAtPrefix} />);

    const telegramLink = screen.getByTestId('telegram-link');
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/johndoe');
    expect(telegramLink).toHaveTextContent('johndoe');
  });

  it('should not render telegram link when user_telegram is null', () => {
    const userWithoutTelegram = { ...mockUser, user_telegram: null };
    render(<UserBigCard user={userWithoutTelegram} />);

    expect(screen.queryByTestId('telegram-link')).not.toBeInTheDocument();
  });

  it('should not render telegram link when user_telegram is undefined', () => {
    const userWithoutTelegram = {
      ...mockUser,
      user_telegram: undefined,
    } as unknown as User;
    render(<UserBigCard user={userWithoutTelegram} />);

    expect(screen.queryByTestId('telegram-link')).not.toBeInTheDocument();
  });

  it('should not render bio when bio is null', () => {
    const userWithoutBio = { ...mockUser, bio: null };
    render(<UserBigCard user={userWithoutBio} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.queryByText('Software developer and tech enthusiast'),
    ).not.toBeInTheDocument();
  });

  it('should not render bio when bio is undefined', () => {
    const userWithoutBio = { ...mockUser, bio: undefined } as unknown as User;
    render(<UserBigCard user={userWithoutBio} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.queryByText('Software developer and tech enthusiast'),
    ).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <UserBigCard user={mockUser} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set title attribute for name', () => {
    render(<UserBigCard user={mockUser} />);

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toHaveAttribute('title', 'John Doe');
  });

  it('should render with all optional fields present', () => {
    render(<UserBigCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(
      screen.getByText('Software developer and tech enthusiast'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('telegram-link')).toBeInTheDocument();
  });

  it('should handle empty string bio', () => {
    const userWithEmptyBio = { ...mockUser, bio: '' };
    render(<UserBigCard user={userWithEmptyBio} />);

    expect(
      screen.queryByText('Software developer and tech enthusiast'),
    ).not.toBeInTheDocument();
  });

  it('should handle empty string telegram', () => {
    const userWithEmptyTelegram = { ...mockUser, user_telegram: '' };
    render(<UserBigCard user={userWithEmptyTelegram} />);

    expect(screen.queryByTestId('telegram-link')).not.toBeInTheDocument();
  });
});
