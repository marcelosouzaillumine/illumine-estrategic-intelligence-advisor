import { EvolutionEvent } from './EvolutionEvent';
import { EvolutionPattern } from '../patterns/EvolutionPatterns';
import { EvolutionEvidence } from './EvolutionEvidence';

export interface EvolutionPeriod {
  readonly fromSnapshotId: string;
  readonly toSnapshotId: string;
}

export interface EvolutionSnapshot {
  readonly version: string;
  readonly period: EvolutionPeriod;
  readonly events: readonly EvolutionEvent[];
  readonly patterns: readonly EvolutionPattern[];
  readonly evidence: readonly EvolutionEvidence[];
  readonly generatedBy: { readonly engineVersion: string };
}
