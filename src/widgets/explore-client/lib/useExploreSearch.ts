'use client';

import { useState } from 'react';

import { Post } from '@/entities/post';
import { User } from '@/entities/user';
import { searchUsers } from '@/entities/user/api/searchUsers';
import { searchPosts } from '@/features/search-posts/api/searchPosts';

import { searchType } from './exploreClient.type';

export function useExploreSearch() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async (type: searchType, query: string) => {
    if (query.trim() === '') {
      setPosts([]);
      setUsers([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      if (type === searchType.posts) {
        const fetched = await searchPosts(query);
        setPosts(fetched);
      } else {
        const fetched = await searchUsers(query);
        setUsers(fetched);
      }
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, users, isLoading, hasSearched, setIsLoading, search };
}
