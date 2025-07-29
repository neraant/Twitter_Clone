import { fireEvent, render, screen } from '@testing-library/react';

import { ExploreInput } from '../ExploreInput';

jest.mock('../../lib', () => ({
  SEARCH_PLACEHOLDER: 'Search...',
}));

jest.mock('@/shared/ui/input/Input', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/shared/ui/icon', () => ({
  CrossIcon: () => <div />,
}));

describe('ExploreInput', () => {
  const mockOnQueryChange = jest.fn();

  const renderComponent = (query = '') =>
    render(<ExploreInput query={query} onQueryChange={mockOnQueryChange} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with placeholder', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('sets input value from props', () => {
    renderComponent('initial query');

    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.value).toBe('initial query');
  });

  it('calls onQueryChange when input changes', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnQueryChange).toHaveBeenCalledWith('new value');
    expect(input).toHaveValue('new value');
  });

  it('renders clear button when query is not empty', () => {
    renderComponent('something');

    const clearButton = screen.getByRole('button', { name: 'clear query' });
    expect(clearButton).toBeInTheDocument();
  });

  it('does not render clear button when query is empty', () => {
    renderComponent('');

    const clearButton = screen.queryByRole('button', { name: 'clear query' });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears input and calls onQueryChange when clear button is clicked', () => {
    renderComponent('abc');

    const clearButton = screen.getByRole('button', { name: 'clear query' });
    fireEvent.click(clearButton);

    expect(mockOnQueryChange).toHaveBeenCalledWith('');
  });
});
