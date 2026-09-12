import { AdvisoryEvidenceGraph } from './AdvisoryEvidenceGraph';

export type SignalCategory = 'TOPOLOGY' | 'DEPENDENCY' | 'BOUNDARY' | 'EVOLUTION';
export type SignalConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ArchitectureSignal {
  readonly id: string;
  readonly category: SignalCategory;
  readonly subject: string;
  readonly type: string; // Ex: DEPENDENCY_EXPANSION
  readonly evidenceGraph: AdvisoryEvidenceGraph;
  readonly confidence: SignalConfidence;
}
