import { fireEvent, render, screen } from '@testing-library/react';

import { EditProfileButton } from '../EditProfileButton';

jest.mock('../../lib', () => ({
  EDIT_BUTTON: 'Edit Profile',
}));

describe('EditProfileButton', () => {
  it('should render button with correct text', () => {
    render(<EditProfileButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Edit Profile');
  });

  it('should have correct button type', () => {
    render(<EditProfileButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<EditProfileButton onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should work without onClick prop', () => {
    render(<EditProfileButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it('should not throw error when onClick is undefined', () => {
    expect(() => {
      render(<EditProfileButton onClick={undefined} />);
    }).not.toThrow();
  });
});
