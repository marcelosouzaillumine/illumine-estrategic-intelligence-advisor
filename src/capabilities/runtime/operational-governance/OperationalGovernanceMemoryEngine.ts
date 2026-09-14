// src/core/runtime/operational-governance/OperationalGovernanceMemoryEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { InstitutionalOperationalGovernanceOutput, OperationalGovernanceMemoryDelta } from './operational-governance-types';

export class OperationalGovernanceMemoryEngine {
  static generatePersistenceDelta(
    context: OperationalEvaluationContext,
    output: Partial<InstitutionalOperationalGovernanceOutput>
  ): OperationalGovernanceMemoryDelta | null {
    if (context.historicalCyclesCount < 2) {
      return null;
    }

    // Calcular recorrência sem inferência subjetiva.
    // Baseado estritamente no volume de strains e atritos medidos no ciclo atual.
    // Numa implementação plena, isso leria o histórico anterior também.
    let recurrenceSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    const frictionCount = output.frictions?.length || 0;
    
    if (output.executionIntegrity?.status.includes('STRAIN') && frictionCount > 1) {
      recurrenceSeverity = 'CRITICAL';
    } else if (frictionCount > 0 || output.executionIntegrity?.status === 'EXECUTION_PRESSURED') {
      recurrenceSeverity = 'HIGH';
    }

    return {
      timestamp: new Date().toISOString(),
      tenantId: context.tenantId,
      lineageHash: context.lineageHash,
      operationalRecurrenceSeverity: recurrenceSeverity,
      frictionEventsRecorded: frictionCount
    };
  }
}
