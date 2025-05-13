import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export const useSignout = () => {
  const navigate = useNavigate();
  const { handleSignout } = useAuth();

  const signout = async() => {
    try {
      await handleSignout();
      navigate('/auth/sign-in');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return signout ;
};