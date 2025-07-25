import Link from 'next/link';

import { FOOTER_LINKS } from '../../lib/footer/footerLinks';
import { Container } from '../container';
import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerInner}>
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
};
