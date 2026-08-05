import { FinancialIndicator } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';

export class IndicatorClassificationRules {
  static getLiquidityStatus(value: number): string {
    if (value >= 1.5) return 'EXCELLENT';
    if (value >= 1.0) return 'GOOD';
    if (value >= 0.8) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getDebtStatus(value: number): string {
    if (value <= 0.3) return 'EXCELLENT';
    if (value <= 0.5) return 'GOOD';
    if (value <= 0.7) return 'ATTENTION';
    return 'CRITICAL';
  }

  static getInterpretation(status: string): string {
    switch (status) {
      case 'EXCELLENT': return 'A posição é altamente favorável e demonstra solidez operacional.';
      case 'GOOD': return 'A posição é equilibrada e não apresenta riscos aparentes.';
      case 'ATTENTION': return 'A posição requer monitoramento para evitar deterioração futura.';
      case 'CRITICAL': return 'A posição indica risco estrutural iminente que requer ação corretiva.';
      default: return 'Posição neutra.';
    }
  }
}
