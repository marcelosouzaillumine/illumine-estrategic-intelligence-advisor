export type TenantType = 'CLIENT' | 'PARTNER' | 'GLOBAL';
export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED';

export interface Tenant {
  id: string;
  type: TenantType;
  name: string;
  corporateName?: string;
  document?: string; // CNPJ, SSN, etc.
  segmentCode?: string;
  logoUrl?: string;
  status: TenantStatus;
  ownerId: string; // User ID of the primary owner
  createdAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  roleCode: string;
  status: MembershipStatus;
  joinedAt: Date;
}
