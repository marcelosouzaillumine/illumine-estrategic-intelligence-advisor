// src/core/runtime/recovery-regression/RecoveryRegressionGuardEngine.ts

import { RecoveryRegressionOutput, RegressionEvaluationInput } from './RecoveryRegressionTypes';
import { RecoveryStabilityMonitoringEngine } from './RecoveryStabilityMonitoringEngine';
import { RecoveryRelapseDetectionEngine } from './RecoveryRelapseDetectionEngine';
import { RecoveryStageRegressionEngine } from './RecoveryStageRegressionEngine';

export class RecoveryRegressionGuardEngine {
  public static evaluate(input: RegressionEvaluationInput): RecoveryRegressionOutput {
    let failClosedTriggered = false;
    let auditTrail: string[] = [];
    
    auditTrail.push('[RRG] Iniciando validação soberana de regressão de recuperação.');

    if (!input.recoveryReport || !input.recoveryReport.activeRecoveryStage) {
      failClosedTriggered = true;
      auditTrail.push('[RRG] [FAIL-CLOSED] Contexto IRRE ausente. Regressão assumida.');
      return this.generateFailClosedOutput(auditTrail);
    }

    const previousRecoveryStage = input.recoveryReport.activeRecoveryStage;

    if (previousRecoveryStage === 'SURVIVAL_MODE') {
      auditTrail.push('[RRG] Operação já encontra-se em SURVIVAL_MODE. Não há regressão adicional aplicável.');
      return {
        regressionDetected: false,
        relapseDetected: false,
        previousRecoveryStage,
        currentRecoveryStage: 'SURVIVAL_MODE',
        survivalModeReactivated: false, // Already in survival
        recoveryStabilityScore: 0,
        regressionSeverity: 'LOW',
        regressionDrivers: [],
        relapseDrivers: [],
        reactivatedConstraints: [],
        removedAuthorizations: [],
        treasuryRegressionStatus: 'CRITICAL',
        patrimonialRegressionStatus: 'SEVERELY_ERODED',
        continuityRegressionStatus: 'CRITICAL',
        narrativeDowngrades: [],
        recoveryNarrativeAdjustment: '',
        failClosedTriggered: false,
        auditTrail,
        lineageHash: 'RRG_SKIP_' + Date.now(),
        confidenceLevel: 'HIGH'
      };
    }

    // 1. Stability Monitoring
    const stabilityResult = RecoveryStabilityMonitoringEngine.monitor(input);
    let adjustedStabilityScore = stabilityResult.recoveryStabilityScore;

    if (input.resilienceReport) {
      const resilience = input.resilienceReport.resilienceClassification;
      if (resilience === 'INSTITUTIONALLY_FRAGILE') {
        // High sensitivity to regression: penalize stability score
        adjustedStabilityScore = Math.max(0, adjustedStabilityScore - 15);
        auditTrail.push(`[RRG] Fragilidade institucional detectada (IRAE). Sensibilidade de regressão ativada. (Score ajustado de ${stabilityResult.recoveryStabilityScore} para ${adjustedStabilityScore})`);
      } else if (resilience === 'ANTIFRAGILE' || resilience === 'ADAPTIVE') {
        // Lower sensitivity to minor anomalies (dampening factor)
        adjustedStabilityScore = Math.min(100, adjustedStabilityScore + 10);
        auditTrail.push(`[RRG] Antifragilidade/Maturidade adaptativa detectada (IRAE). Sensibilidade de regressão reduzida. (Score ajustado para ${adjustedStabilityScore})`);
      }
    } else {
      auditTrail.push(`[RRG] Stability Score calculado: ${stabilityResult.recoveryStabilityScore} (${stabilityResult.stabilityClassification})`);
    }

    // 2. Relapse Detection
    const relapseResult = RecoveryRelapseDetectionEngine.detect(input);
    if (relapseResult.relapseDetected) {
      auditTrail.push(`[RRG] Recaída(s) detectada(s): ${relapseResult.relapseDrivers.join(', ')}`);
    }

    // 3. Stage Regression
    const stageRegressionResult = RecoveryStageRegressionEngine.calculateDowngrade(
      previousRecoveryStage,
      relapseResult.relapseDetected,
      adjustedStabilityScore
    );

    const regressionDetected = previousRecoveryStage !== stageRegressionResult.currentRecoveryStage;

    let narrativeDowngrades: string[] = [];
    let recoveryNarrativeAdjustment = '';
    
    if (regressionDetected) {
      auditTrail.push(`[RRG] Regressão de estágio decretada: ${previousRecoveryStage} -> ${stageRegressionResult.currentRecoveryStage}`);
      narrativeDowngrades.push('recuperação consolidada', 'crescimento sustentável', 'estabilidade restaurada');
      recoveryNarrativeAdjustment = 'recaída institucional detectada com reativação de restrições prudenciais';
    } else {
      auditTrail.push(`[RRG] Estágio de recuperação validado e mantido: ${previousRecoveryStage}`);
    }

    return {
      regressionDetected,
      relapseDetected: relapseResult.relapseDetected,
      previousRecoveryStage,
      currentRecoveryStage: stageRegressionResult.currentRecoveryStage,
      survivalModeReactivated: stageRegressionResult.survivalModeReactivated,
      recoveryStabilityScore: adjustedStabilityScore,
      regressionSeverity: stageRegressionResult.regressionSeverity,
      regressionDrivers: stageRegressionResult.regressionDrivers,
      relapseDrivers: relapseResult.relapseDrivers,
      reactivatedConstraints: stageRegressionResult.reactivatedConstraints,
      removedAuthorizations: stageRegressionResult.removedAuthorizations,
      treasuryRegressionStatus: stabilityResult.treasuryRegressionStatus,
      patrimonialRegressionStatus: stabilityResult.patrimonialRegressionStatus,
      continuityRegressionStatus: stabilityResult.continuityRegressionStatus,
      narrativeDowngrades,
      recoveryNarrativeAdjustment,
      failClosedTriggered: false,
      auditTrail,
      lineageHash: 'RRG_' + Date.now(),
      confidenceLevel: regressionDetected ? 'LOW' : 'HIGH' // permanent confidence reduction logic could be refined with longitudinal memory
    };
  }

  private static generateFailClosedOutput(auditTrail: string[]): RecoveryRegressionOutput {
    return {
      regressionDetected: true,
      relapseDetected: true,
      previousRecoveryStage: 'UNKNOWN',
      currentRecoveryStage: 'SURVIVAL_MODE',
      survivalModeReactivated: true,
      recoveryStabilityScore: 0,
      regressionSeverity: 'CRITICAL',
      regressionDrivers: ['FAIL_CLOSED_REGRESSION_ASSUMED'],
      relapseDrivers: ['CONTEXTO_INCOMPLETO'],
      reactivatedConstraints: ['SURVIVAL_MODE_LOCK', 'DIVIDEND_LOCK', 'CAPEX_LOCK', 'EXPANSION_LOCK', 'HIRING_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'],
      removedAuthorizations: ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION', 'CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION', 'SELECTIVE_CAPEX', 'TACTICAL_HIRING'],
      treasuryRegressionStatus: 'CRITICAL',
      patrimonialRegressionStatus: 'SEVERELY_ERODED',
      continuityRegressionStatus: 'CRITICAL',
      narrativeDowngrades: ['recuperação consolidada', 'crescimento sustentável', 'estabilidade restaurada'],
      recoveryNarrativeAdjustment: 'necessidade de estabilização corretiva devido a ausência de contexto fiduciário',
      failClosedTriggered: true,
      auditTrail,
      lineageHash: 'RRG_FAIL_CLOSED_' + Date.now(),
      confidenceLevel: 'LOW'
    };
  }
}
