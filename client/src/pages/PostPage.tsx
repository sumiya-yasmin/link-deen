import PostCard from '@/components/shared/PostCard';
import { useGetPostById } from '@/hooks/usePostApis';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <p>Invalid post ID</p>;
  const { data: post, isPending, error } = useGetPostById(id);
  if (isPending) return <p className="text-light-3">Loading post...</p>;
  if (error) return <p className="text-red-500">Error loading post</p>;
  if (!post) return <p className="text-yellow-500">Post not found</p>;
  return (
    <section className="flex justify-center items-center px-4 md:px-6 py-6 w-full">
      <PostCard post={post} mode="details"/>
    </section>
  );
};

export default PostPage;
