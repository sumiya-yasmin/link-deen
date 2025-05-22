// src/pages/SettingsPage.tsx

import { Link, Outlet } from 'react-router-dom';
import { RotateCcwKey, SunMoon, UserCog, UserRoundX } from 'lucide-react';
const settingsItems = [
  // { icon: '/assets/react.svg', label:'Profile', path: '/profile' },

  { icon: UserCog, label: 'Edit Profile', path: 'profile' },
  { icon: RotateCcwKey, label: 'Edit Password', path: 'password' },
  { icon: SunMoon, label: 'Theme', path: 'theme' },
  { icon: UserRoundX, label: 'Danger Zone', path: 'danger' },
  //   { icon: Files, label: 'Dua Board', path: '/blogs' },
  //   { icon: Settings, label: 'Settings', path: '/settings' },
];

function SettingsPage() {
  return (
    <section className="flex max-w-6xl  p-6 gap-6 h-[calc(100vh-64px)]">
      <aside className="bg-dark-2 px-2 py-4 w-[270px] rounded-lg overflow-y-auto">
        <ul className="space-y-6">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.label}
                className={`group p-2 ${
                  isActive ? 'bg-[#CD7F32]' : ''
                } hover:bg-[#CD7F32] rounded-md`}
              >
                <Link to={item.path} className="flex items-center gap-2">
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
      <main className="flex flex-1 overflow-y-auto pr-2 items-center px-6 ">
        <Outlet />
      </main>
    </section>
  );
}

export default SettingsPage;
