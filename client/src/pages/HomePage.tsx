import { useInView } from 'react-intersection-observer';
import { useGetRecentPosts } from '@/hooks/usePostApis';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { Post } from '@/types';

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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPostLoading && !data) {
    return (
      <div className="flex-center w-full h-full">
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

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10  py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className=" text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter text-left w-full">
            Home Feed
          </h2>
          <ul className="flex flex-col">
            {data!.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.posts.map((post: Post, postIndex: number) => {
                  const isLastPost =
                    pageIndex === data!.pages.length - 1 &&
                    postIndex === page.posts.length - 1;
                  return <div></div>;
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
