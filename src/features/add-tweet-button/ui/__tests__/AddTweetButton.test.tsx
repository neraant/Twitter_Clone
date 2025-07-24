import { render, screen } from '@testing-library/react';

import { TWEET_BUTTON } from '../../lib';
import { AddTweetButton } from '../AddTweetButton';

jest.mock('@/shared/ui/loader', () => ({
  Loader: () => <div data-testid='loader' />,
}));

describe('AddTweetButton', () => {
  it('renders button with tweet text', () => {
    render(<AddTweetButton />);
    expect(screen.getByRole('button')).toHaveTextContent(TWEET_BUTTON);
  });

  it('shows loader when isLoading is true', () => {
    render(<AddTweetButton isLoading={true} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('does not show loader when isLoading is false', () => {
    render(<AddTweetButton isLoading={false} />);
    expect(screen.queryByTestId('loader')).toBeNull();
  });

  it('has type submit and correct aria-label', () => {
    render(<AddTweetButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'add tweet');
  });
});
