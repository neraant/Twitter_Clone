import crypto from 'crypto';
import sharp from 'sharp';

import {
  createImageHash,
  createPerceptualHash,
} from '../createImageHash.utils';

jest.mock('sharp');

const mockResize = jest.fn();
const mockRemoveAlpha = jest.fn();
const mockRaw = jest.fn();
const mockGreyscale = jest.fn();
const mockToBuffer = jest.fn();

(sharp as unknown as jest.Mock).mockImplementation(() => ({
  resize: mockResize,
  removeAlpha: mockRemoveAlpha,
  raw: mockRaw,
  greyscale: mockGreyscale,
  toBuffer: mockToBuffer,
}));

describe('createImageHash', () => {
  it('generates an MD5 hash of resized image buffer', async () => {
    const buffer = Buffer.from([1, 2, 3]);
    const processedBuffer = Buffer.from([4, 5, 6]);

    mockResize.mockReturnThis();
    mockRemoveAlpha.mockReturnThis();
    mockRaw.mockReturnThis();
    mockToBuffer.mockResolvedValue(processedBuffer);

    const hash = crypto.createHash('md5').update(processedBuffer).digest('hex');

    const result = await createImageHash(buffer);

    expect(result).toBe(hash);
    expect(mockResize).toHaveBeenCalledWith(256, 256, { fit: 'fill' });
  });

  it('throws if sharp fails during createImageHash', async () => {
    mockResize.mockImplementation(() => {
      throw new Error('sharp error');
    });

    await expect(createImageHash(Buffer.from([]))).rejects.toThrow(
      'sharp error',
    );
  });
});

describe('createPerceptualHash', () => {
  it('generates a perceptual hash from 8x8 greyscale image', async () => {
    const buffer = Buffer.alloc(64, 120);
    const imageBuffer = Buffer.from([1, 2, 3]);

    mockResize.mockReturnThis();
    mockGreyscale.mockReturnThis();
    mockRaw.mockReturnThis();
    mockToBuffer.mockResolvedValue(buffer);

    const result = await createPerceptualHash(imageBuffer);

    const expectedHash = parseInt('0'.repeat(64), 2)
      .toString(16)
      .padStart(16, '0');

    expect(result).toBe(expectedHash);
    expect(mockResize).toHaveBeenCalledWith(8, 8, { fit: 'fill' });
  });

  it('throws if sharp fails during createPerceptualHash', async () => {
    mockResize.mockImplementation(() => {
      throw new Error('sharp error');
    });

    await expect(createPerceptualHash(Buffer.from([]))).rejects.toThrow(
      'sharp error',
    );
  });
});
