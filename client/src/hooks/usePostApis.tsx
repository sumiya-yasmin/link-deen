import {
  createPost,
  deletePost,
  getRecentPosts,
  likePost,
  updatePost,
} from '@/api/posts';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('Post created successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      navigate('/');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data.message || 'Post creation failed');
    },
  });
};

export const useGetRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_RECENT_POSTS],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post._id === updatedPost._id ? updatedPost : post
              ),
            })),
          };
        }
      );
    },

    onError: () => {
      toast.error('Failed to like post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
   const navigate = useNavigate();
  return useMutation({
    mutationFn: updatePost,
    onMutate: () => {
      toast.loading('Updating post...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Post updated successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
       navigate('/');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
       toast.dismiss();
      toast.error(error.response?.data.message || 'Post update failed');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onMutate: () => {
      toast.loading('Deleting post...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Post Deleted successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data.message || 'Failed to delete post.');
    },
  });
};
