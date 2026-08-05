import { DomainEvent } from '../../shared';

export interface LicenseCreated extends DomainEvent {
  metadata: { licenseId: string; licenseKey: string; customerReference: string };
}

export interface LicenseIssued extends DomainEvent {
  metadata: { licenseId: string };
}

export interface LicenseActivated extends DomainEvent {
  metadata: { licenseId: string };
}

export interface LicenseSuspended extends DomainEvent {
  metadata: { licenseId: string; reason: string };
}

export interface LicenseExpired extends DomainEvent {
  metadata: { licenseId: string };
}

export interface LicenseRevoked extends DomainEvent {
  metadata: { licenseId: string; reason: string };
}
