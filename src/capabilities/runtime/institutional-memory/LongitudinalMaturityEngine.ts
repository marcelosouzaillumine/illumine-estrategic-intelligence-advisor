import { HistoricalCycleData, LongitudinalMaturityProfile } from './types';

export class LongitudinalMaturityEngine {
  /**
   * Avalia a maturidade institucional ao longo do tempo.
   * Totalmente determinístico. Sem IA generativa.
   */
  public static evaluate(cycles: HistoricalCycleData[]): LongitudinalMaturityProfile {
    if (!cycles || cycles.length === 0) {
      return {
        maturityScore: 0,
        maturityTrend: 'STABLE',
        deteriorationTrend: 0,
        resilienceTrend: 0,
        governanceConsistencyIndex: 0
      };
    }

    const sortedCycles = [...cycles].sort((a, b) => a.year - b.year);
    
    const governanceConsistencyIndex = this.calculateGovernanceConsistency(sortedCycles);
    const resilienceTrend = this.calculateResilienceTrend(sortedCycles);
    const deteriorationTrend = this.calculateDeteriorationTrend(sortedCycles);
    const advisoryAdherence = this.calculateAdvisoryAdherence(sortedCycles);
    const operationalPersistence = this.calculateOperationalPersistence(sortedCycles);

    // Calculo do maturity score base
    // Assume-se que parte de 100 e sofre descontos por consistência ruim e deterioração
    let maturityScore = 100;
    
    // Penalidades
    if (governanceConsistencyIndex < 50) maturityScore -= 20;
    if (deteriorationTrend > 50) maturityScore -= 15;
    if (advisoryAdherence < 30) maturityScore -= 15;
    if (operationalPersistence > 70) maturityScore -= 10;

    // Bonificações
    if (resilienceTrend > 70) maturityScore += 10;
    
    maturityScore = Math.max(0, Math.min(100, maturityScore));

    let maturityTrend: 'IMPROVING' | 'STABLE' | 'DETERIORATING' = 'STABLE';
    if (resilienceTrend > deteriorationTrend + 20) {
      maturityTrend = 'IMPROVING';
    } else if (deteriorationTrend > resilienceTrend + 20) {
      maturityTrend = 'DETERIORATING';
    }

    return {
      maturityScore,
      maturityTrend,
      deteriorationTrend,
      resilienceTrend,
      governanceConsistencyIndex
    };
  }

  public static calculateGovernanceConsistency(cycles: HistoricalCycleData[]): number {
    // Exemplo: quantas violações em relação ao total de ciclos
    let totalViolations = 0;
    cycles.forEach(c => {
      if (c.violations && c.violations.length > 0) {
        totalViolations += c.violations.length;
      }
    });
    // Max penalties per cycle = 3. 0 violations = 100 consistency
    const avgViolations = totalViolations / cycles.length;
    let consistency = 100 - (avgViolations * 15);
    return Math.max(0, Math.min(100, consistency));
  }

  public static calculateResilienceTrend(cycles: HistoricalCycleData[]): number {
    // Avalia melhora de composite score ao longo do tempo se disponível
    if (cycles.length < 2) return 50;
    let improvementCount = 0;
    for (let i = 1; i < cycles.length; i++) {
      const prev = cycles[i-1].scores?.composite || 0;
      const curr = cycles[i].scores?.composite || 0;
      if (curr > prev) improvementCount++;
    }
    const ratio = improvementCount / (cycles.length - 1);
    return Math.round(ratio * 100);
  }

  private static calculateDeteriorationTrend(cycles: HistoricalCycleData[]): number {
    if (cycles.length < 2) return 0;
    let deteriorationCount = 0;
    for (let i = 1; i < cycles.length; i++) {
      const prev = cycles[i-1].scores?.composite || 100;
      const curr = cycles[i].scores?.composite || 100;
      if (curr < prev) deteriorationCount++;
    }
    const ratio = deteriorationCount / (cycles.length - 1);
    return Math.round(ratio * 100);
  }

  public static calculateAdvisoryAdherence(cycles: HistoricalCycleData[]): number {
    // Base adherence na quantidade de decisões fiduciárias executadas
    let executed = 0;
    let total = 0;
    cycles.forEach(c => {
      if (c.decisions) {
        c.decisions.forEach(d => {
          total++;
          if (d.approvalState === 'APPROVED' || d.approvalState === 'EXECUTED') {
            executed++;
          }
        });
      }
    });
    if (total === 0) return 50; // default
    return Math.round((executed / total) * 100);
  }

  public static calculateOperationalPersistence(cycles: HistoricalCycleData[]): number {
    // Identifica persistência de estresse operacional contínuo (scores muito baixos por muito tempo)
    let stressedCycles = 0;
    cycles.forEach(c => {
      if (c.scores && c.scores.operational && c.scores.operational < 40) {
        stressedCycles++;
      }
    });
    const ratio = stressedCycles / cycles.length;
    return Math.round(ratio * 100);
  }
}
