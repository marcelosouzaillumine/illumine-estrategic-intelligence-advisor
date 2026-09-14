import { IntelligenceIdentity } from './IntelligenceIdentity';
import { ProvenanceReference } from './ProvenanceReference';

export interface IntelligenceArtifact {
  readonly identity: IntelligenceIdentity;
  readonly provenance: ProvenanceReference;
  readonly payloadType: string;
  readonly payload: Record<string, unknown>;
}
