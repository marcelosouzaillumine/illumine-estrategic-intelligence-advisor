import { FinancialIndicator, FinancialDiagnostic } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { RiskExposure } from '../../../../core/intelligence/contracts/RiskExposure';

export class FinancialDiagnosticEngine {
  static analyze(indicators: FinancialIndicator[], exposures: RiskExposure[]): FinancialDiagnostic {
    let status = 'STRONG';
    const strengths: string[] = [];
    const attention: string[] = [];

    // Analyze Indicators to extract generic strengths/attentions based on status
    for (const ind of indicators) {
      if (ind.status === 'EXCELLENT' || ind.status === 'STRONG') {
         strengths.push(`${ind.name}: ${ind.interpretation}`);
      } else if (ind.status === 'ATTENTION' || ind.status === 'CRITICAL') {
         attention.push(`${ind.name}: ${ind.interpretation}`);
      }
    }

    // Merge exposures
    for (const exposure of exposures) {
      attention.push(exposure.message);
    }

    // Calculate dynamic health
    const criticalCount = indicators.filter(i => i.status === 'CRITICAL').length + exposures.filter(e => e.severity === 'CRITICAL').length;
    const attentionCount = indicators.filter(i => i.status === 'ATTENTION').length + exposures.filter(e => e.severity === 'HIGH' || e.severity === 'MEDIUM').length;

    if (criticalCount >= 2) {
      status = 'CRITICAL';
    } else if (criticalCount === 1 || attentionCount >= 3) {
      status = 'VULNERABLE';
    } else if (attentionCount > 0) {
      status = 'ATTENTION';
    } else if (strengths.length >= 2) {
      status = 'STRONG';
    } else {
      status = 'NEUTRAL';
    }

    // Generate non-prescriptive narrative
    let executiveMessage = 'A estrutura patrimonial é equilibrada e não apresenta focos imediatos de tensão.';
    if (status === 'CRITICAL') {
      executiveMessage = 'As evidências quantitativas apontam vulnerabilidades materiais na estrutura de capital, caracterizando elevada pressão financeira.';
    } else if (status === 'VULNERABLE') {
      executiveMessage = 'O diagnóstico revela uma combinação de fatores de atenção estruturais que sugerem redução na margem de segurança financeira.';
    } else if (status === 'ATTENTION') {
      executiveMessage = 'A estrutura patrimonial permanece funcional, mas apresenta exposições pontuais refletidas nos indicadores de atenção.';
    } else if (status === 'STRONG') {
      executiveMessage = 'A composição patrimonial indica autonomia financeira e capacidade de absorção operacional demonstrada nos principais agregados.';
    }

    return {
      status,
      strengths: Array.from(new Set(strengths)), // Deduplicate
      attention: Array.from(new Set(attention)), // Deduplicate
      executiveMessage
    };
  }
}
