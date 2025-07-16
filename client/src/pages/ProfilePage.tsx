import { useParams } from 'react-router-dom';
import { useGetUserPosts } from '@/hooks/useProfileApi';
import PostCard from '@/components/shared/PostCard';
import ProfileCard from '@/components/shared/ProfileCard';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

  const [filter, setFilter] = useState<'all' | 'post' | 'hikmah'>('all');

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const filteredPosts =
    filter === 'all' ? posts : posts.filter((post) => post.type === filter);

  const totalPosts = data?.pages[0]?.pagination.totalPosts ?? 0;
  const postCount = posts.filter((p) => p.type === 'post').length;
  const hikmahCount = posts.filter((p) => p.type === 'hikmah').length;

  const filterLabel = {
    all: 'All Contents',
    post: 'Posts',
    hikmah: 'Hikmahs',
  }[filter];

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 py-10">Failed to load posts</p>
    );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <ProfileCard
        totalPosts={totalPosts}
        postCount={postCount}
        hikmahCount={hikmahCount}
      />

      <div className="mt-12 ">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2">
            {filterLabel}
          </h2>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as 'all' | 'post' | 'hikmah')
            }
            className="border rounded-md px-2 py-2 text-sm"
          >
            <option value="all" className="bg-gray-800">
              All
            </option>
            <option value="post" className="bg-gray-800">
              Post
            </option>
            <option value="hikmah" className="bg-gray-800">
              Hikmah
            </option>
          </select>
        </div>
        <hr className="mb-6" />

        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
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
