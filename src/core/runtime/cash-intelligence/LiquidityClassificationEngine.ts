import { FiduciaryLiquidityClassificationOutput, FiduciaryLiquidityClassification, CashConfidenceLevel } from './CashIntelligenceTypes';

export class LiquidityClassificationEngine {
  /**
   * Produz a classificação fiduciária oficial da liquidez corporativa.
   */
  public static evaluate(
    fco: number,
    fci: number,
    fcf: number,
    availableCash: number,
    confidence: CashConfidenceLevel,
    runwayMonths?: number,
    resilienceScore?: number,
    hasRuptureRisk?: boolean,
    isArtificial?: boolean
  ): FiduciaryLiquidityClassificationOutput {
    let classification: FiduciaryLiquidityClassification = 'OPERATIONAL_SUSTAINABLE';
    let label = 'Liquidez Operacional Sustentável';
    let severity: 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO' = 'SAUDÁVEL';
    let rationale = '';

    const isArt = isArtificial || (fco < 0 && fcf > Math.abs(fco)) || (fco <= 0 && availableCash > 0);

    // Classificação lógica fiduciária
    if (fco < 0 && fcf < 0) {
      classification = 'CONTINUITY_RISK';
      label = 'Risco de Continuidade';
      rationale = 'Consumo de caixa operacional associado a fluxo de financiamento líquido negativo. Alto risco de ruptura iminente.';
    } else if (fco < 0 && fcf > Math.abs(fco)) {
      classification = 'ARTIFICIAL_LIQUIDITY';
      label = 'Liquidez Artificial';
      rationale = 'Saldo de caixa positivo sustentado exclusivamente por recursos de terceiros ou acionistas, mascarando geração operacional negativa.';
    } else if (fco < 0 && fcf > 0) {
      classification = 'LIQUIDITY_DEPENDENT';
      label = 'Liquidez Dependente de Capital';
      rationale = 'Operação deficitária em caixa, dependente de captações de dívidas ou aportes societários para manter pagamentos.';
    } else if (fco <= 0 && availableCash > 0) {
      classification = 'ARTIFICIAL_LIQUIDITY';
      label = 'Liquidez Artificial';
      rationale = 'Existência de liquidez em conta sem contrapartida de geração operacional líquida no período.';
    } else if (fco > 0 && fci < 0 && Math.abs(fci) > fco * 0.4) {
      classification = 'STRATEGIC_EXPANSION';
      label = 'Expansão Sustentável';
      rationale = 'Geração operacional de caixa robusta direcionada a investimentos e expansão de ativos estratégicos.';
    } else if (fco > 0 && fcf > 0 && fcf > fco * 0.5) {
      classification = 'PARTIALLY_DEPENDENT';
      label = 'Liquidez Parcialmente Dependent';
      rationale = 'Geração operacional positiva, mas fortemente acoplada a captação de recursos financeiros externos.';
    } else {
      classification = 'OPERATIONAL_SUSTAINABLE';
      label = 'Liquidez Operacional Sustentável';
      rationale = 'Geração operacional líquida positiva, demonstrando autonomia de autofinanciamento e baixo risco de liquidez.';
    }

    // Determinação dinâmica de severidade fiduciária
    if (classification === 'CONTINUITY_RISK') {
      const rw = runwayMonths ?? 0;
      severity = rw < 3 ? 'COLAPSO' : 'CRÍTICO';
    } else if (classification === 'ARTIFICIAL_LIQUIDITY') {
      const rw = runwayMonths ?? 99;
      const res = resilienceScore ?? 100;

      if (rw < 6) {
        severity = 'CRÍTICO';
      } else if (rw < 12 || res < 45) {
        severity = 'ESTRESSADO';
      } else if (rw < 24 || res < 65) {
        severity = 'PRESSIONADO';
      } else {
        severity = 'SENSÍVEL';
      }
    } else if (classification === 'LIQUIDITY_DEPENDENT') {
      const rw = runwayMonths ?? 99;
      const res = resilienceScore ?? 100;
      
      if (rw < 6) {
        severity = 'CRÍTICO';
      } else if (rw < 12) {
        severity = 'ESTRESSADO';
      } else if (rw < 24 || res < 50) {
        severity = 'PRESSIONADO';
      } else {
        severity = 'SENSÍVEL';
      }
    } else if (classification === 'PARTIALLY_DEPENDENT') {
      const rw = runwayMonths ?? 99;
      severity = rw < 12 ? 'PRESSIONADO' : 'SENSÍVEL';
    } else if (classification === 'STRATEGIC_EXPANSION' || classification === 'OPERATIONAL_SUSTAINABLE') {
      severity = 'SAUDÁVEL';
    }

    return {
      classification,
      label,
      confidence,
      severity,
      rationale
    };
  }
}
