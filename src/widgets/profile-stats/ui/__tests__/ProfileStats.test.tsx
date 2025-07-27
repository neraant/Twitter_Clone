import { fireEvent, render, screen } from '@testing-library/react';

import { User } from '@/entities/user';

import { ProfileStats } from '../ProfileStats';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar_url: '/avatar.jpg',
  banner_url: '/banner.jpg',
  bio: 'Test bio',
  user_telegram: '@john',
  gender: 'male',
  followers_count: 1,
  following_count: 5,
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
  date_of_birth: null,
  phone_number: null,
};

jest.mock('@/widgets/profile-action', () => ({
  ProfileAction: ({
    onEditClick,
    isOwner,
  }: {
    onEditClick: () => void;
    isOwner: boolean;
  }) => (
    <button onClick={onEditClick}>{isOwner ? 'Edit Profile' : 'Follow'}</button>
  ),
}));

describe('ProfileStats', () => {
  const defaultProps = {
    user: mockUser,
    isOwner: true,
    currentUserId: '1',
    targetUserId: '1',
    onEditClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render singular follower text when count is 1', () => {
    render(<ProfileStats {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Follower')).toBeInTheDocument();
  });

  it('should render plural followers text when count is not 1', () => {
    const userWithMultipleFollowers = { ...mockUser, followers_count: 5 };
    render(<ProfileStats {...defaultProps} user={userWithMultipleFollowers} />);

    expect(screen.getAllByText('5')).toHaveLength(2);
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
  });

  it('should render following count', () => {
    render(<ProfileStats {...defaultProps} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should render 0 followers when count is null', () => {
    const userWithNoFollowers = { ...mockUser, followers_count: 0 };
    render(<ProfileStats {...defaultProps} user={userWithNoFollowers} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();
  });

  it('should render 0 following when count is null', () => {
    const userWithNoFollowing = { ...mockUser, following_count: 0 };
    render(<ProfileStats {...defaultProps} user={userWithNoFollowing} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
  });

  it('should call onEditClick when ProfileAction is clicked', () => {
    render(<ProfileStats {...defaultProps} />);

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(defaultProps.onEditClick).toHaveBeenCalledTimes(1);
  });
});
