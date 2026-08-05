import { DomainEvent } from '../../shared';

export interface EntitlementGranted extends DomainEvent {
  metadata: { entitlementId: string; tenantReference: string };
}

export interface EntitlementSuspended extends DomainEvent {
  metadata: { entitlementId: string; reason: string };
}

export interface EntitlementRevoked extends DomainEvent {
  metadata: { entitlementId: string; reason: string };
}

export interface EntitlementUpdated extends DomainEvent {
  metadata: { entitlementId: string };
}
