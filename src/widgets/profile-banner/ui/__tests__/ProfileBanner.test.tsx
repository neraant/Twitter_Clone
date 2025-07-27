import { render, screen } from '@testing-library/react';

import { ProfileBanner } from '../ProfileBanner';

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: never) => <img src={src} alt={alt} />,
}));

jest.mock('@/shared/ui/back-button', () => ({
  BackButton: () => <button>Back</button>,
}));

describe('ProfileBanner', () => {
  const defaultProps = {
    userName: 'John Doe',
    userBanner: '/custom-banner.jpg',
    tweetsLength: 5,
  };

  it('should render user name correctly', () => {
    render(<ProfileBanner {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render unnamed user when userName is null', () => {
    render(<ProfileBanner {...defaultProps} userName={null} />);

    expect(screen.getByText('unnamed user')).toBeInTheDocument();
  });

  it('should render correct tweet count for single tweet', () => {
    render(<ProfileBanner {...defaultProps} tweetsLength={1} />);

    expect(screen.getByText('1 Tweet')).toBeInTheDocument();
  });

  it('should render correct tweet count for multiple tweets', () => {
    render(<ProfileBanner {...defaultProps} tweetsLength={5} />);

    expect(screen.getByText('5 Tweets')).toBeInTheDocument();
  });

  it('should render default banner when userBanner is null', () => {
    render(<ProfileBanner {...defaultProps} userBanner={null} />);

    const bannerImage = screen.getByAltText('banner');
    expect(bannerImage).toHaveAttribute('src', '/images/default-banner.webp');
  });

  it('should render custom banner when provided', () => {
    render(<ProfileBanner {...defaultProps} />);

    const bannerImage = screen.getByAltText('banner');
    expect(bannerImage).toHaveAttribute('src', '/custom-banner.jpg');
  });

  it('should render BackButton component', () => {
    render(<ProfileBanner {...defaultProps} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
