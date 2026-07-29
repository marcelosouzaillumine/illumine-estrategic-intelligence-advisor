import { Identifier, Timestamp, FreshnessHours, Confidence } from '@illumine/core-primitives';

export interface Provenance {
  readonly originSystem: 'ERP' | 'CRM' | 'EXCEL' | 'API' | 'MANUAL' | 'AUDIT_LOG';
  readonly sourceIdentifier: string;
  readonly extractedAt: Timestamp;
  readonly freshnessDurationHours: FreshnessHours;
}

export interface Fact {
  readonly factId: Identifier;
  readonly statement: string;
  readonly provenance: Provenance;
}

export interface Evidence {
  readonly evidenceId: Identifier;
  readonly fact: Fact;
  readonly confidence: Confidence;
  readonly relevanceScore: number;
}

export interface Inference {
  readonly inferenceId: Identifier;
  readonly supportingEvidenceIds: Identifier[];
  readonly conclusion: string;
  readonly confidence: Confidence;
}

export interface Findings {
  readonly findingId: Identifier;
  readonly neutralInsight: string;
  readonly inferences: Inference[];
  readonly identifiedGaps: string[];
}
