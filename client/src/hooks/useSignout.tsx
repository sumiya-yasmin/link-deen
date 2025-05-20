import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export const useSignout = () => {
  const navigate = useNavigate();
  const { handleSignout } = useAuth();

  const signout = async() => {
    try {
      await handleSignout();
      toast.success('Logged out successfully');
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return signout ;
};