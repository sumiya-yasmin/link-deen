import Bottombar from '@/components/shared/Bottombar';
import Sidebar from '@/components/shared/Sidebar';
import Topbar from '@/components/shared/Topbar';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <Sidebar />
      <section className="flex flex-1 h-full pb-16">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
}
