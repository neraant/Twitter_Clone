import { revalidateTag } from 'next/cache';

import { createClient } from '@/shared/api/supabase/server';

import { editProfileAction } from '../editProfileAction';

jest.mock('@/shared/api/supabase/server');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

describe('editProfileAction', () => {
  const userId = 'user123';
  const formData = {
    name: 'John Doe',
    telegram: '@johndoe',
    bio: 'Bio text',
    gender: 'male',
  };
  const avatar_url = 'avatar.png';
  const banner_url = 'banner.png';

  const mockUpdate = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockSelect = jest.fn().mockReturnThis();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSingle.mockResolvedValue({
      data: { id: userId, ...formData, avatar_url, banner_url },
      error: null,
    });
    (createClient as jest.Mock).mockResolvedValue({
      from: jest.fn(() => ({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      })),
    });
  });

  it('updates user profile and revalidates tags', async () => {
    const result = await editProfileAction(
      userId,
      formData,
      avatar_url,
      banner_url,
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      name: formData.name,
      user_telegram: formData.telegram,
      bio: formData.bio,
      gender: formData.gender,
      avatar_url,
      banner_url,
    });
    expect(mockEq).toHaveBeenCalledWith('id', userId);
    expect(result).toEqual({ id: userId, ...formData, avatar_url, banner_url });
    expect(revalidateTag).toHaveBeenCalledWith('user-profile');
    expect(revalidateTag).toHaveBeenCalledWith(`user-${userId}`);
  });

  it('throws an error if update fails', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: new Error('Update failed'),
    });

    await expect(
      editProfileAction(userId, formData, avatar_url, banner_url),
    ).rejects.toThrow('Update failed');
  });
});
