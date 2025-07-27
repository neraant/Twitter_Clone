import { fireEvent, render, screen } from '@testing-library/react';

import { ImagePreview } from '@/entities/post/ui/PostCard';

import { PostImageUploader } from '../PostImageUploader';

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
  CrossIcon: ({ width, height }: { width: number; height: number }) => (
    <div data-testid='cross-icon' style={{ width, height }} />
  ),
}));

describe('PostImageUploader', () => {
  const defaultProps = {
    label: 'Upload Images',
    handleChange: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render uploader with label and icon', () => {
    render(
      <PostImageUploader {...defaultProps}>Upload Images</PostImageUploader>,
    );

    expect(screen.getByTestId('image-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Images')).toBeInTheDocument();
  });

  it('should render file input with correct attributes', () => {
    const { container } = render(<PostImageUploader {...defaultProps} />);

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAttribute('name', 'Upload Images');
    expect(input).toHaveAttribute('id', 'Upload Images');
  });

  it('should handle file input change', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PostImageUploader {...defaultProps} handleChange={handleChange} />,
    );

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(input!, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render children inside content wrapper', () => {
    render(
      <PostImageUploader {...defaultProps}>
        <button>Custom Button</button>
      </PostImageUploader>,
    );

    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });

  it('should not show previews when no items provided', () => {
    render(<PostImageUploader {...defaultProps} />);

    expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
  });

  it('should show previews for imagePreviews array', () => {
    render(
      <PostImageUploader
        {...defaultProps}
        imagePreviews={['image1.jpg', 'image2.jpg']}
      />,
    );

    const previews = screen.getAllByTestId('preview-image');
    expect(previews).toHaveLength(2);
    expect(previews[0]).toHaveAttribute('src', 'image1.jpg');
    expect(previews[1]).toHaveAttribute('src', 'image2.jpg');
  });

  it('should show previews for previewItems array', () => {
    const previewItems = [
      { id: '1', url: 'image1.jpg' },
      { id: '2', url: 'image2.jpg' },
    ] as ImagePreview[];

    render(<PostImageUploader {...defaultProps} previewItems={previewItems} />);

    const previews = screen.getAllByTestId('preview-image');
    expect(previews).toHaveLength(2);
    expect(previews[0]).toHaveAttribute('src', 'image1.jpg');
    expect(previews[1]).toHaveAttribute('src', 'image2.jpg');
  });

  it('should prioritize previewItems over imagePreviews', () => {
    const previewItems = [{ id: '1', url: 'preview.jpg' }] as ImagePreview[];

    render(
      <PostImageUploader
        {...defaultProps}
        imagePreviews={['image.jpg']}
        previewItems={previewItems}
      />,
    );

    const preview = screen.getByTestId('preview-image');
    expect(preview).toHaveAttribute('src', 'preview.jpg');
  });

  it('should render remove buttons for each preview', () => {
    render(
      <PostImageUploader
        {...defaultProps}
        imagePreviews={['image1.jpg', 'image2.jpg']}
      />,
    );

    const removeButtons = screen.getAllByTestId('cross-icon');
    expect(removeButtons).toHaveLength(2);
  });

  it('should handle remove button click', () => {
    const onRemove = jest.fn();
    render(
      <PostImageUploader
        {...defaultProps}
        imagePreviews={['image1.jpg', 'image2.jpg']}
        onRemove={onRemove}
      />,
    );

    const removeButtons = screen.getAllByTestId('cross-icon');
    fireEvent.click(removeButtons[0].closest('button')!);

    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('should handle remove button click for second item', () => {
    const onRemove = jest.fn();
    render(
      <PostImageUploader
        {...defaultProps}
        imagePreviews={['image1.jpg', 'image2.jpg']}
        onRemove={onRemove}
      />,
    );

    const removeButtons = screen.getAllByTestId('cross-icon');
    fireEvent.click(removeButtons[1].closest('button')!);

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('should apply custom className to content', () => {
    const { container } = render(
      <PostImageUploader {...defaultProps} className='custom-class' />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should use correct key for previewItems', () => {
    const previewItems = [
      { id: 'unique-1', url: 'image1.jpg' },
      { id: 'unique-2', url: 'image2.jpg' },
    ] as ImagePreview[];

    render(<PostImageUploader {...defaultProps} previewItems={previewItems} />);

    expect(screen.getAllByTestId('preview-image')).toHaveLength(2);
  });

  it('should handle empty imagePreviews array', () => {
    render(<PostImageUploader {...defaultProps} imagePreviews={[]} />);

    expect(screen.queryByTestId('preview-image')).not.toBeInTheDocument();
  });

  it('should have correct icon dimensions', () => {
    render(<PostImageUploader {...defaultProps} />);

    const icon = screen.getByTestId('image-icon');
    expect(icon).toHaveStyle({ width: '22px', height: '22px' });
  });
});
