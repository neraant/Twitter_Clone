import Image from 'next/image';

import { IMAGES } from '../lib';
import styles from './SearchedPosts.module.scss';

export const Gallery = () => {
  return (
    <div className={styles.gallery}>
      {IMAGES.map(({ src, alt }, index) => (
        <div key={index} className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={src}
            alt={alt}
            width={100}
            height={100}
          />
        </div>
      ))}
    </div>
  );
};
