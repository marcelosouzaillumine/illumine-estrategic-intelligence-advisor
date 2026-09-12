// src/core/runtime/strategic-intelligence/InstitutionalStrategicIntelligenceRuntime.ts

import { ExecutiveIntelligenceReport } from '../../../core/runtime/executive-intelligence-runtime';
import { StrategicIntelligenceAdapter } from './strategic-intelligence-adapter';
import { InstitutionalStrategicIntelligenceOutput } from './strategic-intelligence-types';
import { StrategicPostureEngine } from './StrategicPostureEngine';
import { InstitutionalVectorEngine } from './InstitutionalVectorEngine';
import { StrategicContradictionEngine } from './StrategicContradictionEngine';
import { ExpansionSustainabilityEngine } from './ExpansionSustainabilityEngine';
import { LongitudinalTrajectoryEngine } from './LongitudinalTrajectoryEngine';
import { CapitalStrategyAlignmentEngine } from './CapitalStrategyAlignmentEngine';
import { StrategicInstitutionalThesisEngine } from './StrategicInstitutionalThesisEngine';
import { StrategicMemoryEngine } from './StrategicMemoryEngine';
import { StrategicExplainabilityEngine } from './StrategicExplainabilityEngine';

export class InstitutionalStrategicIntelligenceRuntime {
  static evaluate(report: ExecutiveIntelligenceReport): InstitutionalStrategicIntelligenceOutput {
    const context = StrategicIntelligenceAdapter.extractContext(report);

    const posture = StrategicPostureEngine.evaluate(context);
    const vector = InstitutionalVectorEngine.evaluate(context);
    const contradictions = StrategicContradictionEngine.evaluate(context, posture);
    const sustainability = ExpansionSustainabilityEngine.evaluate(context, posture);
    const trajectory = LongitudinalTrajectoryEngine.evaluate(context, vector.direction, contradictions);
    const capitalAlignment = CapitalStrategyAlignmentEngine.evaluate(context, posture, contradictions);
    
    const thesis = StrategicInstitutionalThesisEngine.evaluate(
      context, 
      posture, 
      vector.direction, 
      trajectory, 
      sustainability, 
      capitalAlignment, 
      contradictions
    );

    const explainability = StrategicExplainabilityEngine.evaluate(
      context,
      posture,
      vector.direction,
      trajectory,
      sustainability,
      contradictions
    );

    const contradictionTypes = contradictions.map(c => c.type);
    const memorySync = StrategicMemoryEngine.evaluate(context, posture, vector.direction, contradictionTypes);

    return {
      posture,
      vectors: [vector],
      contradictions,
      expansionSustainability: sustainability,
      trajectory,
      capitalAlignment,
      thesis,
      explainability,
      memorySync
    };
  }
}
