import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRestoreProfile } from '@/hooks/useProfileApi';
import toast from 'react-hot-toast';

export default function RestoreAccountPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [restoreUntil, setRestoreUntil] = useState('');
  const restoreProfileMutation = useRestoreProfile(user?._id!);

  useEffect(() => {
    const state = location.state as { email?: string; restoreUntil?: string } | null;
    
    if (state?.email) {
      setEmail(state.email);
    }
    
    if (state?.restoreUntil) {
      setRestoreUntil(state.restoreUntil);
    }

    // If no state provided, redirect to sign-in
    if (!state?.email) {
      toast.error('Please sign in to restore your account');
      navigate('/auth/sign-in');
    }
  }, [location.state, navigate]);

  const handleRestore = () => {
    if (!user?._id) return;
    if (window.confirm('Are you sure you want to restore your account?')) {
      restoreProfileMutation.mutate();
    }
  };

  const isRestorePeriodValid = restoreUntil && new Date(restoreUntil) > new Date();

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
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <p className="text-gray-400">{email}</p>
        </div>
      )}

      {restoreUntil && (
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600">
            Restore available until:
          </label>
          <p className={`${isRestorePeriodValid ? 'text-orange-400' : 'text-red-600'}`}>
            {new Date(restoreUntil).toLocaleString()}
          </p>
          {!isRestorePeriodValid && (
            <p className="text-red-600 text-sm mt-1">
              Restore period has expired. You can no longer restore your account.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleRestore}
          disabled={restoreProfileMutation.isPending || !isRestorePeriodValid}
          className={`px-6 py-2 rounded font-medium ${
            restoreProfileMutation.isPending || !isRestorePeriodValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {restoreProfileMutation.isPending ? 'Restoring...' : 'Restore Account'}
        </button>

        <button
          onClick={() => navigate('/auth/sign-in')}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}