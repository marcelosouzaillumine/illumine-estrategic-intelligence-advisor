import { CausalGraphModel } from '../causal-model/CausalGraphModel';
import { ReasoningTrace } from '@illumine/intelligence-kernel';

export class ContextualInferenceEngine {
  public static evaluateCausalChain(model: CausalGraphModel, rootNodeId: string): ReasoningTrace {
    const impacts = model.getDownstreamImpacts(rootNodeId);
    const steps = impacts.map((edge, idx) => ({
      stepIndex: idx + 1,
      phase: 'INFERENCE' as const,
      description: `Impacto causal de ${edge.sourceNodeId} em ${edge.targetNodeId} com peso ${edge.impactWeight}`,
      confidence: edge.confidence
    }));

    return {
      traceId: `trace-causal-${rootNodeId}`,
      caseId: `case-${rootNodeId}`,
      provenance: { sourceId: rootNodeId, evidenceIds: [], lineageHash: `hash-${rootNodeId}` },
      steps
    };
  }
}
