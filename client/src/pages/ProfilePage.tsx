// src/pages/ProfilePage.tsx
import { useParams } from 'react-router-dom';
import { useGetUserPosts } from '@/hooks/useProfileApi';
import PostCard from '@/components/shared/PostCard';
import ProfileCard from '@/components/shared/ProfileCard';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { id: userId } = useParams<{ id: string }>();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useGetUserPosts(userId!);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const totalPosts = data?.pages[0]?.pagination.totalPosts ?? 0;

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 py-10">Failed to load posts</p>
    );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <ProfileCard totalPosts={totalPosts} />

      <div className="mt-12 ">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Posts
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} mode={'details'} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No posts found</p>
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-10">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
