import gallery1 from '@assets/images/gallery_1.png';
import gallery2 from '@assets/images/gallery_2.png';
import gallery3 from '@assets/images/gallery_3.png';
import gallery4 from '@assets/images/gallery_4.png';
import gallery5 from '@assets/images/gallery_5.png';
import gallery6 from '@assets/images/gallery_6.png';
import Image from 'next/image';

import styles from './SearchedPosts.module.scss';

export const Gallery = () => {
  return (
    <div className={styles.gallery}>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery1} alt='gallery' />
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery2} alt='gallery' />
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery3} alt='gallery' />
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery4} alt='gallery' />
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery5} alt='gallery' />
      </div>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={gallery6} alt='gallery' />
      </div>
    </div>
  );
};
