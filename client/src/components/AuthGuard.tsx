import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
   return <div>Loading....</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  return <>{children}</>;
};

export default AuthGuard;
