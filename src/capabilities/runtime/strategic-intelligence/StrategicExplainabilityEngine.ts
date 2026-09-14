// src/core/runtime/strategic-intelligence/StrategicExplainabilityEngine.ts

import { 
  StrategicEvaluationContext, 
  StrategicExplainability, 
  StrategicPosture, 
  InstitutionalVectorDirection, 
  LongitudinalTrajectoryStatus, 
  ExpansionSustainability, 
  StrategicContradiction 
} from './strategic-intelligence-types';

export class StrategicExplainabilityEngine {
  static evaluate(
    context: StrategicEvaluationContext,
    posture: StrategicPosture,
    primaryVector: InstitutionalVectorDirection,
    trajectory: LongitudinalTrajectoryStatus,
    sustainability: ExpansionSustainability,
    contradictions: StrategicContradiction[]
  ): StrategicExplainability {

    const vectorRationale = `O vetor primário detectado é ${primaryVector.replace(/_/g, ' ')} embasado na variação histórica de receita, OCF e dependência de funding.`;
    const trajectoryRationale = `A trajetória foi classificada como ${trajectory.replace(/_/g, ' ')} em função das restrições ativas e histórico longitudinal (${context.metadata.historicalCyclesCount} ciclos).`;
    const contradictionDecomposition = contradictions.map(c => `[${c.type}] ${c.description} (Engines: ${c.involvedEngines.join(', ')})`);

    return {
      strategicLineage: context.metadata.lineageHash,
      vectorRationale,
      trajectoryRationale,
      contradictionDecomposition,
      sustainabilityExplanation: sustainability.rationale
    };
  }
}
