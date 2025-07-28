import { StaticImageData } from 'next/image';

import { ImagePreview } from '@/entities/post';

export const getImageSrc = (
  item: string | StaticImageData | ImagePreview,
): string | StaticImageData => {
  if (typeof item === 'string') return item;
  if ('url' in item) return item.url;
  return item as StaticImageData;
};

export const getImageKey = (
  item: string | StaticImageData | ImagePreview,
  index: number,
  previewItems?: ImagePreview[],
): string => {
  return previewItems?.[index]?.id ?? `${getImageSrc(item)}-${index}`;
};
