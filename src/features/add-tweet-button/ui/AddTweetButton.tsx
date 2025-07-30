import { Button } from '@/shared/ui/button/Button';
import { Loader } from '@/shared/ui/loader';

import { TWEET_BUTTON } from '../lib';
import styles from './AddTweetButton.module.scss';

type AddTweetButtonProps = {
  isLoading?: boolean;
};

export const AddTweetButton = ({ isLoading }: AddTweetButtonProps) => {
  return (
    <Button
      ariaLabel='add tweet'
      type='submit'
      className={styles.tweetButton}
      data-testid='add-post-button'
    >
      {TWEET_BUTTON}
      {isLoading && <Loader size='16px' />}
    </Button>
  );
};
