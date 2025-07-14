'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { Post } from '@/entities/post';
import { PostSearchCard } from '@/entities/post/ui/PostSearchCard';
import { UserSmallCardSkeleton } from '@/entities/user';
import { searchPosts } from '@/features/search-posts/api/searchPosts';

import { EXPLORE_TITLE, NO_RESULTS_TITLE, SKELETON_COUNT } from '../lib';
import styles from './ExploreClient.ts.module.scss';
import { ExploreInput } from './ExploreInput';

const DefaultAvatar = '/images/user-avatar.png';
const EmptyStateImage = '/images/empty-state_icon.svg';
const ExploreStateImage = '/images/explore-state_icon.svg';

export const ExploreClient = () => {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setPosts([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPosts(searchQuery);
      setPosts(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isQueryEmpty = query.trim() === '';
  const showSkeletons = isLoading && !isQueryEmpty;
  const showNoResults =
    hasSearched && !isLoading && posts.length === 0 && !isQueryEmpty;
  const showResults = !isLoading && posts.length > 0 && !isQueryEmpty;

  return (
    <section className={styles.wrapper}>
      <ExploreInput
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onLoadingChange={setIsLoading}
      />

      {(isQueryEmpty || showNoResults) && (
        <div className={styles.statesWrapper}>
          {isQueryEmpty && (
            <div className={styles.emptyWrapper}>
              <Image
                src={ExploreStateImage}
                alt='Search tweets'
                width={320}
                height={320}
                className={styles.exploreImage}
                priority
              />
              <span className={styles.noResults}>{EXPLORE_TITLE}</span>
            </div>
          )}

          {showNoResults && (
            <div className={styles.emptyWrapper}>
              <Image
                src={EmptyStateImage}
                alt='The list is empty'
                width={320}
                height={320}
                className={styles.emptyImage}
              />
              <span className={styles.noResults}>{NO_RESULTS_TITLE}</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.postsWrapper}>
        {showSkeletons &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <UserSmallCardSkeleton key={i} className={styles.postSkeleton} />
          ))}

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
    </section>
  );
};
