import { getProfileById } from '@/api/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

export const useGetProfileById = (profileId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID, profileId],
    queryFn: () => getProfileById(profileId),
    enabled: !!profileId && enabled,
  });
};
