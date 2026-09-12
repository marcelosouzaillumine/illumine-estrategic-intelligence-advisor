import { sha256 } from '../../../workspace/runtime/executive/types';
import { HistoricalCycleData } from '../institutional-memory/types';
import { CausalSequence, StructuralPropagationVector } from './types';

export class CausalLineageIntegrityEngine {
  public static generateHashes(
    cycles: HistoricalCycleData[],
    sequences: CausalSequence[],
    propagationVectors: StructuralPropagationVector[]
  ): {
    lineageHash: string;
    propagationIntegrityHash: string;
    evidenceChainHash: string;
  } {
    const sorted = [...cycles].sort((a, b) => a.year - b.year);
    const lineageSource = sorted.map(c => c.lineageHash || `${c.year}-lineage`).join('|');
    const lineageHash = sha256(lineageSource);

    const propagationSource = propagationVectors.map(v => `${v.vectorId}:${v.severity}`).join('|');
    const propagationIntegrityHash = sha256(propagationSource || 'NO-PROPAGATION-VECTORS');

    const evidenceSource = sequences
      .flatMap(s => s.steps.map(step => `${step.cycleYear}:${step.eventDescription}`))
      .join('|');
    const evidenceChainHash = sha256(evidenceSource || 'NO-SEQUENCE-EVIDENCE');

    return {
      lineageHash,
      propagationIntegrityHash,
      evidenceChainHash
    };
  }
}
