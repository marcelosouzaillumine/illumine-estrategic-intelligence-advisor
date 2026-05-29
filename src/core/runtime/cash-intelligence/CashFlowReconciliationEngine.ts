import { CashFlowReconciliationOutput, TemporalReconciliationSeverity } from './CashIntelligenceTypes';

export class CashFlowReconciliationEngine {
  /**
   * Reconcilia a variação líquida da DFC (FCO + FCI + FCF) com o saldo final de caixa do Balanço Patrimonial (BP).
   */
  public static validate(
    dfcData: any[],
    dreNetIncome: number,
    bpCashEquivalentsStart: number,
    bpCashEquivalentsEnd: number,
    fco: number,
    fci: number,
    fcf: number
  ): CashFlowReconciliationOutput {
    const isMissing = !dfcData || dfcData.length === 0;

    if (isMissing) {
      return {
        isReconcilable: false,
        variancePercentage: 1.0,
        confidence: 'RESTRICTED',
        reconciliationStatus: 'RESTRICTED',
        temporalSeverity: 'CRITICAL',
        alerts: ['STRUCTURAL_DIVERGENCE', 'AUDIT_REQUIRED', 'ALERTA_FIDUCIARIO_RECONCILIACAO'],
        disclosures: ['DFC ausente. Análises fiduciárias de geração e consumo de caixa estão restritas.'],
        restrictsOptimisticInterpretations: true
      };
    }

    const bpCashVariation = bpCashEquivalentsEnd - bpCashEquivalentsStart;
    const dfcNetCashFlow = fco + fci + fcf;

    let variancePercentage = 0;
    const maxVariation = Math.max(Math.abs(bpCashVariation), 1);
    variancePercentage = Math.abs(dfcNetCashFlow - bpCashVariation) / maxVariation;

    let temporalSeverity: TemporalReconciliationSeverity = 'LOW';
    let reconciliationStatus: 'RECONCILED' | 'ALLOWED_WITH_DISCLOSURE' | 'RESTRICTED' | 'BLOCKED' = 'RECONCILED';
    let confidence: 'HIGH' | 'MODERATE' | 'RESTRICTED' | 'BLOCKED' = 'HIGH';
    const alerts: string[] = [];
    const disclosures: string[] = [];

    // Temporal Reconciliation Severity and Status mapping
    if (variancePercentage < 0.02) {
      temporalSeverity = 'LOW';
      reconciliationStatus = 'RECONCILED';
      confidence = 'HIGH';
    } else if (variancePercentage <= 0.05) {
      temporalSeverity = 'MEDIUM';
      reconciliationStatus = 'ALLOWED_WITH_DISCLOSURE';
      confidence = 'MODERATE';
      alerts.push('ALERTA_FIDUCIARIO_RECONCILIACAO');
      disclosures.push(`Divergência imaterial (${(variancePercentage * 100).toFixed(2)}%) entre BP e DFC identificada. Integridade aceitável.`);
    } else if (variancePercentage <= 0.10) {
      temporalSeverity = 'HIGH';
      reconciliationStatus = 'RESTRICTED';
      confidence = 'RESTRICTED';
      alerts.push('ALERTA_FIDUCIARIO_RECONCILIACAO', 'STRUCTURAL_DIVERGENCE', 'LONGITUDINAL_VALIDATION_REQUIRED');
      disclosures.push(`Divergência relevante (${(variancePercentage * 100).toFixed(2)}%) na reconciliação de caixa. Análises fiduciárias rebaixadas.`);
    } else {
      temporalSeverity = 'CRITICAL';
      reconciliationStatus = 'BLOCKED';
      confidence = 'BLOCKED';
      alerts.push('ALERTA_FIDUCIARIO_RECONCILIACAO', 'STRUCTURAL_DIVERGENCE', 'AUDIT_REQUIRED', 'LONGITUDINAL_VALIDATION_REQUIRED');
      disclosures.push(`Divergência crítica e inconciliável (${(variancePercentage * 100).toFixed(2)}%) entre BP e DFC.`);
    }

    const isReconcilable = reconciliationStatus === 'RECONCILED' || reconciliationStatus === 'ALLOWED_WITH_DISCLOSURE';
    const restrictsOptimisticInterpretations = reconciliationStatus === 'RESTRICTED' || reconciliationStatus === 'BLOCKED';

    return {
      isReconcilable,
      variancePercentage,
      confidence,
      reconciliationStatus,
      temporalSeverity,
      alerts,
      disclosures,
      restrictsOptimisticInterpretations
    };
  }
}
