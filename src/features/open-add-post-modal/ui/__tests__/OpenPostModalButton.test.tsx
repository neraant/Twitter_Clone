import { fireEvent, render, screen } from '@testing-library/react';

import { OpenPostModalButton } from '../OpenPostModalButton';

jest.mock('@/widgets/add-post-modal', () => ({
  AddPostModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid='add-post-modal'>
      Modal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

jest.mock('@/shared/lib/hooks', () => ({
  useLockBodyScroll: jest.fn(),
}));

jest.mock('@/shared/ui/icon', () => ({
  PlusIcon: () => <div>Icon</div>,
}));

import { useLockBodyScroll } from '@/shared/lib/hooks';

describe('OpenPostModalButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text and icon', () => {
    render(<OpenPostModalButton />);
    expect(
      screen.getByRole('button', { name: /add tweet/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/new tweet/i)).toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    render(<OpenPostModalButton />);
    const button = screen.getByRole('button', { name: /add tweet/i });

    fireEvent.click(button);

    expect(screen.getByTestId('add-post-modal')).toBeInTheDocument();
    expect(useLockBodyScroll).toHaveBeenLastCalledWith(true);
  });

  it('closes modal when modal close button is clicked', () => {
    render(<OpenPostModalButton />);
    const button = screen.getByRole('button', { name: /add tweet/i });

    fireEvent.click(button);
    expect(screen.getByTestId('add-post-modal')).toBeInTheDocument();

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('add-post-modal')).not.toBeInTheDocument();

    expect(useLockBodyScroll).toHaveBeenLastCalledWith(false);
  });

  it('calls useLockBodyScroll with correct values on open and close', () => {
    const { rerender } = render(<OpenPostModalButton />);

    expect(useLockBodyScroll).toHaveBeenCalledWith(false);

    const button = screen.getByRole('button', { name: /add tweet/i });
    fireEvent.click(button);

    expect(useLockBodyScroll).toHaveBeenLastCalledWith(true);

    rerender(<OpenPostModalButton />);

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);

    expect(useLockBodyScroll).toHaveBeenLastCalledWith(false);
  });
});
