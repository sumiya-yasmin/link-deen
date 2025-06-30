import {
  deleteProfileImage,
  getProfileById,
  getUserPosts,
  updateProfile,
  uploadProfileImage,
} from '@/api/profile';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

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
    queryFn: ({ pageParam = 1 }) =>
      getUserPosts({ userId, page: pageParam, limit }),
    enabled: !!userId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { id: profileId } = useParams<{ id: string }>();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data, variables) => {
      console.log('Upload successful, response:', data);
      if (data.user && profileId) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_PROFILE_BY_ID, profileId],
          data.user
        );
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
      toast.success(
        `${
          variables.imageType === 'profile' ? 'Profile picture' : 'Cover photo'
        } updated successfully!`
      );
    },

    onError: (error: any) => {
      console.error('Upload failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to upload image. Please try again.';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  const { id: profileId } = useParams<{ id: string }>();

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: (data, variables) => {
      if (data.user && profileId) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_PROFILE_BY_ID, profileId],
          data.user
        );
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
      toast.success(
        `${
          variables.imageType === 'profile' ? 'Profile picture' : 'Cover photo'
        } deleted successfully!`
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to delete image. Please try again.';
      toast.error(errorMessage);
    },
  });
};


export const useUpdateProfile = () =>{
  const queryClient = useQueryClient();
  const {id: profileId} = useParams<{id: string}>();
  return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data)=>{
           if (profileId) {
        queryClient.setQueryData([QUERY_KEYS.GET_PROFILE_BY_ID, profileId], data.user);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
      toast.success('Profile updated successfully!');
        },
         onError: (err: any) => {
      const msg =
        err.response?.data?.error || 'Failed to update profile. Please try again.';
      toast.error(msg);
    },
  })
}