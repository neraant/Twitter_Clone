import { fireEvent, render, screen } from '@testing-library/react';

import { ProfileImageUploader } from '../ProfileImageUploader';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid='preview-image'
    />
  ),
}));

jest.mock('@/shared/ui/icon', () => ({
  ImageIcon: ({
    width,
    height,
    className,
  }: {
    width: number;
    height: number;
    className: string;
  }) => (
    <div
      data-testid='image-icon'
      style={{ width, height }}
      className={className}
    />
  ),
}));

describe('ProfileImageUploader', () => {
  const defaultProps = {
    label: 'Upload Avatar',
    imagePreview: null,
    handleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render file input with correct attributes', () => {
    render(<ProfileImageUploader {...defaultProps} />);

    const input = screen.getByLabelText('Upload Avatar');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('name', 'Upload Avatar');
    expect(input).toHaveAttribute('id', 'Upload Avatar');
  });

  it('should handle file input change', () => {
    const handleChange = jest.fn();
    render(
      <ProfileImageUploader {...defaultProps} handleChange={handleChange} />,
    );

    const input = screen.getByLabelText('Upload Avatar');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should not show preview when imagePreview is null', () => {
    render(<ProfileImageUploader {...defaultProps} imagePreview={null} />);

    expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
  });

  it('should show preview when imagePreview is provided', () => {
    render(
      <ProfileImageUploader
        {...defaultProps}
        imagePreview='https://example.com/image.jpg'
      />,
    );

    const preview = screen.getByTestId('preview-image');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(preview).toHaveAttribute('alt', 'Preview');
  });

  it('should apply custom className to wrapper', () => {
    const { container } = render(
      <ProfileImageUploader {...defaultProps} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to preview image when provided', () => {
    render(
      <ProfileImageUploader
        {...defaultProps}
        imagePreview='test.jpg'
        className='custom-preview'
      />,
    );

    const preview = screen.getByTestId('preview-image');
    expect(preview).toHaveClass('custom-preview');
  });

  it('should have correct icon dimensions', () => {
    render(<ProfileImageUploader {...defaultProps} />);

    const icon = screen.getByTestId('image-icon');
    expect(icon).toHaveStyle({ width: '18px', height: '18px' });
  });
});
