import { Post } from '@/entities/post';
import { PostSearchCard } from '@/entities/post/ui/PostSearchCard';

const DefaultAvatar = '/images/user-avatar.webp';

export const ExplorePosts = ({ posts }: { posts: Post[] }) => {
  return posts.map(({ id, content, author_avatar, author_name }) => (
    <PostSearchCard
      key={id}
      content={content!}
      name={author_name!}
      avatar={author_avatar ?? DefaultAvatar}
      postId={id!}
    />
  ));
};
