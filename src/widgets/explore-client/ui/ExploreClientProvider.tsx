'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Post } from '@/entities/post';
import { User, UserSmallCardSkeleton } from '@/entities/user';

import {
  EXPLORE_TITLE,
  NO_RESULTS_TITLE,
  searchType,
  SKELETON_COUNT,
} from '../lib';
import styles from './ExploreClient.module.scss';
import { ExploreInput } from './ExploreInput';
import { ExplorePosts } from './ExplorePosts';
import { ExploreTabs } from './ExploreTabs';
import { ExploreUsers } from './ExploreUsers';

type ExploreClientProviderProps = {
  initialPosts: Post[];
  initialUsers: User[];
};

const EmptyStateImage = '/images/empty-state_icon.svg';
const ExploreStateImage = '/images/explore-state_icon.svg';

export const ExploreClientProvider = ({
  initialPosts,
  initialUsers,
}: ExploreClientProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const query = searchParams.get('query') ?? '';
  const tabParam = searchParams.get('tab');
  const initialTab =
    tabParam === searchType.users ? searchType.users : searchType.posts;

  const [tab, setTab] = useState<searchType>(initialTab);

  const posts = useMemo(
    () => (tab === searchType.posts ? initialPosts : []),
    [tab, initialPosts],
  );

  const users = useMemo(
    () => (tab === searchType.users ? initialUsers : []),
    [tab, initialUsers],
  );

  useEffect(() => {
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleTabSelect = (index: number) => {
    const nextTab = index === 0 ? searchType.posts : searchType.users;

    setTab(nextTab);

    const params = new URLSearchParams(searchParams);
    if (query) params.set('query', query);
    params.set('tab', nextTab);

    setLoading(true);
    router.push(`/explore?${params.toString()}`);
  };

  const handleQueryChange = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set('query', q);
    params.set('tab', tab);

    setLoading(true);
    router.push(`/explore?${params.toString()}`);
  };

  const isQueryEmpty = query.trim() === '';
  const currentItemsCount =
    tab === searchType.posts ? posts.length : users.length;
  const showNoResults = !isQueryEmpty && currentItemsCount === 0;
  const showResults = !isQueryEmpty && !loading && currentItemsCount > 0;

  const tabContent = [
    <ExplorePosts posts={posts} key={searchType.posts} />,
    <ExploreUsers users={users} key={searchType.users} />,
  ];

  return (
    <>
      <ExploreInput query={query} onQueryChange={handleQueryChange} />

      <ExploreTabs
        activeTab={tab === searchType.posts ? 0 : 1}
        onTabSelect={handleTabSelect}
      />

      {!loading && (isQueryEmpty || showNoResults) && (
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
        {loading &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <UserSmallCardSkeleton key={i} className={styles.postSkeleton} />
          ))}

        {showResults && tabContent[tab === searchType.posts ? 0 : 1]}
      </div>
    </>
  );
};
