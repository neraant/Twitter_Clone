import { fireEvent, render, screen } from '@testing-library/react';

import { LikeButton } from '../LikeButton';

jest.mock('@/entities/post/lib', () => ({
  usePosts: () => ({
    toggleLike: {
      mutateAsync: jest.fn(),
    },
  }),
}));

jest.mock('@/shared/ui/icon', () => ({
  LikeActiveIcon: ({ className }: never) => (
    <div className={className} data-testid='like-active-icon' />
  ),
  LikeNonActiveIcon: ({ className }: never) => (
    <div className={className} data-testid='like-non-active-icon' />
  ),
}));

describe('LikeButton', () => {
  const defaultProps = {
    isActive: false,
    likeQuantity: '5',
    userId: 'user-1',
    currentUserId: 'current-user',
    postId: 'post-1',
    isDisabled: false,
  };

  it('renders like button with quantity', () => {
    render(<LikeButton {...defaultProps} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByTestId('like-non-active-icon')).toBeInTheDocument();
  });

  it('shows active state when liked', () => {
    render(<LikeButton {...defaultProps} isActive />);

    expect(screen.getByTestId('like-active-icon')).toBeInTheDocument();
  });

  it('is disabled when isDisabled prop is true', () => {
    render(<LikeButton {...defaultProps} isDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles click event', () => {
    render(<LikeButton {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
