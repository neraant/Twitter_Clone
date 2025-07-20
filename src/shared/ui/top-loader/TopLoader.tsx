'use client';

import { usePathname } from 'next/navigation';
import nProgress from 'nprogress';
import { useEffect } from 'react';

nProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
});

export const TopLoader = () => {
  const pathname = usePathname();

  useEffect(() => {
    nProgress.done();

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      const isInternal =
        href.startsWith('/') || href.startsWith(window.location.origin);
      const isCurrentPage = href === pathname;
      const isHashLink = href.startsWith('#');
      const isExternal =
        href.startsWith('http') && !href.startsWith(window.location.origin);

      if (isExternal || isHashLink || isCurrentPage) {
        return;
      }

      const isModifiedClick =
        e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0;
      if (isModifiedClick) return;

      if (isInternal) {
        nProgress.start();
      }
    };

    document.addEventListener('click', handleLinkClick);

    const handlePopState = () => {
      nProgress.start();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('popstate', handlePopState);
      nProgress.done();
    };
  }, [pathname]);

  return null;
};
