import { useSWRConfig } from 'swr';

export const useGetAllPostsKeys = () => {
  const { cache } = useSWRConfig();

  const getAllPostsKeys = () => {
    const keys = Array.from(cache.keys());
    return keys.filter(
      (key) => typeof key === 'string' && key.startsWith('posts-'),
    );
  };

  return getAllPostsKeys;
};
