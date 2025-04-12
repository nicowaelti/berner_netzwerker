export interface BaseNetworkMember {
  id: string;
  email: string;
  profileType: 'company' | 'freelancer';
  location?: string;
  createdAt: string;
  updatedAt?: string;
  connectionStatus: 'connected' | 'pending' | 'none';
}

export interface FreelancerMember extends BaseNetworkMember {
  profileType: 'freelancer';
  name?: string;
  title?: string;
  skills?: string[];
  experience?: string;
  portfolio?: string;
}

export interface CompanyMember extends BaseNetworkMember {
  profileType: 'company';
  company?: string;
  industry?: string;
  companySize?: string;
  services?: string;
  yearEstablished?: string;
}

export type NetworkMember = FreelancerMember | CompanyMember;
