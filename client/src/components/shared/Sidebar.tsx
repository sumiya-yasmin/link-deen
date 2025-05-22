import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Settings,
  PlusSquare,
  Files,
  Telescope,
  LogOut,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useSignout } from '@/hooks/useSignout';

const sideNavItems = [
  // { icon: '/assets/react.svg', label:'Profile', path: '/profile' },

  { icon: Home, label: 'Home', path: '/' },
  { icon: PlusSquare, label: 'Create Post', path: '/create' },
  { icon: Telescope, label: 'Explore', path: '/explore' },
  { icon: Users, label: 'Friends', path: '/people' },
  { icon: Files, label: 'Dua Board', path: '/blogs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const signout = useSignout();
  const handleClick = async () => {
    await signout();
  };
  return (
    <nav className="hidden md:flex bg-dark-2 px-6 py-2 min-w-[270px] flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        <Link to="/" className="flex items-center ">
          <img src="/assets/logo5.png" className="" width={170} height={30} />
        </Link>
        <Link to="/profile" className="flex items-center gap-2">
          <img
            src="/assets/profile-placeholder.png"
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[18px] font-bold leading-[140%]">{user?.name}</p>
            <p className="text-[#ECBF87] text-[14px] font-normal leading-[140%]">
              @{user?.username}
            </p>
          </div>
        </Link>
        <ul className="space-y-6">
          {sideNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
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
        <li className={`group p-2 hover:bg-[#CD7F32] rounded-md`}>
          <button
            onClick={handleClick}
            className="flex items-center justify-items-start gap-2"
          >
            <LogOut
              className={`w-6 h-6 text-[#CD7F32] group-hover:text-[#ffffff]`}
            />
            <span className="ml-3">Signout</span>
          </button>
        </li>
      </div>
    </nav>
  );
}

export default Sidebar;
