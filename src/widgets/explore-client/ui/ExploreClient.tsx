'use client';

import Image from 'next/image';
import { useState } from 'react';

import { UserSmallCardSkeleton } from '@/entities/user';

import {
  EXPLORE_TITLE,
  NO_RESULTS_TITLE,
  searchType,
  SKELETON_COUNT,
  useExploreSearch,
} from '../lib';
import styles from './ExploreClient.module.scss';
import { ExploreInput } from './ExploreInput';
import { ExplorePosts } from './ExplorePosts';
import { ExploreTabs } from './ExploreTabs';
import { ExploreUsers } from './ExploreUsers';

const EmptyStateImage = '/images/empty-state_icon.svg';
const ExploreStateImage = '/images/explore-state_icon.svg';

export const ExploreClient = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState('');
  const { posts, users, isLoading, hasSearched, setIsLoading, search } =
    useExploreSearch();

  const handleTabSelect = (index: number) => {
    setActiveTab(index);

    if (query.trim() !== '') {
      const type = index === 0 ? searchType.posts : searchType.users;
      search(type, query);
    }
  };

  const handleSearch = (query: string) => {
    const type = activeTab === 0 ? searchType.posts : searchType.users;
    search(type, query);
  };

  const isQueryEmpty = query.trim() === '';

  const currentItemsCount = activeTab === 0 ? posts.length : users.length;
  const showSkeletons = isLoading && !isQueryEmpty;
  const showNoResults =
    hasSearched && !isLoading && currentItemsCount === 0 && !isQueryEmpty;
  const showResults = !isLoading && currentItemsCount > 0 && !isQueryEmpty;

  const tabContent = [
    <ExplorePosts posts={posts} key='posts' />,
    <ExploreUsers users={users} key='users' />,
  ];

  return (
    <section className={styles.wrapper}>
      <ExploreInput
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onLoadingChange={setIsLoading}
      />

      <ExploreTabs activeTab={activeTab} onTabSelect={handleTabSelect} />

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

        {showResults && tabContent[activeTab]}
      </div>
    </section>
  );
};
