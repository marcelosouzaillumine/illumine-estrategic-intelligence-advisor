import { Identifier } from '@illumine/core-primitives';
import { ProvenanceReference } from './ProvenanceReference';

export interface ReasoningTraceNode {
  readonly stepIndex: number;
  readonly phase: 'FACT' | 'EVIDENCE' | 'INFERENCE' | 'FINDING' | 'ALTERNATIVE' | 'RECOMMENDATION';
  readonly description: string;
  readonly confidence: number;
}

export interface ReasoningTrace {
  readonly traceId: Identifier;
  readonly caseId: Identifier;
  readonly provenance: ProvenanceReference;
  readonly steps: ReasoningTraceNode[];
}
