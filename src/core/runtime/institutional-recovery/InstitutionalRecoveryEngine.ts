// src/core/runtime/institutional-recovery/InstitutionalRecoveryEngine.ts

import { InstitutionalRecoveryOutput, RecoveryEvaluationInput } from './RecoveryTypes';
import { RecoveryConsistencyValidationEngine } from './RecoveryConsistencyValidationEngine';
import { FalseRecoveryDetectionEngine } from './FalseRecoveryDetectionEngine';
import { InstitutionalReauthorizationEngine } from './InstitutionalReauthorizationEngine';
import { RecoveryConstraintReleaseEngine } from './RecoveryConstraintReleaseEngine';

export class InstitutionalRecoveryEngine {
  public static evaluate(input: RecoveryEvaluationInput): InstitutionalRecoveryOutput {
    const auditTrail: string[] = ['Iniciando avaliação fiduciária de recuperação institucional (IRRE).'];

    // 1. Validation of Lineage and Input Integrity
    const isLineageIncomplete = 
      !input.fiduciaryOutput?.lineageHash ||
      !input.treasuryRuntime?.treasuryLineageHash ||
      !input.cashIntelligenceRuntime?.lineageHash;
    
    // Fail-closed block
    if (isLineageIncomplete) {
      auditTrail.push('Modo fail-closed ativado: Insumos ou lineage ausentes/inválidos.');
      return {
        recoveryAuthorized: false,
        falseRecoveryDetected: false,
        activeRecoveryStage: 'RECOVERY_MONITORING',
        institutionalRecoveryConfidence: 'LOW',
        recoveryConsistencyScore: 0,
        blockedReauthorizations: ['ALL_STRATEGIC_ACTIONS'],
        allowedReauthorizations: ['CASH_PRESERVATION', 'COST_CONTAINMENT'],
        releasedConstraints: [],
        remainingConstraints: ['SURVIVAL_MODE_LOCK', 'DIVIDEND_LOCK', 'CAPEX_LOCK', 'EXPANSION_LOCK', 'HIRING_LOCK', 'STRATEGIC_INVESTMENT_LOCK', 'PARTNER_WITHDRAWAL_LOCK'],
        recoveryDrivers: [],
        falseRecoveryDrivers: ['MISSING_OR_DEGRADED_RUNTIMES'],
        longitudinalValidationStatus: 'INSUFFICIENT_HISTORY',
        treasuryRecoveryStatus: 'FRAGILE',
        patrimonialRecoveryStatus: 'ERODED',
        governanceRecoveryStatus: 'RESTRICTED',
        recoveryNarrative: 'Recuperação não autorizada devido a dados incompletos ou indisponibilidade de runtimes.',
        auditTrail,
        lineageHash: 'IRRE_FAIL_CLOSED',
        confidenceLevel: 'LOW'
      };
    }

    // 2. Validate Consistency
    const consistency = RecoveryConsistencyValidationEngine.validate(input);
    auditTrail.push(`Consistência avaliada. Score: ${consistency.consistencyScore}, Ciclos Positivos: ${consistency.consecutivePositiveCycles}, Status: ${consistency.longitudinalValidationStatus}`);

    // 3. Detect False Recovery
    const falseRecovery = FalseRecoveryDetectionEngine.detect(input);
    if (falseRecovery.falseRecoveryDetected) {
      auditTrail.push(`Falsa recuperação detectada. Fatores: ${falseRecovery.falseRecoveryDrivers.join(', ')}`);
    } else {
      auditTrail.push('Nenhum viés de otimismo ou falsa recuperação detectada.');
    }

    // 4. Evaluate Recovery Stage & Reauthorization
    let reauthorization = InstitutionalReauthorizationEngine.evaluateStage(consistency, falseRecovery.falseRecoveryDetected);
    
    // RRG Integration: Regression Override
    if (input.regressionReport?.regressionDetected) {
      auditTrail.push(`[IRRE] Regressão detectada pelo RRG. Rebaixando estágio de ${reauthorization.activeRecoveryStage} para ${input.regressionReport.currentRecoveryStage}.`);
      reauthorization.activeRecoveryStage = input.regressionReport.currentRecoveryStage;
    }

    // IRAE Integration: Resilience Override
    let confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';
    if (input.resilienceReport) {
      const resilience = input.resilienceReport.resilienceClassification;
      if (resilience === 'INSTITUTIONALLY_FRAGILE') {
        confidenceLevel = 'LOW';
        if (reauthorization.activeRecoveryStage === 'FULL_REAUTHORIZATION') {
          auditTrail.push(`[IRRE] Fragilidade institucional detectada pelo IRAE. Rebaixando FULL_REAUTHORIZATION para RECOVERY_STAGE_3.`);
          reauthorization.activeRecoveryStage = 'RECOVERY_STAGE_3';
        }
      } else if (resilience === 'ANTIFRAGILE') {
        confidenceLevel = 'HIGH';
        auditTrail.push(`[IRRE] Antifragilidade institucional detectada pelo IRAE. Confiança de estabilidade aumentada.`);
      } else if (resilience === 'ADAPTIVE' || resilience === 'RESILIENT') {
        confidenceLevel = 'HIGH';
      }
    }

    auditTrail.push(`Estágio de recuperação definido: ${reauthorization.activeRecoveryStage}`);

    // 5. Release Constraints
    const constraints = RecoveryConstraintReleaseEngine.evaluateConstraints(reauthorization.activeRecoveryStage, consistency.consistencyScore);
    auditTrail.push(`Restrições liberadas: ${constraints.releasedConstraints.length}, Restantes: ${constraints.remainingConstraints.length}`);

    // Final authorization check: exit from survival mode is only allowed if stage is >= RECOVERY_STAGE_1
    const recoveryAuthorized = 
      !falseRecovery.falseRecoveryDetected && 
      (reauthorization.activeRecoveryStage === 'RECOVERY_STAGE_1' || 
       reauthorization.activeRecoveryStage === 'RECOVERY_STAGE_2' || 
       reauthorization.activeRecoveryStage === 'RECOVERY_STAGE_3' || 
       reauthorization.activeRecoveryStage === 'FULL_REAUTHORIZATION');

    if (recoveryAuthorized) {
      auditTrail.push('Saída do modo de sobrevivência fiduciária autorizada pelo IRRE.');
    } else {
      auditTrail.push('Saída do modo de sobrevivência bloqueada pelo IRRE.');
    }

    // Narrative
    let recoveryNarrative = '';
    if (!recoveryAuthorized) {
      if (reauthorization.activeRecoveryStage === 'RECOVERY_MONITORING') {
        recoveryNarrative = 'Recuperação em estágio inicial de monitoramento. Necessário consolidar geração de caixa sustentável antes de reautorizar crescimento.';
      } else if (reauthorization.activeRecoveryStage === 'RECOVERY_STAGE_1_PENDING') {
        recoveryNarrative = 'Recuperação parcial. Exige validação longitudinal completa para autorizar saída do modo de sobrevivência.';
      } else {
        recoveryNarrative = 'Recuperação institucional não validada fiduciariamente. Manutenção mandatória do foco em sobrevivência e estabilização estrutural.';
      }
    } else {
      if (reauthorization.activeRecoveryStage === 'FULL_REAUTHORIZATION') {
        recoveryNarrative = 'Reautorização institucional completa concedida. Consistência longitudinal validada.';
      } else {
        recoveryNarrative = `Recuperação autorizada progressivamente (${reauthorization.activeRecoveryStage}). Otimização em andamento.`;
      }
    }

    // Lineage Hash
    const rawLineage = `${input.fiduciaryOutput.lineageHash}_${input.treasuryRuntime.treasuryLineageHash}_${reauthorization.activeRecoveryStage}_${consistency.consistencyScore}`;
    let hash = 0;
    for (let i = 0; i < rawLineage.length; i++) {
      hash = (hash << 5) - hash + rawLineage.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = `IRRE_VAL_${Math.abs(hash).toString(16).toUpperCase()}`;

    let remainingConstraints = constraints.remainingConstraints;
    let releasedConstraints = constraints.releasedConstraints;
    let allowedReauthorizations = reauthorization.allowedReauthorizations;
    let blockedReauthorizations = reauthorization.blockedReauthorizations;
    let institutionalRecoveryConfidence: 'LOW' | 'MODERATE' | 'HIGH' = falseRecovery.falseRecoveryDetected ? 'LOW' : (consistency.consistencyScore >= 60 ? 'HIGH' : 'MODERATE');

    if (input.regressionReport?.regressionDetected) {
      // Reactivate constraints progressively
      const rrg = input.regressionReport;
      remainingConstraints = [...new Set([...remainingConstraints, ...rrg.reactivatedConstraints])];
      releasedConstraints = releasedConstraints.filter(c => !rrg.reactivatedConstraints.includes(c));
      allowedReauthorizations = allowedReauthorizations.filter(a => !rrg.removedAuthorizations.includes(a));
      blockedReauthorizations = [...new Set([...blockedReauthorizations, ...rrg.removedAuthorizations])];
      institutionalRecoveryConfidence = 'LOW'; // Reduce recovery confidence
    }

    return {
      recoveryAuthorized,
      falseRecoveryDetected: falseRecovery.falseRecoveryDetected || (input.regressionReport?.relapseDetected ?? false),
      activeRecoveryStage: reauthorization.activeRecoveryStage,
      institutionalRecoveryConfidence,
      recoveryConsistencyScore: consistency.consistencyScore,
      blockedReauthorizations,
      allowedReauthorizations,
      releasedConstraints,
      remainingConstraints,
      recoveryDrivers: [`CICLOS_POSITIVOS_${consistency.consecutivePositiveCycles}`], // basic for now
      falseRecoveryDrivers: falseRecovery.falseRecoveryDrivers,
      longitudinalValidationStatus: consistency.longitudinalValidationStatus,
      treasuryRecoveryStatus: consistency.treasuryRecoveryStatus,
      patrimonialRecoveryStatus: consistency.patrimonialRecoveryStatus,
      governanceRecoveryStatus: consistency.governanceRecoveryStatus,
      recoveryNarrative,
      auditTrail,
      lineageHash: String(Math.abs(hash)),
      confidenceLevel
    };
  }
}
