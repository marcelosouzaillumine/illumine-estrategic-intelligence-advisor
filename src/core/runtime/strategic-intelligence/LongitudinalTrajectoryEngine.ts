// src/core/runtime/strategic-intelligence/LongitudinalTrajectoryEngine.ts

import { StrategicEvaluationContext, LongitudinalTrajectoryStatus, StrategicContradiction, InstitutionalVectorDirection } from './strategic-intelligence-types';

export class LongitudinalTrajectoryEngine {
  static evaluate(
    context: StrategicEvaluationContext, 
    primaryVector: InstitutionalVectorDirection, 
    contradictions: StrategicContradiction[]
  ): LongitudinalTrajectoryStatus {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return 'TRAJECTORY_STABLE';
    }

    const hasCriticalContradiction = contradictions.some(c => c.severity === 'CRITICAL');
    const isDeteriorating = primaryVector === 'LONGITUDINAL_DETERIORATION' || primaryVector === 'ACCUMULATIVE_PRESSURE';
    const isStrained = primaryVector === 'STRAINED_EXPANSION' || primaryVector === 'STRUCTURAL_COMPRESSION';
    
    if (hasCriticalContradiction) {
      return 'TRAJECTORY_UNSTABLE';
    }

    if (isDeteriorating) {
      return 'TRAJECTORY_PRESSURED';
    }

    if (isStrained || contradictions.length > 0) {
      return 'TRAJECTORY_SENSITIVE';
    }

    return 'TRAJECTORY_STABLE';
  }
}
