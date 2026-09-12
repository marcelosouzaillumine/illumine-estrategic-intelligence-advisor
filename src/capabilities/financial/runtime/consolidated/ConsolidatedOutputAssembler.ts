import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { ConsolidatedConfidence, ConsolidatedViolation, EliminatedValueRecord, EntityLineageNode } from './consolidated-types';
import { resolveConsolidatedConfidence } from './EntityScopedConfidenceResolver';
import { propagateViolations } from './ConsolidatedViolationPropagator';
import { IntercompanyEliminationResult } from './IntercompanyEliminationEngine';
import { SystemicRiskProfile } from './stress/stress-types';

export class ConsolidatedOutputAssembler {
  
  public assemble(
    groupId: string | undefined,
    reportsMap: Map<string, ExecutiveIntelligenceReport>,
    eliminationResult?: IntercompanyEliminationResult,
    stressProfile?: SystemicRiskProfile
  ): ExecutiveIntelligenceReport {
    
    // Fallback: If only one report, we just return it (already handled by Orchestrator, but safe here)
    if (reportsMap.size === 1) {
      return Array.from(reportsMap.values())[0];
    }

    // Determine base report to inherit the structure from (e.g. holding or the last processed)
    // For this phase, we take the first available report as the structural baseline.
    // In Phase 3, a clean generic group report will be instantiated.
    let baseReport = Array.from(reportsMap.values())[reportsMap.size - 1]; // Assume Holding is last

    // 1. Gather Confidences
    const confidences: Record<string, 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'> = {};
    for (const [entityId, report] of reportsMap.entries()) {
      // Dummy rule for the phase: extract from severity or context
      const isHigh = report.severity.level === 'SAUDÁVEL';
      const isLow = report.severity.level === 'CRÍTICO' || report.severity.level === 'COLAPSO';
      confidences[entityId] = isHigh ? 'HIGH_CONFIDENCE' : (isLow ? 'LOW_CONFIDENCE' : 'MEDIUM_CONFIDENCE');
    }

    const resolvedConfidence = resolveConsolidatedConfidence(confidences);

    // 2. Gather Violations
    const violationsByEntity: Record<string, ConsolidatedViolation[]> = {};
    for (const [entityId, report] of reportsMap.entries()) {
      const v: ConsolidatedViolation[] = [];
      if (report.severity.level === 'CRÍTICO' || report.severity.level === 'COLAPSO') {
        v.push({
          violationId: `v-${entityId}-sev`,
          severity: 'CRITICAL',
          sourceEntityId: entityId,
          propagatedToGroup: true,
          description: `Severidade sistêmica atingiu nível crítico: ${report.severity.level}`
        });
      }
      violationsByEntity[entityId] = v;
    }

    const propagatedViolations = propagateViolations(violationsByEntity);

    // 3. Eliminated Values Warning (se não houver eliminationResult)
    const eliminatedValues: EliminatedValueRecord[] = eliminationResult?.eliminatedEntries || [];
    if (!eliminationResult) {
       console.warn(`[ConsolidatedOutputAssembler] Eliminação intercompany ainda não aplicada nesta fase para o grupo ${groupId}`);
    }

    // Create the final consolidated wrapper
    const consolidatedReport: ExecutiveIntelligenceReport = {
      ...baseReport,
      groupId,
      consolidationScope: 'FULL',
      reportingBoundary: 'GROUP_LEVEL',
      confidenceByEntity: resolvedConfidence.confidenceByEntity,
      violationsByEntity,
      lineage: {}, // To be populated by LineageResolver later
      consolidationPath: Array.from(reportsMap.keys()).map(id => ({ entityId: id, role: 'Subsidiary', contributionPercentage: 0 } as EntityLineageNode)),
      eliminatedValues,
      eliminatedEntries: eliminationResult?.eliminatedEntries,
      unreconciledIntercompany: eliminationResult?.unreconciledIntercompany,
      eliminationConfidence: eliminationResult?.eliminationConfidence,
      eliminationWarnings: eliminationResult?.eliminationWarnings,
      consolidationAdjustments: eliminationResult?.consolidationAdjustments,
      systemicRiskProfile: stressProfile,
      // Overriding standard fields to show it's a consolidated view
      severity: {
         level: baseReport.severity.level,
         justification: `[CONSOLIDATED VIEW] ${baseReport.severity.justification}`
      }
    };

    return consolidatedReport;
  }
}
