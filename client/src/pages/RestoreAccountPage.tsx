import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRestoreProfile } from '@/hooks/useProfileApi';
import { useAuth } from '@/context/AuthContext';

export default function RestoreAccountPage() {
  const { user } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [restoreUntil, setRestoreUntil] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const state = location.state;
    
    if (state?.email) {
      setEmail(state.email);
    } 

    if (state?.restoreUntil) {
      setRestoreUntil(state.restoreUntil);
    }
        setIsLoading(false);
  }, [location.state, navigate]);

  const { mutate: restoreProfileMutate, isPending } = useRestoreProfile();
  const handleRestore = (e: any) => {
    e.preventDefault();
    if (!email || !password) return;
    if (window.confirm('Are you sure you want to restore your account?')) {
      restoreProfileMutate({
        email,
        password,
      });
    }
  };
   if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading restoration page...</p>
        </div>
      </div>
    );
  }


  const isRestorePeriodValid =
    restoreUntil && new Date(restoreUntil) > new Date();
if (user && !user.isDeleted) {
    return (
      <div className="h-screen flex justify-center items-center">
      <div className="bg-dark-4 shadow-lg rounded-lg p-10 max-w-sm text-center">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-400">You do not have permission to view this page.</p>
      </div>
    </div>
    )}
    if (!user && !email){
       return (
      <div className="h-screen flex justify-center items-center">
      <div className="bg-dark-4 shadow-lg rounded-lg p-10 max-w-sm text-center">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-400">You do not have permission to view this page.</p>
      </div>
    </div>
    )
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        Account Scheduled for Deletion
      </h1>
      <p className="mb-6">
        Your account will be permanently deleted in a few days. You can restore
        it now.
      </p>

      {email && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Account Email:</label>
          <p className="text-gray-400">{email}</p>
        </div>
      )}

      {restoreUntil && (
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Restore available until:
          </label>
          <p
            className={`${
              isRestorePeriodValid ? 'text-orange-400' : 'text-red-600'
            }`}
          >
            {new Date(restoreUntil).toLocaleString()}
          </p>
          {!isRestorePeriodValid && (
            <p className="text-red-600 text-sm mt-1">
              Restore period has expired. You can no longer restore your
              account.
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="text-left">
          <label className="text-sm font-medium text-gray-600 block mb-1">
              Confirm with your password:
            </label>
          <input
            type="password"
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRestore}
            disabled={isPending || !isRestorePeriodValid || !password}
            className={`px-6 py-2 rounded font-medium ${
              isPending || !isRestorePeriodValid || !password
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isPending ? 'Restoring...' : 'Restore Account'}
          </button>

          <button
            onClick={() => navigate('/auth/sign-in')}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
