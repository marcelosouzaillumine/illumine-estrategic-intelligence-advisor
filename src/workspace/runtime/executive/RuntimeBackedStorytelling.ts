import { ExecutiveNarrativeData, ConfidenceLevel, EvidenceChain, RuntimeMetrics, ExecutiveViolation } from './types';

export class RuntimeBackedStorytelling {
  static createBaseNarrative(
    tenantId: string,
    sourceRuntime: string,
    lineage: string[],
    evidenceChain: EvidenceChain[],
    confidence: ConfidenceLevel,
    supportingMetrics: RuntimeMetrics,
    violations: ExecutiveViolation[],
    title: string,
    summary: string,
    causalityOrder: string[],
    priority: number
  ): ExecutiveNarrativeData {
    
    if (!sourceRuntime) throw new Error('MISSING_RUNTIME');
    if (!lineage || lineage.length === 0) throw new Error('MISSING_LINEAGE');
    if (!evidenceChain || evidenceChain.length === 0) throw new Error('MISSING_EVIDENCE_CHAIN');
    if (!confidence) throw new Error('MISSING_CONFIDENCE');

    return {
      narrativeId: `NARR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      sourceRuntime,
      lineage,
      evidenceChain,
      confidence,
      supportingMetrics,
      violations,
      title,
      summary,
      causalityOrder,
      priority
    };
  }
}
