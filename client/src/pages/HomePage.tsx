import { useAuth } from '@/context/AuthContext';
import { useSignout } from '@/hooks/useSignout';


const HomePage = () => {
  const { user, isLoading } = useAuth();
  console.log('HomePage user state:', user);
  const  signout = useSignout();
  if (isLoading) {
  return <div className="min-h-screen p-6">Loading...</div>;
}
const handleClick = async () => {
    await signout(); 
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-black">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome Home</h1>
        {user && (
          <div>
            <p className='text-black"'>Logged in as: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
        <button 
          onClick={handleClick}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;

