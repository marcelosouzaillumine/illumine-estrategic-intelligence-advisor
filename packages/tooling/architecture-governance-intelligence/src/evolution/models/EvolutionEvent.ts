import { EvolutionPattern } from '../patterns/EvolutionPatterns';
import { EvolutionEvidence } from './EvolutionEvidence';

export interface EvolutionEvent {
  readonly id: string;
  readonly sourceSnapshot: string;
  readonly targetSnapshot: string;
  readonly artifact: string;
  readonly changeType: EvolutionPattern;
  readonly before: Record<string, unknown>;
  readonly after: Record<string, unknown>;
  readonly evidence: EvolutionEvidence[];
}
