import { CapabilityId, ReleaseId, EvidenceId, BaselineId } from '@illumine/architecture-governance-types';

export interface CapabilityCertifiedEvent {
  capabilityId: CapabilityId;
  timestamp: Date;
}

export interface ReleaseCertifiedEvent {
  releaseId: ReleaseId;
  timestamp: Date;
}

export interface FindingCreatedEvent {
  findingId: string;
  timestamp: Date;
}

export interface EvidenceRegisteredEvent {
  evidenceId: EvidenceId;
  timestamp: Date;
}

export interface BaselineCreatedEvent {
  baselineId: BaselineId;
  timestamp: Date;
}
