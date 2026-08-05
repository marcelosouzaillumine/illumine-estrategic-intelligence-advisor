import { Identifier } from '../../shared';

export type TenantId = Identifier;
export type CustomerReference = Identifier;
export type EntitlementReference = Identifier;

export enum TenantStatus {
  REQUESTED = 'REQUESTED',
  PROVISIONING = 'PROVISIONING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

export enum OperationalHealth {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  FAILED = 'FAILED'
}

export interface TenantConfig {
  locale: string;       // e.g., 'pt-BR', 'en-US'
  currency: string;     // e.g., 'BRL', 'USD'
  timezone: string;     // e.g., 'America/Sao_Paulo'
  dateFormat: string;   // e.g., 'DD/MM/YYYY'
  numberFormat: string; // e.g., 'pt-BR'
}

export interface AdminIdentity {
  identityReference: Identifier;
  role: 'TENANT_ADMIN' | 'SYSTEM_ADMIN';
}
