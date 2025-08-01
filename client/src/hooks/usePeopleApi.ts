import { getSearchedUsers, getSuggestedUsers } from '@/api/people';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useSuggestedPeople = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SUGGESTED_USERS, limit],
    queryFn: ({ pageParam }) => getSuggestedUsers(pageParam || 1, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useSearchedPeople = (
  que: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SEARCHED_USERS, que, page, limit],
    queryFn: ({pageParam = 1}) => getSearchedUsers({ que, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
        if(lastPage.currentPage < lastPage.totalPages){
           return lastPage.currentPage + 1; 
        }
        return undefined;
    },
    initialPageParam: 1,
    enabled: !!que,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
