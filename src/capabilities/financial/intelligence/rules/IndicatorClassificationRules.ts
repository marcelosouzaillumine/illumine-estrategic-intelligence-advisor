import { FinancialIndicator } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';

export class IndicatorClassificationRules {
  static getLiquidityStatus(value: number): string {
    if (value >= 1.5) return 'EXCELLENT';
    if (value >= 1.0) return 'GOOD';
    if (value >= 0.8) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getDryLiquidityStatus(value: number): string {
    if (value >= 1.0) return 'EXCELLENT';
    if (value >= 0.8) return 'GOOD';
    if (value >= 0.5) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getImmediateLiquidityStatus(value: number): string {
    if (value >= 0.5) return 'EXCELLENT';
    if (value >= 0.2) return 'GOOD';
    if (value >= 0.05) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getGeneralLiquidityStatus(value: number): string {
    if (value >= 1.5) return 'EXCELLENT';
    if (value >= 1.2) return 'GOOD';
    if (value >= 1.0) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getDebtStatus(value: number): string {
    if (value <= 0.3) return 'EXCELLENT';
    if (value <= 0.5) return 'GOOD';
    if (value <= 0.7) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getShortTermDebtConcentrationStatus(value: number): string {
    if (value <= 0.3) return 'EXCELLENT';
    if (value <= 0.5) return 'GOOD';
    if (value <= 0.7) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getThirdPartyCapitalStatus(value: number | null): string {
    if (value === null) return 'CRITICAL'; // PL <= 0
    if (value <= 1.0) return 'EXCELLENT'; // Capital próprio > terceiros
    if (value <= 2.0) return 'GOOD';
    if (value <= 4.0) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getEquityImmobilizationStatus(value: number | null): string {
    if (value === null) return 'CRITICAL'; // PL <= 0
    if (value <= 0.5) return 'EXCELLENT';
    if (value <= 1.0) return 'GOOD';
    if (value <= 1.5) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getInterpretation(status: string, customText?: { excellent: string, good: string, attention: string, critical: string }): string {
    if (customText) {
      switch (status) {
        case 'EXCELLENT': return customText.excellent;
        case 'GOOD': return customText.good;
        case 'ATTENTION': return customText.attention;
        case 'CRITICAL': return customText.critical;
      }
    }
    
    switch (status) {
      case 'EXCELLENT': return 'A posição indica robustez estrutural e folga operacional.';
      case 'GOOD': return 'A posição sugere equilíbrio e capacidade adequada de sustentação.';
      case 'ATTENTION': return 'A posição demanda acompanhamento contínuo por expor a estrutura a oscilações.';
      case 'CRITICAL': return 'A posição revela pressão estrutural significativa, limitando a margem de manobra financeira.';
      default: return 'Posição neutra.';
    }
  }
}
