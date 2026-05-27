import { HistoricalCycleData } from './types';

export class InstitutionalBehaviorAnalyzer {
  public static analyze(
    cycles: HistoricalCycleData[],
    ignoredRecommendations: string[],
    structuralPersistence: string[]
  ): string[] {
    if (!cycles || cycles.length < 3) {
      return []; // Fail-closed: insufficient cycles
    }

    const sorted = [...cycles].sort((a, b) => a.year - b.year);
    const newest = sorted[sorted.length - 1];
    const oldest = sorted[0];

    const newestBP = this.parseBPSummary(newest.bpData);
    const oldestBP = this.parseBPSummary(oldest.bpData);

    const patterns: string[] = [];

    // 1. Postergação Recorrente de Decisões
    if (ignoredRecommendations && ignoredRecommendations.length > 0) {
      patterns.push('Postergação recorrente na execução de recomendações fiduciárias.');
    }

    // 2. Crescimento sem Reforço Estrutural
    if (newestBP.estoques && oldestBP.estoques) {
      const stockGrown = newestBP.estoques > oldestBP.estoques * 1.15;
      const plStableOrDown = newestBP.patrimonioLiquido <= oldestBP.patrimonioLiquido * 1.05;
      if (stockGrown && plStableOrDown) {
        patterns.push('Crescimento operacional sem reforço proporcional de capital próprio.');
      }
    }

    // 3. Dependência Recorrente de Capital Externo
    if (newestBP.passivosFinanceiros && oldestBP.passivosFinanceiros) {
      const debtGrown = newestBP.passivosFinanceiros > oldestBP.passivosFinanceiros * 1.2;
      const scoreDown = (newest.scores?.composite || 0) < (oldest.scores?.composite || 0);
      if (debtGrown && scoreDown) {
        patterns.push('Dependência recorrente de capital externo para financiamento operacional.');
      }
    }

    // 4. Reação Tardia a Crises
    const criticalViolationsPersisting = structuralPersistence.some(p => p.includes('CRITICAL') || p.includes('violação "Runway') || p.includes('violação "Systemic'));
    if (criticalViolationsPersisting) {
      patterns.push('Reação tardia a pressões estruturais críticas de liquidez ou solvência.');
    }

    return patterns;
  }

  private static parseBPSummary(bpData?: any[]): any {
    if (!bpData || !Array.isArray(bpData)) return {};
    const summary = {
      ativoTotal: 0,
      ativoCirculante: 0,
      passivoCirculante: 0,
      passivoTotal: 0,
      patrimonioLiquido: 0,
      caixaEquivalentes: 0,
      estoques: 0,
      passivosFinanceiros: 0
    };
    for (const entry of bpData) {
      const code = entry.code || '';
      const val = entry.value || 0;
      const accountName = (entry.accountName || '').toLowerCase();
      
      if (code.startsWith('1')) {
        summary.ativoTotal += val;
        if (code.startsWith('1.1')) {
          summary.ativoCirculante += val;
          if (accountName.includes('caixa') || accountName.includes('banco') || accountName.includes('equivalente') || accountName.includes('aplicaç')) {
            summary.caixaEquivalentes += val;
          }
          if (accountName.includes('estoque') || accountName.includes('inventar') || accountName.includes('mercador')) {
            summary.estoques += val;
          }
        }
      } else if (code.startsWith('2')) {
        summary.passivoTotal += val;
        if (code.startsWith('2.1')) {
          summary.passivoCirculante += val;
        }
        if (accountName.includes('financ') || accountName.includes('emprest') || accountName.includes('debent')) {
          summary.passivosFinanceiros += val;
        }
      } else if (code.startsWith('3') || code.startsWith('2.3') || accountName.includes('patrimonio') || accountName.includes('patrimônio')) {
        summary.patrimonioLiquido += val;
      }
    }
    return summary;
  }
}
