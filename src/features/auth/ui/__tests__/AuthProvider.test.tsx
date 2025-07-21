import { render, screen } from '@testing-library/react';

import { useAuthStore } from '@/features/auth/model';

import { AuthProvider } from '../AuthProvider';

jest.mock('@/features/auth/model', () => ({
  useAuthStore: jest.fn(),
}));

describe('<AuthProvider />: ', () => {
  it('should calls initialize on first render and renders children', () => {
    const mockInitialize = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ initialize: mockInitialize }),
    );

    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    expect(mockInitialize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
