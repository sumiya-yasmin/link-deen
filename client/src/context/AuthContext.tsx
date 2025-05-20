import { signOutMutation } from '@/api/auth';
import API from '@/lib/axios';
import { getAccessToken, setAccessToken } from '@/lib/token';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleSignin: (accessToken: string) => void;
  handleSignout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSignin = (accessToken: string) => {
       setAccessToken(accessToken);
    setIsAuthenticated(true);
    fetchUserData();

  };
  const handleSignout = async () => {
    try {
      // Clear in-memory token
      await signOutMutation();
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
       throw error; 
    }
  };

  // Function to fetch user data
  const fetchUserData = async () => {
     setIsLoading(true);
    try {
      const response = await API.get('/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear in-memory token
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in on initial load

  const onRefresh = async () => {
     setIsLoading(true);
    try {
      const existingToken = getAccessToken();
      
      if (existingToken) {
        // If we have a token, try to fetch user data with it
        await fetchUserData();
        return; // Exit early if successful
      }
      // Try to refresh the token on initial load
      const response = await API.post(
        '/auth/refresh',
        {},
        { withCredentials: true }
      );
      const newAccessToken = response.data.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await fetchUserData();
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
       setIsAuthenticated(false);
      }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        handleSignin,
        handleSignout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
