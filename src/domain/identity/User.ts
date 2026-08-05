export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface User {
  id: string; // Internal system ID
  authUid: string; // Identity provider ID (e.g., Firebase UID)
  email: string;
  status: UserStatus;
  lastAccessAt?: Date;
  createdAt: Date;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  tenantId: string;
  roleCode: string;
  authenticatedAt: Date;
  expiresAt?: Date;
}
