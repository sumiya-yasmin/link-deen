import {
  createPost,
  deletePost,
  getPopularPosts,
  getPostById,
  getRecentPosts,
  getSearchedPosts,
  likePost,
  updatePost,
} from '@/api/posts';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
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
  const postId = updatedPost._id;
       queryClient.setQueryData(
        [QUERY_KEYS.GET_POST_BY_ID, postId],
        updatedPost
      );

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
      queryClient.setQueryData(
    [QUERY_KEYS.GET_USER_POSTS, updatedPost.author._id, 10], // <- same key used in `useGetUserPosts`
    (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post._id === postId ? updatedPost : post
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

export const useGetPostById = (postId:string, enabled = true) =>{
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: ()=> getPostById(postId),
    enabled: !!postId && enabled,
  })
}

export const useGetPopularPosts = (timeframe: 'today' | 'week' | 'month' = 'today')=>{
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POPULAR_POSTS, timeframe],
    queryFn: ({ pageParam }) => getPopularPosts({ pageParam, timeframe }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
         initialPageParam: null,
  });
}

export const useSearchPosts = (searchText: string)=>{
   return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SEARCHED_POSTS, searchText],
    queryFn: ({pageParam})=> getSearchedPosts({query: searchText, pageParam}),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!searchText.trim(),
    initialPageParam: null,
   })
}