// src/lib/governance-copilot-conflict-engine.ts

import type { GovernanceCopilotReasoningInput, GovernanceCopilotConflict } from './governance-copilot-reasoning-types';

export class GovernanceCopilotConflictEngine {
  /**
   * Detects deterministic contradictions across intelligence layers.
   */
  static detectConflicts(input: GovernanceCopilotReasoningInput): GovernanceCopilotConflict[] {
    if (!input) return [];

    const conflicts: GovernanceCopilotConflict[] = [];

    const vil = input.valuationIntelligence;
    const gdt = input.governanceDigitalTwin;
    const esg = input.esgIntelligence;
    const gin = input.governanceIntelligenceNetwork;
    const esl = input.executiveSovereignty;
    const iod = input.institutionalOutcomes;
    const cail = input.capitalAllocationIntelligence;

    // Conflict Type 1: Valuation Readiness = HIGH AND Execution Capacity = LOW
    if (vil && gdt && gdt.executionCapacity) {
      const isValuationHigh = vil.valuationReadiness === 'HIGH';
      const isExecutionLow = gdt.executionCapacity.classification === 'LOW';
      if (isValuationHigh && isExecutionLow) {
        conflicts.push({
          conflictId: `CONFLICT-1-${Date.now()}`,
          description: 'High valuation readiness conflicts with low execution capacity.',
          severity: 'HIGH',
          layersInvolved: ['VIL', 'GDT']
        });
      }
    }

    // Conflict Type 2: ESG Governance = HIGH AND Governance Friction = HIGH
    // For simplicity, we check if ESG Governance score > 80, and GIN has multiple governance frictions
    if (esg && gin && gin.governanceFrictions) {
      const isEsgGovernanceHigh = esg.governance && esg.governance.score > 80;
      const isFrictionHigh = gin.governanceFrictions.length > 2;
      if (isEsgGovernanceHigh && isFrictionHigh) {
        conflicts.push({
          conflictId: `CONFLICT-2-${Date.now()}`,
          description: 'High ESG Governance score conflicts with high volume of internal governance friction.',
          severity: 'MODERATE',
          layersInvolved: ['ESG', 'GIN']
        });
      }
    }

    // Conflict Type 3: Sovereignty Classification = ADVANCED AND Repeated Execution Failures = TRUE
    if (esl && iod && iod.learningPatterns) {
      const isAdvanced = esl.sovereigntyClassification === 'ADVANCED' || esl.sovereigntyClassification === 'SOVEREIGN';
      const hasExecutionFailures = iod.learningPatterns.some((p: any) => p.type === 'EXECUTION_FAILURE' && p.frequency > 2);
      if (isAdvanced && hasExecutionFailures) {
        conflicts.push({
          conflictId: `CONFLICT-3-${Date.now()}`,
          description: 'Sovereignty classification is ADVANCED, but there are repeated execution failures in the outcomes database.',
          severity: 'CRITICAL',
          layersInvolved: ['ESL', 'IOD']
        });
      }
    }

    // Conflict Type 4: Capital Allocation Priority = HIGH AND Institutional Outcomes = baixa taxa de execução
    if (cail && iod && iod.conversionMetrics) {
      // heuristic: capital allocation indicates HIGH priority for expansion (e.g. strategic or execution priorities exist), but conversion rate is low
      const isCailHigh = (cail.strategicInvestmentPriorities && cail.strategicInvestmentPriorities.length > 0) || 
                         (cail.executionAccelerationPriorities && cail.executionAccelerationPriorities.length > 0);
      const lowExecution = iod.conversionMetrics.decisionToActionRate < 0.5; // less than 50% decisions become actions
      
      if (isCailHigh && lowExecution) {
        conflicts.push({
          conflictId: `CONFLICT-4-${Date.now()}`,
          description: 'Capital Allocation Priority/Efficiency is HIGH, but Institutional Outcomes show low execution conversion rate.',
          severity: 'HIGH',
          layersInvolved: ['CAIL', 'IOD']
        });
      }
    }

    // Conflict Type 5: ESL = SOVEREIGN AND IOD = poucos resultados comprovados
    if (esl && iod && iod.conversionMetrics) {
      const isSovereign = esl.sovereigntyClassification === 'SOVEREIGN';
      const fewResults = iod.conversionMetrics.totalOutcomes < 2; // VERY few E5s
      
      if (isSovereign && fewResults) {
        conflicts.push({
          conflictId: `CONFLICT-5-${Date.now()}`,
          description: 'Sovereignty Classification is SOVEREIGN, but there is scarce documented evidence of institutional outcomes.',
          severity: 'CRITICAL',
          layersInvolved: ['ESL', 'IOD']
        });
      }
    }

    return conflicts;
  }
}
