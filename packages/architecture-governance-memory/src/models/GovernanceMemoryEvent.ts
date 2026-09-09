export type CapabilitySource = 'DISCOVERY' | 'CERTIFICATION' | 'RISK' | 'DECISION' | 'ADVISORY' | 'EVOLUTION' | 'GOVERNANCE' | 'EVALUATION';

export interface GovernanceMemoryEvent {
  readonly id: string;
  readonly eventType: string;
  readonly sourceCapability: CapabilitySource;
  readonly artifactId: string;
  readonly snapshotId: string;
  readonly policyVersion: string;
  readonly timestamp: string;
  readonly payloadHash: string;
  readonly previousEventId: string | null;
}
