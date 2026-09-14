import { FiduciaryLiquidityClassificationOutput, FiduciaryLiquidityClassification, CashConfidenceLevel, FinancialRuntimeContext } from './CashIntelligenceTypes';

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
    isArtificial?: boolean,
    context?: FinancialRuntimeContext,
    fcoBasis: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN' = 'ADJUSTED_OPERATIONAL_BURN'
  ): FiduciaryLiquidityClassificationOutput {
    let classification: FiduciaryLiquidityClassification = 'OPERATIONAL_SUSTAINABLE';
    let label = 'Liquidez Operacional Sustentável';
    let severity: 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO' = 'SAUDÁVEL';
    let rationale = '';

    const rw = runwayMonths ?? 99;
    const isArt = isArtificial || (fco < 0 && fcf > Math.abs(fco)) || (fco <= 0 && availableCash > 0);

    // Classificação lógica fiduciária determinística
    if (fco < 0 && fcf > 0) {
      if (rw < 3) {
        classification = 'SUSTENTACAO_EXTERNA';
        label = 'Sustentação Externa Emergencial';
        rationale = 'Consumo estrutural de caixa com runway crítico, operando exclusivamente via suporte financeiro emergencial.';
        severity = 'COLAPSO';
      } else if (isArt) {
        classification = 'ARTIFICIAL_LIQUIDITY';
        label = 'Liquidez Artificial';
        rationale = 'Saldo de caixa mascarado por aportes ou financiamentos, encobrindo queima operacional severa.';
        severity = 'CRÍTICO';
      } else {
        classification = 'DEPENDENCIA_DE_CAPITALIZACAO';
        label = 'Dependência de Capitalização';
        rationale = 'A operação é estruturalmente dependente de capitalização externa para manutenção de liquidez.';
        severity = 'ESTRESSADO';
      }
    } else if (fco < 0 && fcf <= 0) {
      classification = 'CONTINUITY_RISK';
      label = 'Risco de Continuidade';
      rationale = 'Consumo de caixa operacional sem suporte de financiamento correspondente. Risco severo de ruptura.';
      severity = rw < 3 ? 'COLAPSO' : 'CRÍTICO';
    } else if (fco <= 0 && availableCash > 0) {
      classification = 'ARTIFICIAL_LIQUIDITY';
      label = 'Liquidez Artificial Isolada';
      rationale = 'Caixa remanescente sem contrapartida de geração operacional sustentada.';
      severity = 'PRESSIONADO';
    } else if (fco > 0 && fcf < 0) {
      if (context?.maturityStage === 'EXPANSION' && fci < 0) {
        classification = 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL';
        label = 'Reinvestimento Operacional Saudável';
        rationale = 'Geração operacional robusta aplicada em expansão (CapEx) ou desalavancagem (amortização de dívida).';
        severity = 'SAUDÁVEL';
      } else {
        classification = 'TESOURARIA_ESTRUTURALMENTE_SAUDAVEL';
        label = 'Tesouraria Estruturalmente Saudável';
        rationale = 'Geração de caixa positiva e autônoma, sem dependência relevante de financiamentos externos.';
        severity = 'SAUDÁVEL';
      }
    } else if (fco > 0 && fci < 0 && Math.abs(fci) > fco * 0.4) {
      classification = 'STRATEGIC_EXPANSION';
      label = 'Expansão Estratégica';
      rationale = 'Investimento agressivo com base em geração operacional positiva.';
      severity = 'SAUDÁVEL';
    } else if (fco > 0 && fcf > 0 && fcf > fco * 0.5) {
      classification = 'PARTIALLY_DEPENDENT';
      label = 'Liquidez Parcialmente Dependente';
      rationale = 'Geração positiva, mas com alta alavancagem ou captação recorrente para blindar caixa.';
      severity = rw < 12 ? 'PRESSIONADO' : 'SENSÍVEL';
    } else {
      classification = 'OPERATIONAL_SUSTAINABLE';
      label = 'Liquidez Operacional Sustentável';
      rationale = 'Operação autossuficiente em geração de caixa, demonstrando baixo risco de liquidez.';
      severity = 'SAUDÁVEL';
    }

    return {
      classification,
      label,
      confidence,
      severity,
      rationale,
      fcoBasis
    };
  }
}
