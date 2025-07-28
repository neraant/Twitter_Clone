import { fireEvent, render, screen } from '@testing-library/react';

import { ProfileAction } from '../ProfileAction';

jest.mock('@/features/edit-profile-button', () => ({
  EditProfileButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Edit Profile</button>
  ),
}));

jest.mock('@/features/follow-button/ui', () => ({
  FollowButton: ({ targetUserId }: { targetUserId: string }) => (
    <button>Follow {targetUserId}</button>
  ),
}));

jest.mock('@/shared/ui/icon', () => ({
  MessagesIcon: () => <div />,
}));

describe('ProfileAction', () => {
  const defaultProps = {
    isOwner: true,
    currentUserId: '1',
    targetUserId: '2',
    onEditClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render EditProfileButton when user is owner', () => {
    render(<ProfileAction {...defaultProps} />);

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('should render FollowButton when user is not owner', () => {
    render(<ProfileAction {...defaultProps} isOwner={false} />);

    expect(screen.getByText('Follow 2')).toBeInTheDocument();
  });

  it('should call onEditClick when EditProfileButton is clicked', () => {
    render(<ProfileAction {...defaultProps} />);

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(defaultProps.onEditClick).toHaveBeenCalledTimes(1);
  });

  it('should return null when currentUserId is not provided', () => {
    const { container } = render(
      <ProfileAction {...defaultProps} currentUserId={undefined} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should return null when targetUserId is not provided', () => {
    const { container } = render(
      <ProfileAction {...defaultProps} targetUserId={undefined} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ProfileAction {...defaultProps} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
