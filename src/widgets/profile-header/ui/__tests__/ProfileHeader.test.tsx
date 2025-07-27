import { fireEvent, render, screen } from '@testing-library/react';

import { User } from '@/entities/user';

import { ProfileHeader } from '../ProfileHeader';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar_url: '/avatar.jpg',
  banner_url: '/banner.jpg',
  bio: 'Test bio',
  gender: 'male',
  followers_count: 10,
  following_count: 5,
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
  date_of_birth: null,
  phone_number: null,
  user_telegram: '@john',
};

jest.mock('@/entities/user', () => ({
  UserBigCard: ({ user }: { user: User }) => <div>User: {user.name}</div>,
}));

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

describe('ProfileHeader', () => {
  const defaultProps = {
    user: mockUser,
    isOwner: true,
    currentUserId: '1',
    onEditClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render UserBigCard with user data', () => {
    render(<ProfileHeader {...defaultProps} />);

    expect(screen.getByText('User: John Doe')).toBeInTheDocument();
  });

  it('should render ProfileAction component', () => {
    render(<ProfileHeader {...defaultProps} />);

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('should call onEditClick when edit button is clicked', () => {
    render(<ProfileHeader {...defaultProps} />);

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(defaultProps.onEditClick).toHaveBeenCalledTimes(1);
  });

  it('should render follow button when user is not owner', () => {
    render(<ProfileHeader {...defaultProps} isOwner={false} />);

    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
