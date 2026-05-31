// src/core/runtime/recovery-regression/RecoveryRelapseDetectionEngine.ts

import { RegressionEvaluationInput } from './RecoveryRegressionTypes';

export interface RelapseDetectionResult {
  relapseDetected: boolean;
  relapseDrivers: string[];
}

export class RecoveryRelapseDetectionEngine {
  public static detect(input: RegressionEvaluationInput): RelapseDetectionResult {
    const relapseDrivers: string[] = [];
    
    const fco = input.fco ?? 0;
    const runway = input.cashIntelligenceRuntime?.continuityRisk?.projectedRunwayMonths ?? 12;
    const isTreasuryStressed = input.treasuryRuntime?.severity === 'CRITICAL' || input.treasuryRuntime?.severity === 'HIGH';
    const patrimonialStatus = input.fiduciaryOutput?.patrimonialIntegrityStatus;
    const retentionClassification = input.fiduciaryOutput?.retentionClassification;
    
    if (fco < 0) {
      relapseDrivers.push('RETORNO_FCO_NEGATIVO');
    }

    if (runway < 3) {
      relapseDrivers.push('RUNWAY_COLAPSO_CRITICO');
    }

    if (isTreasuryStressed) {
      relapseDrivers.push('ESCALADA_ESTRESSE_TESOURARIA');
    }

    if (patrimonialStatus === 'SEVERELY_ERODED' || patrimonialStatus === 'CAPITAL_COLLAPSE_RISK') {
      relapseDrivers.push('EROSAO_PATRIMONIAL_RECORRENTE');
    } else if (patrimonialStatus === 'PRESSURED' && input.recoveryReport?.patrimonialRecoveryStatus === 'RECOVERED') {
      // It deteriorated from recovered to pressured
      relapseDrivers.push('DETERIORACAO_INDICE_PRESERVACAO');
    }

    if (retentionClassification === 'FORCED_RETENTION') {
      relapseDrivers.push('RETORNO_RETENCAO_FORCADA');
    } else if (retentionClassification === 'EMERGENCY_RETENTION') {
      relapseDrivers.push('RETORNO_RETENCAO_EMERGENCIA');
    }

    // Checking longitudinal fragility
    const hasLongitudinalFragility = input.longitudinalRuntimeHistory && input.longitudinalRuntimeHistory.some(h => h.fco < 0 || h.runway < 3);
    if (hasLongitudinalFragility && fco < 0) {
      relapseDrivers.push('FRAGILIDADE_INSTITUCIONAL_LONGITUDINAL');
    }

    const hasCriticalWarnings = input.fiduciaryOutput?.warnings?.length > 0;
    if (hasCriticalWarnings) {
      relapseDrivers.push('RETORNO_ALERTAS_CRITICOS_FIDUCIARIOS');
    }

    return {
      relapseDetected: relapseDrivers.length > 0,
      relapseDrivers
    };
  }
}
