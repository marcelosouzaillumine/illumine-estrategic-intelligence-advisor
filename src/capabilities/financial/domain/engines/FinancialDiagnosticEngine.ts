import { FinancialIndicator, FinancialDiagnostic } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { RiskExposure } from '../../../../core/intelligence/contracts/RiskExposure';

export class FinancialDiagnosticEngine {
  static analyze(indicators: FinancialIndicator[], exposures: RiskExposure[]): FinancialDiagnostic {
    let status = 'STRONG';
    const strengths: string[] = [];
    const attention: string[] = [];

    const currentLiquidity = indicators.find(i => i.id === 'current_liquidity')?.value || 0;
    const debtRatio = indicators.find(i => i.id === 'debt_ratio')?.value || 0;

    if (currentLiquidity >= 1.5) {
      strengths.push('Alta capacidade de cobertura das obrigações de curto prazo.');
    } else if (currentLiquidity < 1.0) {
      attention.push('Baixa liquidez corrente. Risco de descasamento no curto prazo.');
    }

    if (debtRatio <= 0.4) {
      strengths.push('Baixa dependência de terceiros. Forte autonomia financeira.');
    } else if (debtRatio > 0.7) {
      attention.push('Elevado grau de endividamento. Risco de alavancagem excessiva.');
    }

    for (const exposure of exposures) {
      attention.push(exposure.message);
    }

    if (attention.length > 2 || exposures.some(e => e.severity === 'CRITICAL')) {
      status = 'CRITICAL';
    } else if (attention.length > 0) {
      status = 'VULNERABLE';
    } else if (strengths.length > 0) {
      status = 'STRONG';
    } else {
      status = 'STABLE';
    }

    let executiveMessage = 'A estrutura patrimonial é equilibrada e não apresenta focos imediatos de tensão.';
    if (status === 'CRITICAL') {
      executiveMessage = 'Existem múltiplos fatores críticos na estrutura patrimonial requerendo atenção executiva imediata para mitigar risco de insolvência ou ruptura.';
    } else if (status === 'VULNERABLE') {
      executiveMessage = 'A estrutura apresenta vulnerabilidades identificadas. É recomendada a avaliação de eficiência de capital e revisão das concentrações.';
    } else if (status === 'STRONG') {
      executiveMessage = 'A empresa possui estrutura sólida de capital com forte autonomia e capacidade de liquidação de obrigações.';
    }

    return {
      status,
      strengths,
      attention,
      executiveMessage
    };
  }
}
