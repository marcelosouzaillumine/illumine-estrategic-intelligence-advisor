import { ArtificialLiquidityDiagnosis } from './CashIntelligenceTypes';

export class ArtificialLiquidityDetector {
  /**
   * Identifica se a liquidez do caixa é artificial (queima operacional coberta por aportes/financiamento).
   */
  public static evaluate(
    fco: number,
    fcf: number,
    fci: number,
    thirdPartyFunding: number,
    equityFunding: number
  ): ArtificialLiquidityDiagnosis {
    const isArtificial = fco < 0 && fcf > Math.abs(fco);
    const liquidityDistortionFactors: string[] = [];
    const diagnoses: ('LIQUIDITY_DEPENDENT' | 'ARTIFICIAL_LIQUIDITY' | 'EXTERNAL_SURVIVAL_SUPPORT')[] = [];
    const blockedConclusions: string[] = [];
    let rationale = '';

    if (isArtificial) {
      diagnoses.push('LIQUIDITY_DEPENDENT', 'ARTIFICIAL_LIQUIDITY', 'EXTERNAL_SURVIVAL_SUPPORT');
      blockedConclusions.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH');
      rationale = 'Geração operacional de caixa negativa coberta por captação de recursos externos. Liquidez artificial sustentada por financiamentos ou sócios (sobrevivência financiada).';

      if (equityFunding > 0) {
        liquidityDistortionFactors.push('shareholder_injection');
        liquidityDistortionFactors.push('one_off_event');
      }
      if (thirdPartyFunding > 0 || fcf > 0) {
        liquidityDistortionFactors.push('debt_dependency');
      }
      if (fci > 0) {
        liquidityDistortionFactors.push('non_operational_cash');
        liquidityDistortionFactors.push('one_off_event');
      }
      if (Math.abs(fco) > 50000 && fcf > 1.5 * Math.abs(fco)) {
        liquidityDistortionFactors.push('emergency_capitalization');
        liquidityDistortionFactors.push('one_off_event');
      }
    } else if (fco < 0) {
      diagnoses.push('LIQUIDITY_DEPENDENT');
      blockedConclusions.push('SUSTAINABLE_GROWTH');
      rationale = 'Consumo de caixa nas atividades operacionais primárias. A operação necessita de suporte de capital externo para equilíbrio.';
      
      if (fcf > 0) {
        liquidityDistortionFactors.push('debt_dependency');
      }
    } else {
      rationale = 'Fluxo de caixa operacional positivo. O caixa gerado pelo negócio suporta as necessidades financeiras.';
    }

    const uniqueFactors = Array.from(new Set(liquidityDistortionFactors));

    return {
      isArtificial,
      diagnoses,
      liquidityDistortionFactors: uniqueFactors,
      rationale,
      blockedConclusions
    };
  }
}
