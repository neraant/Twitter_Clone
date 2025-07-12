'use server';

import crypto from 'crypto';
import sharp from 'sharp';

export const createImageHash = async (imageBuffer: Buffer): Promise<string> => {
  try {
    const processedImage = await sharp(imageBuffer)
      .resize(256, 256, {
        fit: 'fill',
      })
      .removeAlpha()
      .raw()
      .toBuffer();

    const hash = crypto.createHash('md5').update(processedImage).digest('hex');
    return hash;
  } catch (error) {
    console.error('Error while creating image hash:', error);
    throw error;
  }
};

export const createPerceptualHash = async (
  imageBuffer: Buffer,
): Promise<string> => {
  try {
    const smallImage = await sharp(imageBuffer)
      .resize(8, 8, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer();

    const pixels = Array.from(smallImage);
    const average =
      pixels.reduce((sum, pixel) => sum + pixel, 0) / pixels.length;

    const hash = pixels.map((pixel) => (pixel > average ? '1' : '0')).join('');

    const hexHash = parseInt(hash, 2).toString(16).padStart(16, '0');
    return hexHash;
  } catch (error) {
    console.error('Error while creating perceptual hash:', error);
    throw error;
  }
};
