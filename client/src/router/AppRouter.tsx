import AuthGuard from '@/components/AuthGuard';
import AuthLayout from '@/layouts/AuthLayout';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/settings/SettingsPage';

import { SigninPage, SignupPage } from '@/pages/auth';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EditProfile from '@/pages/settings/EditProfile';
import ChangePassword from '@/pages/settings/ChangePassword';
import Theme from '@/pages/settings/Theme';
import DangerZone from '@/pages/settings/DangerZone';
import CreatePostPage from '@/pages/CreatePostPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="sign-up" element={<SignupPage />} />
          <Route path="sign-in" element={<SigninPage />} />
        </Route>
        <Route
          path="/"
          element={
            <AuthGuard>
              <RootLayout />
            </AuthGuard>
          }
        >
          {/* <Route path="/" element={<RootLayout />}> */}
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />}>
            <Route path="profile" element={<EditProfile />} />
            <Route path="password" element={<ChangePassword />} />
            <Route path="theme" element={<Theme />} />
            <Route path="danger" element={<DangerZone />} />
          </Route>
          < Route path="/create" element={<CreatePostPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
