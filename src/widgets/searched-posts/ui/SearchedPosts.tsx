'use client';

import { PostSearchCard } from '@/entities/post/ui/PostSearchCard';
import { UserSmallCardSkeleton } from '@/entities/user/ui/UserSmallCard/UserSmallCardSkeleton';
import { PostSearchInput } from '@/features/search-posts';
import { useSearchPostsStore } from '@/features/search-posts/model';

import { NO_RESULTS_TITLE, SKELETON_COUNT } from '../lib';
import { Gallery } from './Gallery';
import styles from './SearchedPosts.module.scss';

const DefaultAvatar = '/images/user-avatar.png';

export const SearchedPosts = () => {
  const isLoading = useSearchPostsStore((state) => state.isLoading);
  const posts = useSearchPostsStore((state) => state.results);
  const query = useSearchPostsStore((state) => state.query);

  const isQueryEmpty = query.trim() === '';

  return (
    <>
      <PostSearchInput />

      <div className={styles.wrapper}>
        {isQueryEmpty && <Gallery />}

        <div className={styles.postsWrapper}>
          {!isQueryEmpty && (
            <>
              {isLoading ? (
                Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <UserSmallCardSkeleton
                    key={i}
                    className={styles.postSkeleton}
                  />
                ))
              ) : posts.length === 0 ? (
                <span className={styles.noResults}>{NO_RESULTS_TITLE}</span>
              ) : (
                posts.map(({ id, content, author_avatar, author_name }) => (
                  <PostSearchCard
                    key={id}
                    content={content!}
                    name={author_name!}
                    avatar={author_avatar ?? DefaultAvatar}
                    href={`post/${id}`}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
