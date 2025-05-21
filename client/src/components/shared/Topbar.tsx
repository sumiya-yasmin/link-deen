  import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
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
          <Button variant='ghost' onClick={()=>handleSignout()} className='bg-gray-700'>
          <img src='/assets/out.png' alt="profile" className='h-8 w-8 rounded-full' />
          </Button>
          <Link to="/profile">
          <img src='/assets/profile-placeholder.png' alt="profile" className='h-8 w-8 rounded-full' />
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}
          </Link>
        </div>
        </div>
      </section>
    );
  }

  export default Topbar;
