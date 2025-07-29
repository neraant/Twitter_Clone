import { Post } from '@/entities/post';
import { searchUsers } from '@/entities/user/api/searchUsers';
import { searchPosts } from '@/features/search-posts/api/searchPosts';

import { searchType } from '../lib';
import styles from './ExploreClient.module.scss';
import { ExploreClientProvider } from './ExploreClientProvider';

type ExploreClientProps = {
  query?: string;
  tab?: searchType;
};

export const ExploreClient = async ({
  query,
  tab = searchType.posts,
}: ExploreClientProps) => {
  const formattedQuery = query?.trim() ?? '';

  const posts =
    tab === searchType.posts && formattedQuery
      ? ((await searchPosts(formattedQuery)) as Post[])
      : ([] as Post[]);

  const users =
    tab === searchType.users && formattedQuery
      ? await searchUsers(formattedQuery)
      : [];

  return (
    <section className={styles.wrapper}>
      <ExploreClientProvider initialPosts={posts} initialUsers={users} />
    </section>
  );
};
