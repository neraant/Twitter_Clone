import * as supabaseModule from '@/shared/api/supabase/server';

import { checkDuplicateImage } from '../checkImageDuplicate.utils';
import * as hashUtils from '../createImageHash.utils';

const mockCreateClient = jest.spyOn(supabaseModule, 'createClient');
const mockCreateImageHash = jest.spyOn(hashUtils, 'createImageHash');
const mockCreatePerceptualHash = jest.spyOn(hashUtils, 'createPerceptualHash');

describe('checkDuplicateImage', () => {
  const userId = 'user-1';
  const imageBuffer = Buffer.from('test');

  let fromMock: jest.Mock;
  let selectMock: jest.Mock;
  let eqMock: jest.Mock;
  let notMock: jest.Mock;

  beforeEach(() => {
    selectMock = jest.fn().mockReturnThis();
    eqMock = jest.fn().mockReturnThis();
    notMock = jest.fn().mockResolvedValue({ data: [], error: null });

    const supabaseChainMock = {
      select: selectMock,
      eq: eqMock,
      not: notMock,
    };

    fromMock = jest.fn().mockReturnValue(supabaseChainMock);
    (mockCreateClient as jest.Mock).mockResolvedValue({ from: fromMock });

    mockCreateImageHash.mockResolvedValue('image-hash');
    mockCreatePerceptualHash.mockResolvedValue('perceptual-hash');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns isDuplicate false if user has no posts', async () => {
    notMock.mockResolvedValue({ data: [], error: null });

    const result = await checkDuplicateImage(userId, imageBuffer);

    expect(result).toEqual({ isDuplicate: false });
    expect(mockCreateImageHash).toHaveBeenCalledWith(imageBuffer);
    expect(mockCreatePerceptualHash).toHaveBeenCalledWith(imageBuffer);
  });

  it('returns isDuplicate true if exact image hash found', async () => {
    const mockPost = {
      id: 'post-1',
      image_hashes: ['image-hash', 'other-hash'],
      image_urls: ['url1', 'url2'],
      perceptual_hashes: null,
      author_id: userId,
    };

    notMock.mockResolvedValue({ data: [mockPost], error: null });

    const result = await checkDuplicateImage(userId, imageBuffer);

    expect(result.isDuplicate).toBe(true);
    expect(result.imageUrl).toBe('url1');
    expect(result.post).toStrictEqual(mockPost);
  });

  it('returns isDuplicate false if no duplicates found', async () => {
    const mockPost = {
      id: 'post-3',
      image_hashes: ['other-hash'],
      perceptual_hashes: ['00000000'],
      image_urls: ['url1'],
      author_id: userId,
    };

    notMock.mockResolvedValue({ data: [mockPost], error: null });

    const result = await checkDuplicateImage(userId, imageBuffer);

    expect(result.isDuplicate).toBe(false);
  });

  it('throws error if supabase query fails', async () => {
    notMock.mockRejectedValue(new Error('DB error'));

    await expect(checkDuplicateImage(userId, imageBuffer)).rejects.toThrow(
      'DB error',
    );
  });
});
