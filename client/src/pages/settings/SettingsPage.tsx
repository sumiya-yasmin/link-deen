// src/pages/SettingsPage.tsx

import { Link, Outlet, useLocation } from 'react-router-dom';
import { RotateCcwKey, SunMoon, UserCog, UserRoundX } from 'lucide-react';
const settingsItems = [
  // { icon: '/assets/react.svg', label:'Profile', path: '/profile' },

  { icon: UserCog, label: 'Edit Profile', path: 'profile' },
  // { icon: RotateCcwKey, label: 'Edit Password', path: 'password' },
  // { icon: SunMoon, label: 'Theme', path: 'theme' },
  { icon: UserRoundX, label: 'Danger Zone', path: 'danger' },
  //   { icon: Files, label: 'Dua Board', path: '/blogs' },
  //   { icon: Settings, label: 'Settings', path: '/settings' },
];

function SettingsPage() {
    const location = useLocation();
  return (
    <section className="flex md:max-w-6xl md:flex-row flex-col items-center justify-center p-6 gap-6 md:h-[calc(100vh-64px)]">
      <aside className="bg-dark-2 px-2 py-4 w-full md:w-[270px] rounded-lg overflow-y-auto md:overflow-y-auto">
        <ul className="flex md:flex-col justify-between md:space-y-6 space-x-2 md:space-x-0 text-sm overflow-x-scroll md:overflow-auto">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(`/settings/${item.path}`);
            return (
              <li
                key={item.label}
                className={`group p-2 ${
                  isActive ? 'bg-[#CD7F32]' : ''
                } hover:bg-[#CD7F32] rounded-md`}
              >
                <Link to={item.path} className="flex md:flex-row flex-col items-center gap-2">
                  <Icon
                    className={`w-6 h-6 text-[#CD7F32]  ${
                      isActive ? 'text-[#ffffff]' : ''
                    } group-hover:text-[#ffffff]`}
                  />
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <main className="flex md:flex-1 overflow-y-auto pr-2 items-center px-2 md:px-6 ">
        <Outlet />
      </main>
    </section>
  );
}

export default SettingsPage;
