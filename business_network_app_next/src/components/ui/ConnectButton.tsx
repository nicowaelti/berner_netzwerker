'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/loading';
import { 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  removeConnection 
} from '@/lib/firebase/network';

interface ConnectButtonProps {
  memberId: string;
  initialStatus: 'connected' | 'pending' | 'none';
}

export function ConnectButton({ memberId, initialStatus }: ConnectButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await sendConnectionRequest(user.uid, memberId);
      setStatus('pending');
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await acceptConnectionRequest(memberId, user.uid);
      setStatus('connected');
    } catch (error) {
      console.error('Failed to accept connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await removeConnection(user.uid, memberId);
      setStatus('none');
    } catch (error) {
      console.error('Failed to remove connection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'connected') {
    return (
      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 hover:bg-green-200"
      >
        {loading ? (
          <LoadingSpinner className="h-4 w-4" />
        ) : (
          'Connected'
        )}
      </button>
    );
  }

  if (status === 'pending') {
    return (
      <button
        type="button"
        onClick={handleAccept}
        disabled={loading}
        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 hover:bg-blue-200"
      >
        {loading ? (
          <LoadingSpinner className="h-4 w-4" />
        ) : (
          'Accept'
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? (
        <LoadingSpinner className="h-5 w-5 text-white" />
      ) : (
        'Connect'
      )}
    </button>
  );
}
