import sharp from 'sharp';

import { DEFAULT_QUALITY } from '../imageUploader.constants';
import { processImage } from '../processImage.utils';

jest.mock('sharp');

const mockRotate = jest.fn();
const mockResize = jest.fn();
const mockWebp = jest.fn();
const mockToBuffer = jest.fn();

(sharp as unknown as jest.Mock).mockImplementation(() => ({
  rotate: mockRotate,
  resize: mockResize,
  webp: mockWebp,
  toBuffer: mockToBuffer,
}));

describe('processImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRotate.mockReturnThis();
    mockResize.mockReturnThis();
    mockWebp.mockReturnThis();
  });

  it('processes image with default quality without resizing', async () => {
    const buffer = Buffer.from([1, 2, 3]);
    mockToBuffer.mockResolvedValue(buffer);

    const result = await processImage(buffer);

    expect(sharp).toHaveBeenCalledWith(buffer);
    expect(mockRotate).toHaveBeenCalled();
    expect(mockResize).not.toHaveBeenCalled();
    expect(mockWebp).toHaveBeenCalledWith({ quality: DEFAULT_QUALITY });
    expect(mockToBuffer).toHaveBeenCalled();
    expect(result).toBe(buffer);
  });

  it('processes image with specified width, height and quality', async () => {
    const buffer = Buffer.from([4, 5, 6]);
    mockToBuffer.mockResolvedValue(buffer);

    const options = { width: 100, height: 200, quality: 75 };

    const result = await processImage(buffer, options);

    expect(mockRotate).toHaveBeenCalled();
    expect(mockResize).toHaveBeenCalledWith(100, 200, {
      fit: 'inside',
      withoutEnlargement: true,
    });
    expect(mockWebp).toHaveBeenCalledWith({ quality: 75 });
    expect(result).toBe(buffer);
  });

  it('handles error if sharp throws', async () => {
    (sharp as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('sharp error');
    });

    await expect(processImage(Buffer.from([]))).rejects.toThrow('sharp error');
  });
});
