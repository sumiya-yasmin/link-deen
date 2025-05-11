import ReactDom from 'react-dom/client';
import { StrictMode } from 'react';
import './globals.css';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>
);
