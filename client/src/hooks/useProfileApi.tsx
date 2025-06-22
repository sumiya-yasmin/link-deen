import { getProfileById, getUserPosts } from '@/api/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useGetProfileById = (profileId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID, profileId],
    queryFn: () => getProfileById(profileId),
    enabled: !!profileId && enabled,
  });
};

export const useGetUserPosts = (userId: string, limit: number = 10) => {
  return useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_USER_POSTS, userId, limit],
  queryFn: ({pageParam =1})=> getUserPosts({ userId, page: pageParam, limit }),
  enabled: !!userId,
  initialPageParam: 1, 
  getNextPageParam: (lastPage)=>{
    return lastPage.pagination.hasNextPage?  lastPage.pagination.currentPage + 1 
        : undefined;
  },
  })
};
