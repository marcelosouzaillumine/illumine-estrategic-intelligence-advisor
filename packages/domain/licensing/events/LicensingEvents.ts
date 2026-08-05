import { DomainEvent } from '../../shared';

export interface LicenseIssued extends DomainEvent {
  metadata: { licenseKey: string; subscriptionId: string };
}

export interface LicenseUpdated extends DomainEvent {
  metadata: { licenseKey: string; maxSeats: number };
}

export interface LicenseRevoked extends DomainEvent {
  metadata: { licenseKey: string; reason: string };
}
