import { StorageFolders } from '@/shared/lib/database';

import { checkDuplicateImage, createImageHash, processImage } from '../../lib';
import { uploadSingleImage } from '../uploadSingleImage';

jest.mock('../../lib', () => ({
  checkDuplicateImage: jest.fn(),
  processImage: jest.fn(),
  createImageHash: jest.fn().mockResolvedValue('fakehash123'),
  AVATAR_DEFAULT_QUALITY: 80,
  AVATAR_DEFAULT_SIZE: 150,
  POST_DEFAULT_QUALITY: 85,
  POST_DEFAULT_SIZE: 800,
}));

jest.mock('@/shared/api/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('../../lib/createImageHash.utils', () => ({
  createImageHash: jest.fn().mockResolvedValue('fakehash123'),
  createPerceptualHash: jest.fn(),
}));

import { createClient } from '@/shared/api/supabase/server';

describe('uploadSingleImage', () => {
  const mockSupabase = {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
      list: jest.fn(),
      remove: jest.fn(),
    },
  };

  const mockFile = {
    name: 'test.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024,
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
  } as unknown as File;

  beforeEach(() => {
    jest.clearAllMocks();

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    globalThis.Buffer = Buffer;
    jest.spyOn(Buffer, 'from').mockReturnValue(Buffer.alloc(100));
  });

  it('throws error for non-image file', async () => {
    const textFile = {
      name: 'test.txt',
      type: 'text/plain',
      size: 1024,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as File;

    await expect(
      uploadSingleImage(textFile, StorageFolders.posts, 'user-id'),
    ).rejects.toThrow('Invalid file type');
  });

  it('throws error for large file', async () => {
    const largeFile = {
      name: 'test.jpg',
      type: 'image/jpeg',
      size: 6 * 1024 * 1024,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as File;

    await expect(
      uploadSingleImage(largeFile, StorageFolders.posts, 'user-id'),
    ).rejects.toThrow('Maximum size is 5MB');
  });

  it('successfully uploads image', async () => {
    (checkDuplicateImage as jest.Mock).mockResolvedValue({
      isDuplicate: false,
    });
    (processImage as jest.Mock).mockResolvedValue(Buffer.alloc(100));
    (createImageHash as jest.Mock).mockResolvedValue('fakehash123');

    mockSupabase.storage.upload.mockResolvedValue({ error: null });
    mockSupabase.storage.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/image.webp' },
    });

    const result = await uploadSingleImage(
      mockFile,
      StorageFolders.posts,
      'user-id',
    );

    expect(result.url).toBe('https://example.com/image.webp');
    expect(result.isDuplicate).toBe(false);
  });
});
