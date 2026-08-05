import { DomainEvent } from '../../shared';

export interface TenantProvisioningStarted extends DomainEvent {
  metadata: { tenantId: string; entitlementReference: string };
}

export interface TenantEnvironmentActive extends DomainEvent {
  metadata: { tenantId: string };
}

export interface TenantSuspended extends DomainEvent {
  metadata: { tenantId: string; reason: string };
}

export interface TenantDecommissioned extends DomainEvent {
  metadata: { tenantId: string; reason: string };
}
