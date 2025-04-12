'use client';

import { useState } from 'react';
import { NetworkFilters } from './NetworkFilters';
import { MemberCard } from './MemberCard';
import type { NetworkMember } from '@/lib/types/network';

interface FilteredNetworkListProps {
  initialMembers: NetworkMember[];
}

export function FilteredNetworkList({ initialMembers }: FilteredNetworkListProps) {
  const [filters, setFilters] = useState<NetworkFilters>({
    search: '',
    profileType: 'all',
    location: '',
  });

  const filteredMembers = initialMembers.filter((member) => {
    // Filter by profile type
    if (filters.profileType !== 'all' && member.profileType !== filters.profileType) {
      return false;
    }

    // Filter by location
    if (
      filters.location &&
      member.location?.toLowerCase().includes(filters.location.toLowerCase()) === false
    ) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesEmail = member.email.toLowerCase().includes(searchTerm);
      
      if (member.profileType === 'company') {
        const matchesCompany = member.company?.toLowerCase().includes(searchTerm);
        const matchesIndustry = member.industry?.toLowerCase().includes(searchTerm);
        
        if (!matchesEmail && !matchesCompany && !matchesIndustry) {
          return false;
        }
      } else {
        const matchesName = member.name?.toLowerCase().includes(searchTerm);
        const matchesSkills = member.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm)
        );
        
        if (!matchesEmail && !matchesName && !matchesSkills) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div>
      <NetworkFilters onFiltersChange={setFilters} />
      {filteredMembers.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">
            Keine Mitglieder gefunden, die Ihren Filterkriterien entsprechen.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Versuchen Sie es mit weniger einschränkenden Filtern.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
