import { signUpMutation } from '@/api/auth';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUpMutation,
    onSuccess: () => {
      toast.success('Signup successful! Redirecting to login...');
      navigate('/auth/sign-in');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SUGGESTED_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SEARCHED_USERS],
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data.message || 'Signup failed');
    },
  });
};
