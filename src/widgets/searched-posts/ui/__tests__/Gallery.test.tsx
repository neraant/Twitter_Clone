import { render, screen } from '@testing-library/react';

import { Gallery } from '../Gallery';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('../../lib', () => ({
  IMAGES: [
    { src: '/img1.png', alt: 'Image 1' },
    { src: '/img2.png', alt: 'Image 2' },
  ],
}));

describe('Gallery', () => {
  it('renders all images from IMAGES array', () => {
    render(<Gallery />);
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
  });
});
