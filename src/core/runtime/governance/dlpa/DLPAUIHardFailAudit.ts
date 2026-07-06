export interface DLPAUIHardFailAuditInput {
  horizonClassification: string;
  horizonFormatted: string;
  horizonAvailable: boolean;
  recoverabilityClassification: string;
  cpsScore: number;
  cpsHorizonScore: number;
  radarStatus: string;
  capitalPreservedPercent: number;
  recoveryThesis: string;
  distributionCapacity: string;
}

export class DLPAUIHardFailAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static validate(input: DLPAUIHardFailAuditInput): 'DLPA_UI_CONSISTENT' | 'DLPA_UI_HARD_FAIL' {
    const isHorizonNotEstimable = !input.horizonAvailable || input.horizonClassification === 'Não Estimável' || input.horizonFormatted === 'Sem histórico recorrente elegível';

    // Rule 1: Horizonte ↔ CPS (horizonScore = 25 if not estimable)
    if (isHorizonNotEstimable && input.cpsHorizonScore !== 25) {
      console.error('[DLPAUIHardFailAudit FAIL] Rule 1: Horizon is not estimable, but horizonScore is not 25.');
      return 'DLPA_UI_HARD_FAIL';
    }

    // Rule 2: Horizonte ↔ Recoverability (if not estimable, recoverability is not estimable)
    if (isHorizonNotEstimable && input.recoverabilityClassification !== 'Não Estimável') {
      console.error('[DLPAUIHardFailAudit FAIL] Rule 2: Horizon is not estimable, but recoverability classification is not "Não Estimável".');
      return 'DLPA_UI_HARD_FAIL';
    }

    // Rule 3: Radar ↔ Capital Preservado (radar should reflect Capital Fragilizado for < 50%)
    if (input.capitalPreservedPercent < 50 && input.radarStatus !== 'Capital Fragilizado') {
      console.error(`[DLPAUIHardFailAudit FAIL] Rule 3: Capital preserved is ${input.capitalPreservedPercent}%, but radar status is not "Capital Fragilizado" (got "${input.radarStatus}").`);
      return 'DLPA_UI_HARD_FAIL';
    }

    // Rule 4: Recovery Thesis ↔ Distribuição (thesis should contain full retention directorship if distribution is restricted/blocked)
    const isDistributionRestricted = input.distributionCapacity === 'Restrita' || input.distributionCapacity === 'Bloqueada' || input.distributionCapacity === 'Ausente' || input.distributionCapacity === 'Ausência de Capacidade Distributiva' || input.distributionCapacity === 'Retenção por Prejuízo' || input.distributionCapacity === 'FORCED_RETENTION';
    if (isDistributionRestricted) {
      const hasRetentionGuideline = input.recoveryThesis.toLowerCase().includes('retencao') || input.recoveryThesis.toLowerCase().includes('preservacao');
      if (!hasRetentionGuideline) {
        console.error('[DLPAUIHardFailAudit FAIL] Rule 4: Distribution is restricted/blocked, but recovery thesis does not contain retention/preservation guidelines.');
        return 'DLPA_UI_HARD_FAIL';
      }
    }

    // Rule 5: Fórmula ↔ Score
    if (input.cpsScore < 34 || input.cpsScore > 38) {
      if (input.capitalPreservedPercent >= 45 && input.capitalPreservedPercent <= 50 && isHorizonNotEstimable) {
        console.error(`[DLPAUIHardFailAudit FAIL] Rule 5: Granatum 2022 score should be in [34, 38] range (got ${input.cpsScore}).`);
        return 'DLPA_UI_HARD_FAIL';
      }
    }

    return 'DLPA_UI_CONSISTENT';
  }
}
