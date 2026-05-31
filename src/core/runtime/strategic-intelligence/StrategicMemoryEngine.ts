// src/core/runtime/strategic-intelligence/StrategicMemoryEngine.ts

import { StrategicEvaluationContext, StrategicMemoryRecord, StrategicPosture, InstitutionalVectorDirection, StrategicContradictionType } from './strategic-intelligence-types';

export class StrategicMemoryEngine {
  static evaluate(
    context: StrategicEvaluationContext,
    posture: StrategicPosture,
    primaryVector: InstitutionalVectorDirection,
    contradictionTypes: StrategicContradictionType[]
  ): { requiresSync: boolean; record?: StrategicMemoryRecord } {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return { requiresSync: false };
    }

    const record: StrategicMemoryRecord = {
      timestamp: new Date().toISOString(),
      lineageHash: context.metadata.lineageHash,
      tenantId: context.metadata.tenantId,
      cycleReference: context.metadata.cycleReference,
      postureSignals: [posture],
      vectorSignals: [primaryVector],
      contradictionSignals: contradictionTypes
    };

    return {
      requiresSync: true,
      record
    };
  }
}
