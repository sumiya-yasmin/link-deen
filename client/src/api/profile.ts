import API from '@/lib/axios';
import { PaginatedPostsResponse, User, UserProfile } from '@/types';

export const getProfileById = async (
  profileId: string
): Promise<UserProfile> => {
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
  const response = await API.get(`/post/user/${userId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const uploadProfileImage = async ({
  file,
  imageType,
}: {
  file: File;
  imageType: 'profile' | 'cover';
}): Promise<{ imageUrl: string; success: boolean; user: User }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('imageType', imageType);

  const response = await API.post('/profile/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteProfileImage = async ({
  imageUrl,
  imageType,
}: {
  imageUrl: string;
  imageType: 'profile' | 'cover';
}) => {
  const res = await API.delete('/profile/delete/image', {
    data: { imageUrl, imageType },
  });
  return res.data;
};
