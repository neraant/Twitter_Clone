import { fireEvent, render, screen } from '@testing-library/react';
import { act, ChangeEvent } from 'react';

import { useSearchPostsStore } from '../../model';
import { PostSearchInput } from '../PostSearchInput';

type InputProps = {
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
};

jest.mock('@/shared/ui/input/Input', () => ({
  Input: ({ value = '', ...props }: InputProps) => (
    <input {...props} value={value} data-testid='search-input' type='text' />
  ),
}));

const mockSearch = jest.fn();
const mockSetQuery = jest.fn();
const mockSetLoading = jest.fn();

jest.mock('../../model', () => ({
  useSearchPostsStore: jest.fn(),
}));

const mockUseSearchPostsStore = useSearchPostsStore as jest.MockedFunction<
  typeof useSearchPostsStore
>;

describe('PostSearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        query: '',
        search: mockSearch,
        setQuery: mockSetQuery,
        setLoading: mockSetLoading,
        isLoading: false,
        hasSearched: false,
        results: [],
        error: null,
      };
      return selector(state);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders input with correct placeholder', () => {
    render(<PostSearchInput />);
    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder');
  });

  it('displays current query value', () => {
    mockUseSearchPostsStore.mockImplementation((selector) => {
      const state = {
        query: 'test query',
        search: mockSearch,
        setQuery: mockSetQuery,
        setLoading: mockSetLoading,
        isLoading: false,
        hasSearched: false,
        results: [],
        error: null,
      };
      return selector(state);
    });

    render(<PostSearchInput />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test query');
  });

  it('updates query on input change', () => {
    render(<PostSearchInput />);
    const input = screen.getByTestId('search-input');

    act(() => {
      fireEvent.change(input, { target: { value: 'new search' } });
    });

    expect(mockSetQuery).toHaveBeenCalledWith('new search');
  });

  it('handles empty input correctly', () => {
    render(<PostSearchInput />);
    const input = screen.getByTestId('search-input');

    act(() => {
      fireEvent.change(input, { target: { value: '' } });
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockSearch).not.toHaveBeenCalled();
    expect(mockSetLoading).not.toHaveBeenCalled();
  });
});
