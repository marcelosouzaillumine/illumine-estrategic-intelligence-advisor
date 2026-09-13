// src/core/runtime/institutional-reporting/ExecutiveReportNarrativeOrchestrator.ts

import { InstitutionalStrategicIntelligenceOutput } from '../strategic-intelligence/strategic-intelligence-types';
import { InstitutionalOperationalGovernanceOutput } from '../operational-governance/operational-governance-types';
import { InstitutionalExecutiveCommandOutput } from '../../../core/runtime/executive-command';
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
    longitudinal?: import('../../../capabilities/financial/runtime/cash-intelligence/CashIntelligenceTypes').LongitudinalCashIntelligenceOutput;
    constitutionalStatus?: string;
  }): string {
    
    const { strategic, governance, treasury, hasSurvivalMode, longitudinal, constitutionalStatus } = context;
    
    // Fail-Closed Fallback
    if (strategic.posture === 'UNVERIFIABLE_POSTURE') {
      return 'Institutional direction unverifiable due to insufficient longitudinal data. Operating in fail-closed defensive mode.';
    }

    if (hasSurvivalMode) {
      return `Critical Intervention Active: Institution is operating under Survival Mode. Strategic posture forcibly aligned to ${strategic.posture.replace('_POSTURE', '')} to preserve continuity.`;
    }

    const postureText = this.getPostureText(strategic.posture);
    const treasuryText = treasury?.severity === 'HIGH' || treasury?.severity === 'CRITICAL' 
      ? 'under severe capital pressure' 
      : 'with stable capital foundations';
      
    const executionText = governance.executionIntegrity.status === 'EXECUTION_UNDER_STRAIN' 
      ? 'Execution integrity is currently unstable, requiring governance intervention.' 
      : 'Execution integrity is sustained.';

    let baseText = `The institution exhibits a ${postureText} direction, operating ${treasuryText}. ${executionText} Directional trajectory remains ${strategic.trajectory.replace('TRAJECTORY_', '').toLowerCase()}.`;
    
    // Inject Longitudinal Answers
    if (longitudinal && longitudinal.trajectoryClassification !== 'INSUFFICIENT_HISTORICAL_DATA') {
      const isFake = longitudinal.trajectoryClassification === 'ARTIFICIAL_TURNAROUND' || longitudinal.trajectoryClassification === 'CHRONIC_DEPENDENCY';
      if (isFake) {
        baseText += ` IMPORTANTE: A melhora de liquidez recente tem origem em fontes externas, mascarando uma dependência crônica. Há alto risco de recidiva operacional.`;
      } else if (longitudinal.trajectoryClassification === 'REAL_RECOVERY' || longitudinal.trajectoryClassification === 'STRUCTURAL_IMPROVEMENT') {
        baseText += ` Evidencia-se uma recuperação real ancorada na própria operation, com estabilização autêntica de liquidez.`;
      } else if (longitudinal.trajectoryClassification === 'PROGRESSIVE_DETERIORATION') {
        baseText += ` Alerta: A deterioração de caixa está acelerando, comprometendo progressivamente o runway da companhia.`;
      } else {
        baseText += ` A trajetória apresenta volatilidade ou estabilidade não conclusiva, exigindo monitoramento fiduciário contínuo.`;
      }
    }

    let finalSummary = baseText;
    if (longitudinal && (longitudinal.trajectoryClassification === 'ARTIFICIAL_TURNAROUND' || longitudinal.trajectoryClassification === 'CHRONIC_DEPENDENCY')) {
      finalSummary = this.sanitizeProhibitedWords(baseText);
    }

    const isApproved = constitutionalStatus === 'APPROVED' || constitutionalStatus === 'CONSTITUTIONALLY_STABLE';
    return this.sanitizeConstitutionalWords(finalSummary, isApproved);
  }

  public static sanitizeConstitutionalWords(text: string, isApproved: boolean): string {
    if (isApproved) return text;
    
    return text
      .replace(/governance maturity/gi, 'governance validation pending')
      .replace(/sustainable growth/gi, 'fiduciary confidence reduced')
      .replace(/operational resilience/gi, 'constitutional restriction active')
      .replace(/institutional robustness/gi, 'fiduciary confidence reduced')
      .replace(/strategic consistency/gi, 'governance validation pending')
      .replace(/fiduciary robustness/gi, 'fiduciary confidence reduced')
      .replace(/constitutional alignment/gi, 'governance validation pending')
      .replace(/execution excellence/gi, 'operational claims restricted')
      // Portuguese equivalents
      .replace(/maturidade de governança/gi, 'validação de governança pendente')
      .replace(/crescimento sustentável/gi, 'confiança fiduciária reduzida')
      .replace(/resiliência operacional/gi, 'restrição constitucional ativa')
      .replace(/robustez institucional/gi, 'confiança fiduciária reduzida')
      .replace(/consistência estratégica/gi, 'validação de governança pendente')
      .replace(/robustez fiduciária/gi, 'confiança fiduciária reduzida')
      .replace(/alinhamento constitucional/gi, 'validação de governança pendente')
      .replace(/excelência de execução/gi, 'reivindicações operacionais restritas');
  }

  private static sanitizeProhibitedWords(text: string): string {
    return text
      .replace(/crescimento sustentável/gi, 'alívio temporário')
      .replace(/expansão saudável/gi, 'melhora financiada externamente')
      .replace(/recuperação consolidada/gi, 'recuperação não comprovada')
      .replace(/liquidez robusta/gi, 'liquidez artificial')
      .replace(/tesouraria forte/gi, 'dependência recorrente')
      .replace(/turnaround comprovado/gi, 'risco de recidiva');
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
