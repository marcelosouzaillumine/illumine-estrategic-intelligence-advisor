import { HistoricalCycleData } from '../institutional-memory/types';
import { CausalSequence, CycleMetrics } from './types';

export class CausalSequenceEngine {
  public static detect(cycles: HistoricalCycleData[], metrics: CycleMetrics[]): CausalSequence[] {
    if (cycles.length < 3) return [];

    const sequences: CausalSequence[] = [];
    const activeEventsPerYear: Record<number, string[]> = {};

    // 1. Identify events for each cycle (comparing with the previous one)
    for (let i = 1; i < metrics.length; i++) {
      const prev = metrics[i - 1];
      const curr = metrics[i];
      const events: string[] = [];

      // A. Crescimento operacional sem capitalização
      const stockGrown = curr.estoques > prev.estoques * 1.1;
      const plStableOrDown = curr.patrimonioLiquido <= prev.patrimonioLiquido * 1.05;
      if (stockGrown && plStableOrDown) {
        events.push('CRESCIMENTO_SEM_CAPITALIZACAO');
      }

      // B. Aumento de dependência de fornecedores
      const suppliersGrown = curr.fornecedores > prev.fornecedores * 1.1 && curr.fornecedores > 0;
      if (suppliersGrown) {
        events.push('DEPENDENCIA_FORNECEDORES');
      }

      // C. Deterioração de liquidez imediata
      const cashDown = curr.caixaEquivalentes < prev.caixaEquivalentes * 0.9 && curr.caixaEquivalentes > 0;
      if (cashDown) {
        events.push('DETERIORACAO_LIQUIDEZ');
      }

      // D. Compressão de margem (score decrescente)
      if (curr.compositeScore < prev.compositeScore) {
        events.push('COMPRESSAO_DE_MARGEM');
      }

      activeEventsPerYear[curr.year] = events;
    }

    const years = Object.keys(activeEventsPerYear).map(Number).sort((a, b) => a - b);

    for (let i = 0; i < years.length - 1; i++) {
      const y1 = years[i];
      const y2 = years[i + 1];

      const hasCrescY1 = activeEventsPerYear[y1]?.includes('CRESCIMENTO_SEM_CAPITALIZACAO');
      const hasDepY2 = activeEventsPerYear[y2]?.includes('DEPENDENCIA_FORNECEDORES');

      if (hasCrescY1 && hasDepY2) {
        if (i + 2 < years.length) {
          const y3 = years[i + 2];
          const hasLiqY3 = activeEventsPerYear[y3]?.includes('DETERIORACAO_LIQUIDEZ');
          if (hasLiqY3) {
            sequences.push({
              sequenceId: `SEQ-CRESC-DEP-LIQ-${y1}`,
              steps: [
                { eventDescription: 'Crescimento operacional sem capitalização proporcional', cycleYear: y1 },
                { eventDescription: 'Aumento de dependência de fornecedores', cycleYear: y2 },
                { eventDescription: 'Deterioração de liquidez imediata', cycleYear: y3 }
              ],
              confidence: 0.95,
              evidenceChain: [
                `Estoque cresceu no ciclo ${y1} com PL estável`,
                `Fornecedores cresceram no ciclo ${y2}`,
                `Caixa declinou no ciclo ${y3}`
              ]
            });
          }
        } else {
          sequences.push({
            sequenceId: `SEQ-CRESC-DEP-${y1}`,
            steps: [
              { eventDescription: 'Crescimento operacional sem capitalização proporcional', cycleYear: y1 },
              { eventDescription: 'Aumento de dependência de fornecedores', cycleYear: y2 }
            ],
            confidence: 0.85,
            evidenceChain: [
              `Estoque cresceu no ciclo ${y1} com PL estável`,
              `Fornecedores cresceram no ciclo ${y2}`
            ]
          });
        }
      }

      if (activeEventsPerYear[y1]?.includes('DEPENDENCIA_FORNECEDORES') && activeEventsPerYear[y2]?.includes('DETERIORACAO_LIQUIDEZ')) {
        const parentId = y1 - 1;
        if (!sequences.some(s => s.sequenceId === `SEQ-CRESC-DEP-LIQ-${parentId}`)) {
          sequences.push({
            sequenceId: `SEQ-DEP-LIQ-${y1}`,
            steps: [
              { eventDescription: 'Aumento de dependência de fornecedores', cycleYear: y1 },
              { eventDescription: 'Deterioração de liquidez imediata', cycleYear: y2 }
            ],
            confidence: 0.8,
            evidenceChain: [
              `Fornecedores cresceram no ciclo ${y1}`,
              `Caixa declinou no ciclo ${y2}`
            ]
          });
        }
      }
    }

    return sequences;
  }
}
