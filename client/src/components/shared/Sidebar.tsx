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
  { icon: Users, label: 'People', path: '/people' },
  { icon: Files, label: `Hikmah Board`, path: '/hikmah-board' },
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
    <nav className="hidden md:flex bg-dark-2 px-6 py-2 min-w-[270px] flex-col justify-between h-screen fixed left-0 top-0">
      <div className="flex flex-col gap-4">
        <Link to="/" className="flex items-center ">
          <img src="/assets/logo5.png" className="object-contain h-18"  />
        </Link>
        <Link to={`/profile/${user?._id}`} className="flex items-center gap-3 px-3 rounded-lg hover:bg-gray-800/50 transition-colors">
          <img
            src={user?.imageUrl || '/assets/profile-placeholder.png'}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover border-2 border-[#CD7F32]/20"
          />
          <div className="flex flex-col w-35">
            <p className="text-[18px] font-semibold leading-tight text-white truncate">{user?.name}</p>
            <p className="text-[#ECBF87] text-sm leading-tight truncate">
              @{user?.username}
            </p>
          </div>
        </Link>
        <hr className='text-gray-500'></hr>
        <ul className="space-y-2">
          {sideNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <li
                key={item.label}
                // className={`group p-2 ${
                //   isActive ? 'bg-[#CD7F32]' : ''
                // } hover:bg-[#CD7F32] rounded-md`}
              >
                <Link to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#CD7F32] text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                    }`}>
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
        <hr className='text-gray-500'></hr>
        <li className={`group px-4 py-3 hover:bg-gray-800/70 rounded-md`}>
          <button
            onClick={handleClick}
            className="flex items-center justify-items-start gap-2 w-full"
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
