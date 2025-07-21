'use client';

import { PostSearchCard } from '@/entities/post/ui/PostSearchCard';
import { UserSmallCardSkeleton } from '@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton';
import { PostSearchInput } from '@/features/search-posts';
import { useSearchPostsStore } from '@/features/search-posts/model';

import { NO_RESULTS_TITLE, SKELETON_COUNT } from '../lib';
import { Gallery } from './Gallery';
import styles from './SearchedPosts.module.scss';

const DefaultAvatar = '/images/user-avatar.webp';

export const SearchedPosts = () => {
  const isLoading = useSearchPostsStore((state) => state.isLoading);
  const posts = useSearchPostsStore((state) => state.results);
  const query = useSearchPostsStore((state) => state.query);
  const hasSearched = useSearchPostsStore((state) => state.hasSearched);

  const isQueryEmpty = query.trim() === '';

  const showSkeletons = isLoading && !isQueryEmpty;

  const showNoResults =
    hasSearched && !isLoading && posts.length === 0 && !isQueryEmpty;

  const showResults = !isLoading && posts.length > 0 && !isQueryEmpty;

  const showGallery = isQueryEmpty && !isLoading;

  return (
    <>
      <PostSearchInput />

      <div className={styles.wrapper}>
        {showGallery && <Gallery />}

        <div className={styles.postsWrapper}>
          {showSkeletons &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <UserSmallCardSkeleton key={i} className={styles.postSkeleton} />
            ))}

          {showNoResults && (
            <span className={styles.noResults}>{NO_RESULTS_TITLE}</span>
          )}

          {showResults &&
            posts.map(({ id, content, author_avatar, author_name }) => (
              <PostSearchCard
                key={id}
                content={content!}
                name={author_name!}
                avatar={author_avatar ?? DefaultAvatar}
                postId={id!}
              />
            ))}
        </div>
      </div>
    </>
  );
};
