  import { Link } from 'react-router-dom';
  import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from '@/components/ui/icons/avatar';

  function Topbar() {
    return (
      <section className=''>
          <div className='flex justify-between items-center'>
        <Link to="/" className="flex gap=3 items-center">
          <img src="/assets/logo.PNG" className="rounded-full h-16 w-16" />
        </Link>
        <div>
          <div>Logout</div>
          <Link to="/profile">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          </Link>
        </div>
        </div>
      </section>
    );
  }

  export default Topbar;
