import { fireEvent, render, screen } from '@testing-library/react';

import { AddPostModalForm } from '../AddPostModalForm';

jest.mock('@/features/add-tweet-button', () => ({
  AddTweetButton: ({ isLoading }: { isLoading: boolean }) => (
    <button disabled={isLoading} data-testid='add-tweet-button'>
      {isLoading ? 'Loading...' : 'Tweet'}
    </button>
  ),
}));

jest.mock('@/features/image-uploader/ui', () => ({
  PostImageUploader: ({
    children,
    handleChange,
    onRemove,
    previewItems,
  }: {
    children: React.ReactNode;
    handleChange: (files: FileList) => void;
    onRemove: (index: number) => void;
    previewItems: Array<{ url: string }>;
  }) => (
    <div data-testid='image-uploader'>
      <input
        type='file'
        data-testid='file-input'
        onChange={(e) => e.target.files && handleChange(e.target.files)}
      />
      <button data-testid='remove-image' onClick={() => onRemove(0)}>
        Remove
      </button>
      <div data-testid='preview-count'>{previewItems.length}</div>
      {children}
    </div>
  ),
}));

jest.mock('@/shared/ui/progress-bar', () => ({
  CircleProgressBar: ({ progress }: { progress: number }) => (
    <div data-testid='progress-bar'>Progress: {progress}%</div>
  ),
}));

const mockUsePostForm = {
  handleSubmit: jest.fn((fn) => (e: React.FormEvent) => {
    e.preventDefault();
    fn();
  }),
  onSubmit: jest.fn(),
  register: jest.fn(() => ({ name: 'content' })),
  watch: jest.fn(() => ''),
  removeImage: jest.fn(),
  handleChange: jest.fn(),
  previews: [],
  previewItems: [],
  imagesSize: 0,
  isSubmitting: false,
  imageError: '',
  errors: {},
  isUploading: false,
  uploadProgress: 0,
};

jest.mock('@/widgets/add-post-form/lib', () => ({
  usePostForm: jest.fn(() => mockUsePostForm),
}));

jest.mock('../../lib', () => ({
  TEXTAREA_PLACEHOLDER: "What's happening?",
}));

jest.mock('@/shared/lib/validations', () => ({
  MAX_POST_LEN: 280,
}));

jest.mock('@/shared/lib/image', () => ({
  MAX_VERCEL_SIZE: 5,
}));

describe('AddPostModalForm', () => {
  const defaultProps = {
    userId: 'user-123',
    onSuccess: jest.fn(),
    onFormDataChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with textarea and controls', () => {
    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByTestId('add-tweet-button')).toBeInTheDocument();
    expect(screen.getByTestId('image-uploader')).toBeInTheDocument();
  });

  it('should return null when userId is not provided', () => {
    const { container } = render(
      <AddPostModalForm {...defaultProps} userId='' />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should display character counter with default empty content', () => {
    mockUsePostForm.watch.mockReturnValue('');
    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByText('0/280')).toBeInTheDocument();
  });

  it('should display character counter with content', () => {
    mockUsePostForm.watch.mockReturnValue('Hello world');
    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByText('11/280')).toBeInTheDocument();
  });

  it('should show error styling when content exceeds limit', () => {
    const longContent = 'a'.repeat(285);
    mockUsePostForm.watch.mockReturnValue(longContent);

    render(<AddPostModalForm {...defaultProps} />);

    const counter = screen.getByText('285/280');
    expect(counter).toHaveClass('errorText');
  });

  it('should display image size information', () => {
    mockUsePostForm.imagesSize = 3;
    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByText('(3MB/5MB per image)')).toBeInTheDocument();
  });

  it('should show progress bar when uploading', () => {
    mockUsePostForm.isUploading = true;
    mockUsePostForm.uploadProgress = 75;

    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByText('Progress: 75%')).toBeInTheDocument();
  });

  it('should not show progress bar when not uploading', () => {
    mockUsePostForm.isUploading = false;

    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('should display content error message', () => {
    mockUsePostForm.errors = {
      content: { message: 'Content is too long' },
    };

    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByText('Content is too long')).toBeInTheDocument();
  });

  it('should prioritize content error over image error', () => {
    mockUsePostForm.errors = {
      content: { message: 'Content error' },
    };
    mockUsePostForm.imageError = 'Image error';

    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByText('Content error')).toBeInTheDocument();
    expect(screen.queryByText('Image error')).not.toBeInTheDocument();
  });

  it('should handle form submission', () => {
    render(<AddPostModalForm {...defaultProps} />);

    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form!);

    expect(mockUsePostForm.handleSubmit).toHaveBeenCalled();
  });

  it('should call onFormDataChange when content changes', () => {
    const onFormDataChange = jest.fn();
    mockUsePostForm.watch.mockReturnValue('New content');
    mockUsePostForm.previewItems = [{ url: 'image1.jpg' } as never];

    render(
      <AddPostModalForm
        {...defaultProps}
        onFormDataChange={onFormDataChange}
      />,
    );

    expect(onFormDataChange).toHaveBeenCalledWith({
      content: 'New content',
      previewItems: [{ url: 'image1.jpg' }],
    });
  });

  it('should pass isSubmitting state to AddTweetButton', () => {
    mockUsePostForm.isSubmitting = true;

    render(<AddPostModalForm {...defaultProps} />);

    const button = screen.getByTestId('add-tweet-button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle image removal', () => {
    render(<AddPostModalForm {...defaultProps} />);

    const removeButton = screen.getByTestId('remove-image');
    fireEvent.click(removeButton);

    expect(mockUsePostForm.removeImage).toHaveBeenCalledWith(0);
  });

  it('should pass previewItems to PostImageUploader', () => {
    mockUsePostForm.previewItems = [
      { url: 'image1.jpg' },
      { url: 'image2.jpg' },
    ] as never;

    render(<AddPostModalForm {...defaultProps} />);

    expect(screen.getByTestId('preview-count')).toHaveTextContent('2');
  });

  it('should work without optional props', () => {
    render(<AddPostModalForm userId='user-123' />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
