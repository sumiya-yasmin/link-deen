import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addComment({ postId, content }),
    onSuccess: () => {
      toast.success('Your comment has been added successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetComments = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
    queryFn: () => getComments({ postId }),
  });
};

export const useUpdateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment({ postId, commentId, content }),
    onSuccess: () => {
      toast.success('Your comment has been updated successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
      });
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({commentId}:{commentId: string}) => deleteComment({ postId, commentId }),
    onSuccess: () => {
      toast.success('Your comment has been deleted successfully');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
      });
    },
  });
};
