import { AdvisoryEvidenceGraph } from './AdvisoryEvidenceGraph';

export interface NarrativeStatement {
  readonly text: string;
  readonly derivedFromSignalId: string;
}

export interface ArchitectureNarrative {
  readonly id: string;
  readonly subject: string;
  readonly statements: readonly NarrativeStatement[];
  readonly evidenceGraph: AdvisoryEvidenceGraph;
  readonly generatedBy: 'ADVISORY_ENGINE';
  readonly deterministicHash: string;
}
