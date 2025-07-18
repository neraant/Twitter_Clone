'use client';

import { User } from '@/entities/user';
import { AddPostForm } from '@/widgets/add-post-form/ui/AddPostForm';
import { PostsList } from '@/widgets/posts-list';

import { HomeHeader } from './HomeHeader';

export const HomeClient = ({ currentUser }: { currentUser: User }) => {
  return (
    <>
      <HomeHeader />

      <section>
        <AddPostForm user={currentUser} />
      </section>

      <section>
        <PostsList userId='global' currentUserId={currentUser.id} />
      </section>
    </>
  );
};
