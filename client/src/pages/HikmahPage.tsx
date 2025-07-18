import { useInView } from 'react-intersection-observer';
import { useGetRecentPosts } from '@/hooks/usePostApis';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { Post } from '@/types';
import PostCard from '@/components/shared/PostCard';

const HikmahPage = () => {
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

  const allHikmahs: Post[] =
    data?.pages.flatMap((page) =>
      page.posts.filter((post: Post) => post.type === 'hikmah')
    ) || [];

  if (allHikmahs.length === 0) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-gray-500">No Hikmah available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9">
          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter text-left w-full">
            Hikmah Board ✨
          </h2>
          <ul className="flex flex-col gap-9">
            {data!.pages.map((page, pageIndex) => {
              const hikmahs = page.posts.filter((post) => post.type === 'hikmah');
              return (
                <React.Fragment key={pageIndex}>
                  {hikmahs.map((post: Post, postIndex: number) => {
                    const isLastPost =
                      pageIndex === data!.pages.length - 1 &&
                      postIndex === hikmahs.length - 1;
                    return (
                      <div ref={isLastPost ? ref : undefined} key={post._id}>
                        <PostCard post={post} mode="preview" />
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </ul>
          {hasNextPage && isFetchingNextPage && (
            <div className="flex-center w-full mt-4">
              <Loader size={30} className="animate-spin" />
              <p className="ml-2">Loading more hikmah...</p>
            </div>
          )}
          {!hasNextPage && allHikmahs.length > 0 && !isFetchingNextPage && (
            <div className="flex-center w-full mt-4 text-gray-500">
              <p>You've reached the end of the Hikmah Board.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HikmahPage;
