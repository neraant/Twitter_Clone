'use server';

import sharp from 'sharp';

import { DEFAULT_QUALITY } from './imageUploader.constants';

export const processImage = async (
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {},
): Promise<Buffer> => {
  const { width, height, quality = DEFAULT_QUALITY } = options;

  let sharpInstance = sharp(buffer);

  sharpInstance = sharpInstance.rotate();

  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return sharpInstance.webp({ quality }).toBuffer();
};
