import AuthGuard from '@/components/AuthGuard';
import AuthLayout from '@/layouts/AuthLayout';
import RootLayout from '@/layouts/RootLayout';
import { HomePage } from '@/pages';
import { SigninPage, SignupPage } from '@/pages/auth';


import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
           <Route path='sign-up' element={<SignupPage />} />
           <Route path='sign-in' element={<SigninPage />} />
        </Route>
        <Route path="/" element={<AuthGuard><RootLayout /></AuthGuard>}>
        <Route index element={<HomePage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
