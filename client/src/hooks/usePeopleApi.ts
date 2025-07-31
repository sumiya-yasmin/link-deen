import { getSearchedUsers, getSuggestedUsers } from "@/api/people"
import { QUERY_KEYS } from "@/constants/queryKeys"
import { useQuery } from "@tanstack/react-query"

export const useSuggestedPeople = (page: number=1, limit: number=10) => {
   return useQuery({
     queryKey: [QUERY_KEYS.GET_SUGGESTED_USERS, page, limit],
     queryFn: () => getSuggestedUsers(page, limit),
     retry: 2,
     staleTime: 5 * 60 * 1000, 
     placeholderData: (previousData) => previousData,
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