export const LoadMoreButton = ({ 
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage,
  isLoading 
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
}) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={fetchNextPage}
        disabled={isFetchingNextPage || isLoading}
        className="px-6 py-3 bg-dark-4 text-white rounded-lg hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
      >
        {isFetchingNextPage ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
};


export const LoadingSkeleton = () => (
  <div className="p-4 rounded-lg bg-zinc-800 shadow animate-pulse">
    <div className="flex gap-4 items-center">
      <div className="h-16 w-16 bg-gray-600 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-600 rounded w-24"></div>
        <div className="h-3 bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  </div>
);