import  React, {createContext, ReactNode, useState } from "react";

interface User{
id: string;
username: string;
email: string;
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signin : (accessToken: string) =>void;
    signout: () =>void;
};

const AuthContext = createContext<AuthContextType | undefined >(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
const [user, setUser] = useState<User | null>(null);
 const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signin = (accessToken: string) =>{
     localStorage.setItem('accessToken', accessToken);
    setIsAuthenticated(true);
    // fetchUserData();
  };
  
  }

