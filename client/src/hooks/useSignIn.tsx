import { signInMutation } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useSignin = () => {
  const navigate = useNavigate();
  const { handleSignin } = useAuth();
  return useMutation({
    mutationFn: signInMutation,
    onSuccess: (data) => {
      handleSignin(data.accessToken);
      toast.success('Sign in successful. Welcome to Link Deen');
      navigate('/');
    },
    onError: (error: AxiosError<{ message?: string; name?: string, restoreAvailableUntil?: string, userId?: string }>, variables) => {
      console.log('Signin error:', error);
  console.log('Variables:', variables);
      const status = error.response?.status;
      const data = error.response?.data;
      const message = data?.message || '';
      if (status === 401 && (
        message.toLowerCase().includes('user not found') ||
        message.toLowerCase().includes('email not registered') ||
        message.toLowerCase().includes('invalid credentials')
      )) {
        toast.error('Account not found. Redirecting to sign up...');
        setTimeout(() => navigate('/auth/sign-up'), 500);
        return;
      }
      
      if (status === 403 && data?.restoreAvailableUntil) {
        const restoreUntil = data.restoreAvailableUntil;
        const email = variables.email;
        
        console.log('Navigating to restore account with:', { restoreUntil, email});
        
        toast.error('Account scheduled for deletion. Redirecting...');
        setTimeout(() => {
          navigate('/restore-account', {
            state: { restoreUntil, email},
          });
        }, 1500);
        return;
      }
      toast.error(
        message ||
          'Signin failed. Please try again'
      );
    },
  });
};
