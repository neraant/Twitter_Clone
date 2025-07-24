import { Post } from '@/entities/post';
import { StorageFolders } from '@/shared/lib/database';

import { uploadSingleImage } from '../../api';
import { uploadMultipleImagesAction } from '../uploadMultipleImagesAction';

jest.mock('../../api/uploadSingleImage', () => ({
  uploadSingleImage: jest.fn(),
}));

const mockUploadSingleImage = uploadSingleImage as jest.MockedFunction<
  typeof uploadSingleImage
>;

function createMockFile(name: string): File {
  return new File(['file-content'], name, { type: 'image/png' });
}

function createFormDataWithFiles(files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return formData;
}

describe('uploadMultipleImagesAction', () => {
  const userId = 'user-1';
  const folder = 'post-images' as StorageFolders;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uploads a single image successfully without duplicate', async () => {
    const file = createMockFile('image1.png');
    const formData = createFormDataWithFiles([file]);

    mockUploadSingleImage.mockResolvedValueOnce({
      isDuplicate: false,
      url: 'https://example.com/image1.png',
    });

    const result = await uploadMultipleImagesAction(formData, folder, userId);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.duplicates).toBeUndefined();
    expect(mockUploadSingleImage).toHaveBeenCalledWith(
      file,
      folder,
      userId,
      false,
      true,
    );
  });

  it('uploads image with duplicate', async () => {
    const post: Post = {
      id: 'post-123',
      content: '',
      author_id: userId,
      created_at: '',
      image_urls: [],
      is_deleted: null,
    };

    const file = createMockFile('dup.png');
    const formData = createFormDataWithFiles([file]);

    mockUploadSingleImage.mockResolvedValueOnce({
      isDuplicate: true,
      url: 'https://example.com/dup.png',
      duplicatePost: post,
    });

    const result = await uploadMultipleImagesAction(formData, folder, userId);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.duplicates).toEqual([
      {
        fileName: 'dup.png',
        duplicatePost: post,
      },
    ]);
  });

  it('uploads multiple files with all duplicates', async () => {
    const file1 = createMockFile('img1.png');
    const file2 = createMockFile('img2.png');
    const formData = createFormDataWithFiles([file1, file2]);

    const post: Post = {
      id: 'p1',
      content: '',
      author_id: userId,
      created_at: '',
      image_urls: [],
      is_deleted: null,
    };

    mockUploadSingleImage
      .mockResolvedValueOnce({
        isDuplicate: true,
        url: 'url1',
        duplicatePost: post,
      })
      .mockResolvedValueOnce({
        isDuplicate: true,
        url: 'url2',
        duplicatePost: post,
      });

    const result = await uploadMultipleImagesAction(formData, folder, userId);

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.duplicates).toHaveLength(2);
  });

  it('calls onProgress with correct percentages', async () => {
    const file1 = createMockFile('file1.png');
    const file2 = createMockFile('file2.png');
    const formData = createFormDataWithFiles([file1, file2]);

    mockUploadSingleImage
      .mockResolvedValueOnce({ isDuplicate: false, url: 'url1' })
      .mockResolvedValueOnce({ isDuplicate: false, url: 'url2' });

    const progressUpdates: number[] = [];
    const onProgress = (p: number) => progressUpdates.push(p);

    await uploadMultipleImagesAction(formData, folder, userId, onProgress);

    expect(progressUpdates).toEqual([0, 50, 50, 100]);
  });

  it('returns error on upload failure', async () => {
    const file = createMockFile('error.png');
    const formData = createFormDataWithFiles([file]);

    mockUploadSingleImage.mockRejectedValueOnce(new Error('Upload failed'));

    const result = await uploadMultipleImagesAction(formData, folder, userId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Upload failed');
  });
});
