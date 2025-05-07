import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <>
    <div className="flex">
      <section className="flex flex-col flex-1 justify-baseline  items-center py-8">
      <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="rounded-full bg-amber-100 p-3">
              <img src="/assets/logo.PNG" className="w-16 h-16" alt="Logo" />
            </div>
            <h2 className="font-bold text-3xl text-amber-600">
              Connect through Deen
            </h2>
            <p className="text-slate-600 text-center max-w-sm">
              Join our community to connect with like-minded individuals on your spiritual journey.
            </p>
          </div>
        <Outlet />
      </section>
      <div className="hidden xl:block xl:w-1/2 h-full ">
        <img src="/assets/hero.png" className="w-full object-cover h-full" />
      </div>
    </div>
    <footer className="text-center p-6 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} LinkDeen. All rights reserved.
        </footer>
    </>
  );
}
