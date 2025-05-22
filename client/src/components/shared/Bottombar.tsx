import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  // Users,
  Settings,
  // PlusSquare,
  Files,
  Telescope,
  // LogOut,
} from 'lucide-react';

const bottomNavItems = [
  // { icon: '/assets/react.svg', label:'Profile', path: '/profile' },

  { icon: Home, label: 'Home', path: '/' },
  // { icon: PlusSquare, label: 'Create Post', path: '/create' },
  { icon: Telescope, label: 'Explore', path: '/explore' },
  // { icon: Users, label: 'Friends', path: '/people' },
  { icon: Files, label: 'Dua Board', path: '/blogs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function Bottombar() {
  const location = useLocation();
  return (
    <section className="md:hidden fixed bottom-0 left-0 w-full bg-dark-2 border-t border-gray-200 px-4 py-2 z-20">
      <div className="flex justify-between items-center">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              to={item.path}
              key={item.path}
              className={`${
                isActive ? 'bg-[#CD7F32]' : ''
              } flex flex-col justify-center py-1 px-3 items-center gap-1 rounded-md transition-colors duration-20`}
            >
              <Icon
                className={`w-6 h-6 text-[#CD7F32]  ${
                  isActive ? 'text-[#ffffff]' : ''
                }`}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
