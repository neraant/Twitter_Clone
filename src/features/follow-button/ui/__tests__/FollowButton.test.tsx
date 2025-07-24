import { fireEvent, render, screen } from '@testing-library/react';

import * as lib from '../../lib';
import { FollowButton } from '../FollowButton';

jest.mock('../../lib/useFollow');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('@/shared/ui/loader', () => ({
  Loader: () => <div data-testid='loader'>Loading...</div>,
}));

const mockUseFollow = lib.useFollow as jest.Mock;

describe('FollowButton', () => {
  const baseProps = {
    targetUserId: 'user-123',
    currentUserId: 'user-456',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isFollowed is undefined', () => {
    mockUseFollow.mockReturnValue({
      isFollowed: undefined,
      loading: false,
      handleClick: jest.fn(),
    });

    const { container } = render(<FollowButton {...baseProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders follow text when not followed', () => {
    mockUseFollow.mockReturnValue({
      isFollowed: false,
      loading: false,
      handleClick: jest.fn(),
    });

    render(<FollowButton {...baseProps} />);
    expect(screen.getByRole('button')).toHaveTextContent(lib.FOLLOW_TEXT);
  });

  it('renders unfollow text when followed', () => {
    mockUseFollow.mockReturnValue({
      isFollowed: true,
      loading: false,
      handleClick: jest.fn(),
    });

    render(<FollowButton {...baseProps} />);
    expect(screen.getByRole('button')).toHaveTextContent(lib.UNFOLLOW_TEXT);
  });

  it('renders loader when loading', () => {
    mockUseFollow.mockReturnValue({
      isFollowed: true,
      loading: true,
      handleClick: jest.fn(),
    });

    render(<FollowButton {...baseProps} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('calls handleClick on click', () => {
    const mockClick = jest.fn();
    mockUseFollow.mockReturnValue({
      isFollowed: false,
      loading: false,
      handleClick: mockClick,
    });

    render(<FollowButton {...baseProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalled();
  });
});
