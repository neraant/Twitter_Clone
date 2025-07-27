import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';

import { useDeletePost } from '../../lib';
import { ManagePost } from '../ManagePost';

jest.mock('next/navigation');
jest.mock('../../lib/useDeletePost');
jest.mock('@/shared/lib/hooks', () => ({
  useClickOutside: jest.fn(),
  useLockBodyScroll: jest.fn(),
}));

jest.mock('@/shared/ui/confirm-modal', () => ({
  ConfirmModal: ({ title, onConfirm, onClose }: never) => (
    <div data-testid='confirm-modal'>
      <h2>{title}</h2>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ),
}));

jest.mock('@/shared/ui/icon', () => ({
  DotsIcon: ({ width, height }: { width: number; height: number }) => (
    <div data-testid='dots-icon' style={{ width, height }}>
      Dots
    </div>
  ),
}));

jest.mock('../../lib', () => ({
  DELETE_ACTION: 'delete',
  MANAGE_ACTIONS: [
    {
      label: 'Delete',
      icon: <span>🗑️</span>,
      className: 'delete-action',
      action: 'delete',
    },
  ],
  useDeletePost: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseDeletePost = useDeletePost as jest.MockedFunction<
  typeof useDeletePost
>;

describe('ManagePost', () => {
  const mockRouter = {
    back: jest.fn(),
    push: jest.fn(),
  };
  const mockDeleteHandler = jest.fn();

  const defaultProps = {
    postId: 'post-123',
    currentUserId: 'user-456',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as never);
    mockUsePathname.mockReturnValue('/app/home');
    mockUseDeletePost.mockReturnValue(mockDeleteHandler);
  });

  it('should render manage button', () => {
    render(<ManagePost {...defaultProps} />);

    expect(screen.getByLabelText('manage post')).toBeInTheDocument();
    expect(screen.getByTestId('dots-icon')).toBeInTheDocument();
  });

  it('should open manage modal when button is clicked', () => {
    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });

  it('should close manage modal when button is clicked again', () => {
    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));
    expect(screen.getByText('Delete')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('manage post'));
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should open confirm modal when delete action is clicked', () => {
    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));

    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(screen.getByText('Delete post')).toBeInTheDocument();
  });

  it('should close confirm modal when cancel is clicked', () => {
    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));
    fireEvent.click(screen.getByText('Delete'));

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('should call delete handler when confirm is clicked', async () => {
    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));
    fireEvent.click(screen.getByText('Delete'));

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockDeleteHandler).toHaveBeenCalled();
    });
  });

  it('should not navigate back when deleting post from other pages', () => {
    mockUsePathname.mockReturnValue('/app/home');

    render(<ManagePost {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('manage post'));
    fireEvent.click(screen.getByText('Delete'));

    fireEvent.click(screen.getByText('Confirm'));

    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ManagePost {...defaultProps} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should call useDeletePost with correct parameters', () => {
    render(<ManagePost {...defaultProps} />);

    expect(mockUseDeletePost).toHaveBeenCalledWith(
      'post-123',
      'user-456',
      expect.any(Function),
    );
  });
});
