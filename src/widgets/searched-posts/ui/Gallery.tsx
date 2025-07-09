import gallery1 from '@assets/images/gallery_1.png';
import gallery2 from '@assets/images/gallery_2.png';
import gallery3 from '@assets/images/gallery_3.png';
import gallery4 from '@assets/images/gallery_4.png';
import gallery5 from '@assets/images/gallery_5.png';
import gallery6 from '@assets/images/gallery_6.png';
import Image from 'next/image';

import styles from './SearchedPosts.module.scss';

const images = [
  { src: gallery1, alt: 'Mountains in winter' },
  { src: gallery2, alt: 'Coastal view at sunset' },
  { src: gallery3, alt: 'Modern city skyline' },
  { src: gallery4, alt: 'Nature forest path' },
  { src: gallery5, alt: 'Lake with reflections' },
  { src: gallery6, alt: 'Snowy village rooftops' },
];

export const Gallery = () => {
  return (
    <div className={styles.gallery}>
      {images.map((img, index) => (
        <div key={index} className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={img.src}
            alt={img.alt}
            width={100}
            height={100}
            placeholder='blur'
          />
        </div>
      ))}
    </div>
  );
};
