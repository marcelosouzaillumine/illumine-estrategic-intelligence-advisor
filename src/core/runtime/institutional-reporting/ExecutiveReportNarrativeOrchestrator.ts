// src/core/runtime/institutional-reporting/ExecutiveReportNarrativeOrchestrator.ts

import { InstitutionalStrategicIntelligenceOutput } from '../strategic-intelligence/strategic-intelligence-types';
import { InstitutionalOperationalGovernanceOutput } from '../operational-governance/operational-governance-types';
import { InstitutionalExecutiveCommandOutput } from '../executive-command/executive-command-types';
import { TreasuryIntelligenceRuntimeOutput } from '../treasury-intelligence/types';

/**
 * Camada soberana de textualização institucional.
 * Sem IA generativa. Sem inferência psicológica.
 * Utiliza templates determinísticos ("semantic bands") para evitar oscilação textual
 * entre deltas matemáticos insignificantes.
 */
export class ExecutiveReportNarrativeOrchestrator {
  
  public static generateExecutiveSummary(context: {
    strategic: InstitutionalStrategicIntelligenceOutput;
    governance: InstitutionalOperationalGovernanceOutput;
    treasury?: TreasuryIntelligenceRuntimeOutput;
    hasSurvivalMode: boolean;
  }): string {
    
    const { strategic, governance, treasury, hasSurvivalMode } = context;
    
    // Fail-Closed Fallback
    if (strategic.posture === 'UNVERIFIABLE_POSTURE') {
      return 'Institutional direction unverifiable due to insufficient longitudinal data. Operating in fail-closed defensive mode.';
    }

    if (hasSurvivalMode) {
      return `Critical Intervention Active: Institution is operating under Survival Mode. Strategic posture forcibly aligned to ${strategic.posture.replace('_POSTURE', '')} to preserve continuity.`;
    }

    const postureText = this.getPostureText(strategic.posture);
    const treasuryText = treasury?.severity === 'STRESSED' || treasury?.severity === 'CRITICAL' 
      ? 'under severe capital pressure' 
      : 'with stable capital foundations';
      
    const executionText = governance.executionIntegrity.status === 'EXECUTION_UNDER_STRAIN' 
      ? 'Execution integrity is currently unstable, requiring governance intervention.' 
      : 'Execution integrity is sustained.';

    return `The institution exhibits a ${postureText} direction, operating ${treasuryText}. ${executionText} Directional trajectory remains ${strategic.trajectory.replace('TRAJECTORY_', '').toLowerCase()}.`;
  }

  private static getPostureText(posture: string): string {
    switch(posture) {
      case 'EXPANSION_POSTURE': return 'structurally expansive';
      case 'PRESERVATION_POSTURE': return 'capital preservation';
      case 'STABILIZATION_POSTURE': return 'operational stabilization';
      case 'RESTRICTION_POSTURE': return 'structurally restricted';
      case 'CONTINUITY_POSTURE': return 'continuity-focused';
      default: return 'unverifiable';
    }
  }

}
