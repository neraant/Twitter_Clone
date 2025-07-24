import { fireEvent, render, screen } from '@testing-library/react';

import { User } from '@/entities/user/model/user.types';

import {
  EMPTY_USERS_TEXT,
  ERROR_USERS_TEXT,
  SHOW_LESS_BUTTON,
  SHOW_MORE_BUTTON,
} from '../../lib';
import { YouMightLikeClient } from '../YouMightLikeClient';

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  email: 'john@example.com',
  created_at: '',
  updated_at: '',
  banner_url: null,
  date_of_birth: null,
  followers_count: 0,
  following_count: 0,
  gender: null,
  phone_number: null,
  user_telegram: null,
};

describe('YouMightLikeClient', () => {
  it('renders error state if isError is true', () => {
    render(<YouMightLikeClient isError />);
    expect(screen.getByText(ERROR_USERS_TEXT)).toBeInTheDocument();
  });

  it('renders empty state if no users', () => {
    render(<YouMightLikeClient initialUsers={[]} />);
    expect(screen.getByText(EMPTY_USERS_TEXT)).toBeInTheDocument();
  });

  it('renders user cards if users are provided', () => {
    render(
      <YouMightLikeClient
        initialUsers={[{ ...mockUser, isFollowed: false }]}
      />,
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('toggles show more/less button text', () => {
    render(
      <YouMightLikeClient
        initialUsers={[{ ...mockUser, isFollowed: false }]}
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(SHOW_MORE_BUTTON);

    fireEvent.click(button);
    expect(button).toHaveTextContent(SHOW_LESS_BUTTON);
  });

  it('does not render button if initialUsers is undefined', () => {
    render(<YouMightLikeClient />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
