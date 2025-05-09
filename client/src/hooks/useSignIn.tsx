import { signInMutation } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useSignin = () => {
    const navigate = useNavigate()
  return useMutation({
    mutationFn: signInMutation,
    onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Sign in successful. Welcome to Link Deen');
      navigate("/");
    },
    onError: (error: AxiosError<{ message?: string; name?: string }>) => {
      toast.error(
        error.response?.data.message ||
          'Signup failed. Please create an account first'
      );
      if(error.response?.data.name === "UserNotFoundError"){
        navigate('/sign-up');
      }
    },
  });
};
