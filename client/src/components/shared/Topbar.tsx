  import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
// import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
  // import {
  //   Avatar,
  //   AvatarFallback,
  //   AvatarImage,
  // } from '@/components/ui/icons/avatar';

  function Topbar() {
    const { handleSignout } = useAuth();
    return (
      <section className='sticky md:hidden top-0 z-50  bg-dark-2 w-full'>
          <div className='flex justify-between items-center'>
        <Link to="/" className="flex gap=3 items-center p-2">
          <img src="/assets/logo5.png" className="" width={130} height={325} />
        </Link>
        <div className='flex gap-3'>
          <button  onClick={()=>handleSignout()}>
          <LogOut
            className={`w-8 h-8 text-[#CD7F32] group-hover:text-[#ffffff]`}
          />
          </button>
            <Link to="/profile" className="flex items-center">
          <img
            src="/assets/profile-placeholder.png"
            alt="profile"
            className="h-10 w-10 rounded-full border-2 border-[#CD7F32]"
          />
          {/* <div className="flex flex-col">
            <p className="text-[18px] font-bold leading-[140%]">{user?.name}</p>
            <p className="text-[#ECBF87] text-[14px] font-normal leading-[140%]">
              @{user?.username}
            </p>
          </div> */}
        </Link>
        </div>
        </div>
      </section>
    );
  }

  export default Topbar;
