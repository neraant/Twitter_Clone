import { fireEvent, render, screen } from '@testing-library/react';

import { ExploreTabs } from '../ExploreTabs';

jest.mock('../../lib', () => ({
  TAB_LABELS: ['Posts', 'Users'],
}));

describe('ExploreTabs', () => {
  const mockProps = {
    activeTab: 0,
    onTabSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs', () => {
    render(<ExploreTabs {...mockProps} />);

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('applies active class to active tab', () => {
    render(<ExploreTabs {...mockProps} activeTab={1} />);

    const usersTab = screen.getByText('Users');
    expect(usersTab).toHaveClass('active');
  });

  it('calls onTabSelect when tab is clicked', () => {
    render(<ExploreTabs {...mockProps} />);

    const usersTab = screen.getByText('Users');
    fireEvent.click(usersTab);

    expect(mockProps.onTabSelect).toHaveBeenCalledWith(1);
  });

  it('positions indicator line correctly', () => {
    render(<ExploreTabs {...mockProps} activeTab={1} />);

    const indicator = screen.getByTestId('indicator-line');
    expect(indicator).toHaveStyle('transform: translateX(100%)');
  });
});
