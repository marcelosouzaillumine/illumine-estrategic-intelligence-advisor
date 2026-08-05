import { Identifier } from '../../shared';

export type LicenseId = Identifier;
export type CustomerReference = Identifier;
export type SubscriptionReference = Identifier;

export type LicenseKey = string; // e.g. LIC-EXEC-2026-00001

export enum LicenseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export interface LicensePeriod {
  startDate: string;
  endDate?: string;
}

export interface LicenseCapacity {
  seats: number;
  environments: number;
  storageLimitGB?: number;
}

export interface LicenseScope {
  capabilities: string[];
  modules: string[];
}
