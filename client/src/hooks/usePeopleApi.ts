import { getSearchedUsers, getSuggestedUsers } from "@/api/people"
import { QUERY_KEYS } from "@/constants/queryKeys"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useSuggestedPeople = (page: number=1, limit: number=10) => {
   return useInfiniteQuery({
     queryKey: [QUERY_KEYS.GET_SUGGESTED_USERS, page, limit],
     queryFn: ({pageParam}) => getSuggestedUsers(pageParam || 1, limit),
     getNextPageParam: (lastPage) => {
        if(lastPage.currentPage<lastPage.totalPage){
        return lastPage.currentPage+1;
        }
        return undefined;
     },
     retry: 2,
     staleTime: 5 * 60 * 1000, 
     placeholderData: (previousData) => previousData,
     initialPageParam: 1,
    })
}

export const useSearchedPeople = (que: string, page: number=1, limit: number=10) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SEARCHED_USERS, que, page, limit],
        queryFn: () => getSearchedUsers({que, page, limit}),
        enabled: !!que,
        retry: 2,
        staleTime: 5 * 60 * 1000, 
        placeholderData: (previousData) => previousData,
    })
}