import { act, fireEvent, render, screen } from '@testing-library/react';

import { usePostsDebounce } from '@/features/search-posts/lib';

import { ExploreInput } from '../ExploreInput';

jest.mock('@/features/search-posts/lib', () => ({
  usePostsDebounce: jest.fn(),
}));

jest.mock('@/shared/ui/input/Input', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Input: (props: any) => <input data-testid='input' {...props} />,
}));

jest.mock('@/shared/ui/icon', () => ({
  CrossIcon: () => <span data-testid='cross-icon'>×</span>,
}));

const mockUsePostsDebounce = usePostsDebounce as jest.MockedFunction<
  typeof usePostsDebounce
>;

describe('ExploreInput', () => {
  const mockProps = {
    onQueryChange: jest.fn(),
    onSearch: jest.fn(),
    onLoadingChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsDebounce.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ fetch, value, setLoading }: any) => {
        if (value.trim()) {
          setLoading(true);
          setTimeout(() => fetch(), 300);
        }
      },
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls onQueryChange when input changes', () => {
    render(<ExploreInput {...mockProps} />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockProps.onQueryChange).toHaveBeenCalledWith('test');
  });

  it('shows clear button when query is not empty', () => {
    render(<ExploreInput {...mockProps} />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTestId('cross-icon')).toBeInTheDocument();
  });

  it('clears query when clear button is clicked', () => {
    render(<ExploreInput {...mockProps} />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(mockProps.onQueryChange).toHaveBeenCalledWith('');
    expect(input).toHaveValue('');
  });

  it('triggers debounced search', () => {
    render(<ExploreInput {...mockProps} />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockProps.onSearch).toHaveBeenCalledWith('test');
  });
});
