import { Identifier, Timestamp } from '@illumine/core-primitives';
import { ProvenanceReference } from '@illumine/intelligence-kernel';

export interface ModelImprovementRequest {
  readonly requestId: Identifier;
  readonly targetCapabilityId: Identifier;
  readonly metricCode: string;
  readonly proposedAdjustment: string;
  readonly justification: string;
  readonly provenance: ProvenanceReference;
  readonly status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  readonly requestedAt: Timestamp;
}
