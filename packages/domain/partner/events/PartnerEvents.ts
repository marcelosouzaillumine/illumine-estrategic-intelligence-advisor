import { DomainEvent } from '../../shared';
import { PartnerCapability } from '../enums/PartnerEnums';

export interface AdvisorCertified extends DomainEvent {
  metadata: { advisorId: string; level: string };
}

export interface PartnershipAgreementSigned extends DomainEvent {
  metadata: { partnerId: string; agreementId: string };
}

export interface PartnerActivated extends DomainEvent {
  metadata: { partnerId: string; type: string };
}

export interface PartnerSuspended extends DomainEvent {
  metadata: { partnerId: string; reason: string };
}

export interface PartnerCapabilityGranted extends DomainEvent {
  metadata: { partnerId: string; capability: PartnerCapability };
}

// These signal downstream engines to act
export interface PartnerRevenueGenerated extends DomainEvent {
  metadata: { partnerId: string; sourceEventId: string; amount: number };
}
