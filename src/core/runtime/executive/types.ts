import { createHash } from 'crypto';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';

export type ExecutiveSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface EvidenceChain {
  evidenceId: string;
  sourceNodes: string[];
  metrics: Record<string, number>;
  timestamp: string;
}

export interface RuntimeMetrics {
  executionId: string;
  totalEntities: number;
  criticalChains: number;
  consolidationHash: string;
}

export interface ExecutiveViolation {
  violationId: string;
  severity: ExecutiveSeverity;
  message: string;
  sourceContext: string;
}

export interface ExecutiveNarrativeData {
  narrativeId: string;
  tenantId: string;
  sourceRuntime: string; // The specific runtime engine/version
  lineage: string[]; // Node IDs or edges
  evidenceChain: EvidenceChain[];
  confidence: ConfidenceLevel;
  supportingMetrics: RuntimeMetrics;
  violations: ExecutiveViolation[];
  title: string;
  summary: string;
  causalityOrder: string[]; // Order of causality nodes to ensure no reordering
  priority: number;
}

export interface ExecutiveNarrative extends ExecutiveNarrativeData {
  narrativeHash: string;
  lineageHash: string;
  evidenceHash: string;
}

export class NarrativeHasher {
  static hash(payload: any): string {
    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  static generateHashes(data: ExecutiveNarrativeData): { narrativeHash: string, lineageHash: string, evidenceHash: string } {
    return {
      narrativeHash: this.hash(data),
      lineageHash: this.hash(data.lineage),
      evidenceHash: this.hash(data.evidenceChain)
    };
  }
}
