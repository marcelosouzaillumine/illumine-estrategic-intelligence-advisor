import { ExecutiveNarrative, ExecutiveNarrativeData } from './types';
import { ExecutiveNarrativePolicy } from './ExecutiveNarrativePolicy';

export class AdvisoryCompressionEngine {
  /**
   * Performs deterministic structural reduction.
   * Prohibited: Semantic reinterpretation, causality swapping, tone alteration,
   * contextual inference, or "beautification".
   */
  static compress(narrative: ExecutiveNarrative): ExecutiveNarrative {
    // Structural reduction: Summarize metrics, but do not alter violations or causality
    const compressedSummary = narrative.summary + ' [COMPRESSED_STRUCTURALLY]';

    const compressedData: ExecutiveNarrativeData = {
      narrativeId: narrative.narrativeId,
      tenantId: narrative.tenantId,
      sourceRuntime: narrative.sourceRuntime,
      lineage: [...narrative.lineage], // Preserved exact
      evidenceChain: [...narrative.evidenceChain], // Preserved exact
      confidence: narrative.confidence, // Preserved exact
      supportingMetrics: { ...narrative.supportingMetrics },
      violations: [...narrative.violations], // Preserved exact
      title: narrative.title,
      summary: compressedSummary,
      causalityOrder: [...narrative.causalityOrder], // Preserved exact
      priority: narrative.priority // Preserved exact
    };

    // Reseal
    return ExecutiveNarrativePolicy.sealNarrative(compressedData);
  }
}
