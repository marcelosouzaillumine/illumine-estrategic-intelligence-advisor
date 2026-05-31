// src/core/runtime/recovery-regression/RecoveryStageRegressionEngine.ts

export interface StageRegressionResult {
  currentRecoveryStage: string;
  survivalModeReactivated: boolean;
  regressionSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  reactivatedConstraints: string[];
  removedAuthorizations: string[];
  regressionDrivers: string[];
}

export class RecoveryStageRegressionEngine {
  public static calculateDowngrade(
    previousStage: string,
    relapseDetected: boolean,
    stabilityScore: number
  ): StageRegressionResult {
    let newStage = previousStage;
    let survivalModeReactivated = false;
    let regressionSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let regressionDrivers: string[] = [];

    // Stage progression: SURVIVAL_MODE <- RECOVERY_MONITORING <- RECOVERY_STAGE_1_PENDING <- RECOVERY_STAGE_1 <- RECOVERY_STAGE_2 <- RECOVERY_STAGE_3 <- FULL_REAUTHORIZATION

    if (relapseDetected || stabilityScore < 30) {
      newStage = 'SURVIVAL_MODE';
      survivalModeReactivated = true;
      regressionSeverity = 'CRITICAL';
      regressionDrivers.push('DETERIORACAO_ABRUPTA_OU_RECAIDA_CRITICA');
    } else if (stabilityScore < 50) {
      // REGRESSION_RISK
      regressionSeverity = 'HIGH';
      regressionDrivers.push('RISCO_DE_REGRESSAO_ESTRUTURAL');
      if (previousStage === 'FULL_REAUTHORIZATION' || previousStage === 'RECOVERY_STAGE_3' || previousStage === 'RECOVERY_STAGE_2') {
        newStage = 'RECOVERY_STAGE_1';
      } else if (previousStage === 'RECOVERY_STAGE_1') {
        newStage = 'RECOVERY_STAGE_1_PENDING';
      } else {
        newStage = 'RECOVERY_MONITORING';
      }
    } else if (stabilityScore < 70) {
      // FRAGILE_RECOVERY
      regressionSeverity = 'MODERATE';
      regressionDrivers.push('RECUPERACAO_FRAGILIZADA_COM_PERDA_DE_RESILIENCIA');
      if (previousStage === 'FULL_REAUTHORIZATION') {
        newStage = 'RECOVERY_STAGE_3';
      } else if (previousStage === 'RECOVERY_STAGE_3') {
        newStage = 'RECOVERY_STAGE_2';
      } else if (previousStage === 'RECOVERY_STAGE_2') {
        newStage = 'RECOVERY_STAGE_1';
      }
    } else if (stabilityScore < 90) {
      // STABLE_WITH_MONITORING
      // Usually doesn't force a downgrade, but might if previously fully stable
      regressionSeverity = 'LOW';
    }

    // Determine constraints and authorizations
    let reactivatedConstraints: string[] = [];
    let removedAuthorizations: string[] = [];

    if (previousStage !== newStage) {
      if (newStage === 'SURVIVAL_MODE') {
        reactivatedConstraints = ['SURVIVAL_MODE_LOCK', 'DIVIDEND_LOCK', 'CAPEX_LOCK', 'EXPANSION_LOCK', 'HIRING_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'];
        removedAuthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION', 'CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION', 'SELECTIVE_CAPEX', 'TACTICAL_HIRING'];
      } else if (newStage === 'RECOVERY_MONITORING' || newStage === 'RECOVERY_STAGE_1_PENDING') {
        reactivatedConstraints = ['DIVIDEND_LOCK', 'CAPEX_LOCK', 'EXPANSION_LOCK', 'HIRING_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'];
        removedAuthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION', 'CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION', 'SELECTIVE_CAPEX', 'TACTICAL_HIRING'];
      } else if (newStage === 'RECOVERY_STAGE_1') {
        reactivatedConstraints = ['DIVIDEND_LOCK', 'CAPEX_LOCK', 'EXPANSION_LOCK', 'HIRING_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'];
        removedAuthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION', 'CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION', 'SELECTIVE_CAPEX', 'TACTICAL_HIRING'];
      } else if (newStage === 'RECOVERY_STAGE_2') {
        reactivatedConstraints = ['DIVIDEND_LOCK', 'EXPANSION_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'];
        removedAuthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION', 'CONTROLLED_GROWTH', 'STRATEGIC_INVESTMENT', 'TACTICAL_DISTRIBUTION'];
      } else if (newStage === 'RECOVERY_STAGE_3') {
        reactivatedConstraints = ['EXPANSION_LOCK', 'PARTNER_WITHDRAWAL_LOCK'];
        removedAuthorizations = ['NORMAL_STRATEGIC_OPERATIONS', 'CAPEX', 'DIVIDEND', 'EXPANSION'];
      }
    }

    return {
      currentRecoveryStage: newStage,
      survivalModeReactivated,
      regressionSeverity,
      reactivatedConstraints,
      removedAuthorizations,
      regressionDrivers
    };
  }
}
