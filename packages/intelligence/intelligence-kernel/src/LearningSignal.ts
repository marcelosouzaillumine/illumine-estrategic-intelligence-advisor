import { Identifier, Timestamp } from '@illumine/core-primitives';
import { ProvenanceReference } from './ProvenanceReference';

export interface LearningSignal {
  readonly signalId: Identifier;
  readonly caseId: Identifier;
  readonly decisionId: Identifier;
  readonly signalType: 'CALIBRATION' | 'ACCURACY_ADJUSTMENT' | 'BIAS_WARNING';
  readonly magnitude: number; // -1.0 a +1.0
  readonly provenance: ProvenanceReference;
  readonly emittedAt: Timestamp;
}
