import PostCard from '@/components/shared/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetPopularPosts, useSearchPosts } from '@/hooks/usePostApis';
import { useState } from 'react';

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>(
    'today'
  );

  const {
    data,
    isPending: loadingPopular,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPopularPosts(timeframe);

  const {
    data: searchData,
    fetchNextPage: fetchSearchNext,
    hasNextPage: hasMoreSearch,
    isFetchingNextPage: fetchingSearch,
    isPending: loadingSearch,
  } = useSearchPosts(searchText);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const searchedPosts = searchData?.pages.flatMap((page) => page.posts) ?? [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchText(query.trim());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">Explore</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full"
        />
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </form>
      <div className="space-y-6">
        {searchText ? (
          <>
            <h2 className="text-xl font-semibold">
              Search results for "{searchText}"
            </h2>
            {loadingSearch ? (
              <p className="text-center">Searching...</p>
            ) : searchedPosts.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {searchedPosts.map((post) =>
                    post?._id ? (
                      <PostCard key={post._id} post={post} mode="minimal" />
                    ) : null
                  )}
                </div>
                {hasMoreSearch && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => fetchSearchNext()}
                      disabled={fetchingSearch}
                    >
                      {fetchingSearch ? 'Loading more...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>No posts found.</p>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-center">
                {timeframe === 'today'
                  ? `Popular ${timeframe}`
                  : `Popular this ${timeframe}`}
              </h2>
              <div className="flex justify-end">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="border rounded-md px-3 py-2 text-sm bg-dark-4"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {loadingPopular ? (
              <p className="text-center">Loading...</p>
            ) : posts.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} mode="minimal" />
                  ))}
                </div>
                {hasNextPage && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>No popular posts found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
