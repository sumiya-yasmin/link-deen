import API from '@/lib/axios';
import { PaginatedPostsResponse, User, UserProfile } from '@/types';

export const getProfileById = async (profileId: string): Promise<UserProfile> => {
  const response = await API.get(`/profile/${profileId}`);
  return response.data as UserProfile;
};

export const getUserPosts = async ({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPostsResponse> => {
  const response = await API.get(`/post/user/${userId}`,{
    params: { page, limit },
});
  return response.data;
};
