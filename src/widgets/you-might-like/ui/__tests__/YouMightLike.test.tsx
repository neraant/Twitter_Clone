import { render, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/entities/user/api', () => ({
  getCurrentUserAction: jest.fn(),
}));
jest.mock('../../api', () => ({
  getYouMightLikeUsersAction: jest.fn(),
}));
jest.mock('@/features/follow-button/api/followActions', () => ({
  isFollowingAction: jest.fn(),
}));
jest.mock('../YouMightLikeClient', () => ({
  YouMightLikeClient: jest.fn(({ initialUsers, currentUserId, isError }) => {
    return (
      <div data-testid='you-might-like-client'>
        {isError
          ? 'Error'
          : `Users: ${initialUsers?.length || 0}, CurrentUser: ${currentUserId}`}
      </div>
    );
  }),
}));

import { getCurrentUserAction } from '@/entities/user/api';

import { getYouMightLikeUsersAction } from '../../api';
import { YouMightLike } from '../YouMightLike';

describe('YouMightLike', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders null if no current user', async () => {
    (getCurrentUserAction as jest.Mock).mockResolvedValue(null);

    const { container } = render(<YouMightLike />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders null if no users to suggest', async () => {
    (getCurrentUserAction as jest.Mock).mockResolvedValue({ id: 'user1' });
    (getYouMightLikeUsersAction as jest.Mock).mockResolvedValue(null);

    const { container } = render(<YouMightLike />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
