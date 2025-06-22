// src/pages/ProfilePage.tsx
import { useParams } from "react-router-dom";
import { useGetUserPosts } from "@/hooks/useProfileApi";
import PostCard from "@/components/shared/PostCard";
import ProfileCard from "@/components/shared/ProfileCard";
import { Button } from "@/components/ui/button";

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
  const totalPosts=data?.pages[0]?.pagination.totalPosts??0;

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center text-red-500 py-10">Failed to load posts</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
    
      <ProfileCard totalPosts={totalPosts}/>

    
      <div className="mt-10 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-gray-500">No posts found</p>
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

