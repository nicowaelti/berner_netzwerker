'use client';

import { ConnectButton } from '@/components/ui/ConnectButton';
import { Building2, MapPin, User, Briefcase, Users, Link2, GraduationCap } from 'lucide-react';
import type { NetworkMember, CompanyMember, FreelancerMember } from '@/lib/types/network';

function CompanyDetails({ member }: { member: CompanyMember }) {
  return (
    <>
      <div>
        <p className="truncate text-sm font-medium text-gray-900">
          {member.company || 'Unnamed Company'}
        </p>
        <div className="mt-1 flex flex-col gap-1">
          {member.industry && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Briefcase className="mr-1 h-4 w-4" />
                {member.industry}
              </span>
            </p>
          )}
          {member.companySize && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {member.companySize} Mitarbeitende
              </span>
            </p>
          )}
          {member.yearEstablished && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Building2 className="mr-1 h-4 w-4" />
                Seit {member.yearEstablished}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function FreelancerDetails({ member }: { member: FreelancerMember }) {
  return (
    <>
      <div>
        <p className="truncate text-sm font-medium text-gray-900">
          {member.name || member.email}
        </p>
        <div className="mt-1 flex flex-col gap-1">
          {member.title && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Briefcase className="mr-1 h-4 w-4" />
                {member.title}
              </span>
            </p>
          )}
          {member.experience && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <GraduationCap className="mr-1 h-4 w-4" />
                {member.experience} Jahre Erfahrung
              </span>
            </p>
          )}
          {member.portfolio && (
            <p className="truncate text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Link2 className="mr-1 h-4 w-4" />
                <a 
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Portfolio
                </a>
              </span>
            </p>
          )}
        </div>
        {member.skills && member.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="text-xs text-gray-500">+{member.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function MemberCard({ member }: { member: NetworkMember }) {
  return (
    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
        {member.profileType === 'company' ? (
          <Building2 className="h-6 w-6" />
        ) : (
          <User className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {member.profileType === 'company' ? (
          <CompanyDetails member={member} />
        ) : (
          <FreelancerDetails member={member} />
        )}
        {member.location && (
          <p className="mt-1 flex items-center text-xs text-gray-500">
            <MapPin className="mr-1 h-3 w-3" />
            {member.location}
          </p>
        )}
      </div>
      <div>
        <ConnectButton memberId={member.id} initialStatus={member.connectionStatus} />
      </div>
    </div>
  );
}
