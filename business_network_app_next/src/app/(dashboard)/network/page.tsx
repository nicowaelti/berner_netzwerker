import { Suspense } from 'react';
import { NetworkListSkeleton } from '@/components/network/NetworkSkeleton';
import { FilteredNetworkList } from '@/components/network/FilteredNetworkList';
import { auth } from '@/lib/firebase/auth';
import { getNetworkMembers } from '@/lib/firebase/users';
import { AlertCircle } from 'lucide-react';

async function NetworkMembers() {
  try {
    const session = await auth.currentUser;
    if (!session) {
      throw new Error('Not authenticated');
    }
    
    const members = await getNetworkMembers(session.uid);
    
    if (members.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">
            Es wurden noch keine Netzwerkmitglieder gefunden.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Sobald sich weitere Benutzer registrieren, werden sie hier erscheinen.
          </p>
        </div>
      );
    }

    return <FilteredNetworkList initialMembers={members} />;
  } catch (error) {
    console.error('Error loading network members:', error);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Fehler beim Laden der Netzwerkmitglieder. Bitte versuchen Sie es später erneut.
          </p>
        </div>
      </div>
    );
  }
}

export default function NetworkPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Ihr berufliches Netzwerk
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Vernetzen Sie sich mit anderen Fachleuten in der Region Bern
        </p>
      </div>

      <Suspense fallback={<NetworkListSkeleton />}>
        <NetworkMembers />
      </Suspense>
    </div>
  );

      <Suspense fallback={<NetworkListSkeleton />}>
        <NetworkList />
      </Suspense>
    </div>
  );
}
