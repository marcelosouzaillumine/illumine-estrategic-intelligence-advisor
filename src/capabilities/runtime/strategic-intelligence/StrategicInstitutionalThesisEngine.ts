// src/core/runtime/strategic-intelligence/StrategicInstitutionalThesisEngine.ts

import { 
  StrategicEvaluationContext, 
  StrategicPosture, 
  InstitutionalVectorDirection, 
  LongitudinalTrajectoryStatus, 
  ExpansionSustainability, 
  CapitalStrategyAlignment, 
  StrategicContradiction,
  StrategicInstitutionalThesis 
} from './strategic-intelligence-types';
import { StrategicNarrativeComposer } from './StrategicNarrativeComposer';

export class StrategicInstitutionalThesisEngine {
  static evaluate(
    context: StrategicEvaluationContext,
    posture: StrategicPosture,
    primaryVector: InstitutionalVectorDirection,
    trajectoryStatus: LongitudinalTrajectoryStatus,
    expansionSustainability: ExpansionSustainability,
    capitalAlignment: CapitalStrategyAlignment,
    contradictions: StrategicContradiction[]
  ): StrategicInstitutionalThesis {
    
    const unifiedThesisStatement = StrategicNarrativeComposer.composeThesis(
      context,
      posture,
      primaryVector,
      trajectoryStatus,
      expansionSustainability,
      capitalAlignment,
      contradictions
    );

    return {
      strategicPosture: posture,
      primaryVector,
      trajectoryStatus,
      expansionIsSustainable: expansionSustainability.isSustainable,
      capitalIsAligned: capitalAlignment.isCoherent,
      unifiedThesisStatement
    };
  }
}
