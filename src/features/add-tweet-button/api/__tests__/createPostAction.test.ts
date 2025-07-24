import { createClient } from '@/shared/api/supabase/server';

import { createPostAction } from '../createPostAction';

jest.mock('@/shared/api/supabase/server');

describe('createPostAction', () => {
  const mockPayload = { title: 'Test post', content: 'Hello' };

  const mockInsert = jest.fn();
  const mockFrom = jest.fn(() => ({ insert: mockInsert }));

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      from: mockFrom,
    });
  });

  it('successfully creates a post', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const result = await createPostAction(mockPayload as never);

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockInsert).toHaveBeenCalledWith(mockPayload);
    expect(result).toEqual({ success: true });
  });

  it('throws error if supabase insert returns error', async () => {
    const errorMessage = 'Insert failed';
    mockInsert.mockResolvedValue({ error: { message: errorMessage } });

    await expect(createPostAction(mockPayload as never)).rejects.toThrow(
      errorMessage,
    );

    expect(createClient).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('posts');
    expect(mockInsert).toHaveBeenCalledWith(mockPayload);
  });

  it('throws error if createClient throws', async () => {
    const error = new Error('Client error');
    (createClient as jest.Mock).mockRejectedValueOnce(error);

    await expect(createPostAction(mockPayload as never)).rejects.toThrow(error);

    expect(createClient).toHaveBeenCalled();
  });
});
