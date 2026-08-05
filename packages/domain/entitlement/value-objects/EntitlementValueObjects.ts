import { Identifier } from '../../shared';

export type EntitlementId = Identifier;
export type LicenseReference = Identifier;
export type TenantReference = Identifier;

export enum EntitlementStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED'
}

export enum CapabilityCategory {
  INTELLIGENCE = 'INTELLIGENCE',
  GOVERNANCE = 'GOVERNANCE',
  OPERATIONS = 'OPERATIONS',
  PLATFORM = 'PLATFORM'
}

export interface Capability {
  code: string;
  category: CapabilityCategory;
}

export interface UsageLimit {
  metricCode: string;
  maxLimit: number;
}

export interface FeatureGate {
  gateCode: string;
  isEnabled: boolean;
}
