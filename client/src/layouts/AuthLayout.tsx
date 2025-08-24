import { Outlet } from 'react-router-dom';


export default function AuthLayout() {
  return (
    <>
      <div className="flex">
        <section className="flex flex-col flex-1 justify-baseline  items-center py-4">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="rounded-full bg-amber-100 ">
              <img src="/assets/logoAuth.png" className="w-20 h-20 bg-black" alt="Logo" />
            </div>
                          <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-[#a67b37] bg-clip-text text-transparent text-center">
                  LinkDeen
                </h1>
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Connect through Deen
                </h2>
                <p className="text-gray-600 max-w-sm mx-auto text-center">
                  Join our community to connect with like-minded individuals on your spiritual journey.
                </p>
              </div>

          </div>
          <Outlet />
        </section>
        <div className="hidden xl:block xl:w-1/2 h-full ">
          <img src="/assets/hero4.png" className=" object-cover h-screen fixed right-0 w-3/7" />
        </div>
      </div>
      <hr className='text-gray-800 w-[40%] ml-16'></hr>
      <footer className="text-left py-6 ml-54 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} LinkDeen. All rights reserved.
      </footer>

    </>
  );
}
