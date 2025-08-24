import { useInView } from 'react-intersection-observer';
import { useGetRecentPosts } from '@/hooks/usePostApis';
import { Loader, LoaderCircle, Sparkles, TrendingUp } from 'lucide-react';
import React, { useEffect } from 'react';
import { Post } from '@/types';
import PostCard from '@/components/shared/PostCard';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostLoading,
    error,
  } = useGetRecentPosts();

  const { ref, inView } = useInView();
  const { user } = useAuth();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPostLoading && !data) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LoaderCircle size={50} className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex-center w-full h-full text-red-500">
        <p>Error loading posts: {error.message}</p>
      </div>
    );
  }
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
  if (allPosts.length === 0) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-gray-500">No posts available.</p>
      </div>
    );
  }
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  };
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10  py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
           <div className="mb-8">
          <div className="bg-dark-4 rounded-2xl p-6 border border-[#CD7F32]/20">
            <div className="flex items-center gap-3 mb-2 justify-center">
              <Sparkles className="w-6 h-6 text-[#CD7F32]" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {greetings[timeOfDay]}, {user?.name?.split(' ')[0] || 'Friend'}!
              </h1>
            </div>
            <p className="text-gray-300 text-base text-center leading-relaxed">
              Discover inspiring posts from your community and stay connected with like-minded people.
            </p>
          </div>
        </div>

        {/* Feed Stats */}
        <div className="flex items-center gap-6 mb-6 px-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4 text-[#CD7F32]" />
            <span>{allPosts.length} posts loaded</span>
          </div>
          {hasNextPage && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>More content available</span>
            </div>
          )}
        </div>
          <ul className="flex flex-col gap-9">
            {data!.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.posts.map((post: Post, postIndex: number) => {
                  const isLastPost =
                    pageIndex === data!.pages.length - 1 &&
                    postIndex === page.posts.length - 1;
                  return (
                    <div ref={isLastPost ? ref : undefined} key={post._id}>
                      <PostCard post={post} mode="preview" />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
          {hasNextPage && isFetchingNextPage && (
            <div className="flex-center w-full mt-4">
              <Loader size={30} className="animate-spin" />
              <p className="ml-2">Loading more posts...</p>
            </div>
          )}
          {!hasNextPage && allPosts.length > 0 && !isFetchingNextPage && (
            <div className="flex-center w-full mt-4 text-gray-500">
              <p>You've reached the end of the feed!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
