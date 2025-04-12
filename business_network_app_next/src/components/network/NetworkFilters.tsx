'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface NetworkFiltersProps {
  onFiltersChange: (filters: NetworkFilters) => void;
}

export type ProfileType = 'all' | 'company' | 'freelancer';

export interface NetworkFilters {
  search: string;
  profileType: ProfileType;
  location: string;
}

export function NetworkFilters({ onFiltersChange }: NetworkFiltersProps) {
  const [search, setSearch] = useState('');
  const [profileType, setProfileType] = useState<ProfileType>('all');
  const [location, setLocation] = useState<string>('');

  const handleChange = (updates: Partial<NetworkFilters>) => {
    const newFilters = {
      search,
      profileType,
      location,
      ...updates
    };
    onFiltersChange(newFilters);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Suchen Sie nach Namen, Firmen oder Skills..."
            className="w-full rounded-lg border-gray-300 pl-10 pr-4 focus:border-blue-500 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleChange({ search: e.target.value });
            }}
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={profileType}
            onChange={(e) => {
              setProfileType(e.target.value as NetworkFilters['profileType']);
              handleChange({ profileType: e.target.value as NetworkFilters['profileType'] });
            }}
          >
            <option value="all">Alle Profile</option>
            <option value="company">Firmen</option>
            <option value="freelancer">Freelancer</option>
          </select>
          <input
            type="text"
            placeholder="Ort"
            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              handleChange({ location: e.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
}
