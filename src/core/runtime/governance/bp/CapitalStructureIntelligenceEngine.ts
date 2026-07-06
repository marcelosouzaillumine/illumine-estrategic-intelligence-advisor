import { BPSummary } from '../../../../lib/bpEngine';
import { NaNEliminationGuard } from '../common/NaNEliminationGuard';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export class CapitalStructureIntelligenceEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static analyze(
    summary: BPSummary,
    liquidezReal: number | 'INSUFFICIENT_DATA',
    lossAbsorption: number | 'INSUFFICIENT_DATA'
  ): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Capital Structure Intelligence';

    const lrValue = typeof liquidezReal === 'number' ? liquidezReal : 1.0;
    const lsValue = (summary.passivoCirculante || 0) > 0 ? Number(NaNEliminationGuard.sanitizeNumber((summary.ativoCirculante - summary.estoques) / summary.passivoCirculante, 0)) : 1.0;
    const laValue = typeof lossAbsorption === 'number' ? lossAbsorption : 5.0;
    const estoqueConc = summary.ativoTotal > 0 ? Number(NaNEliminationGuard.sanitizeNumber(summary.estoques / summary.ativoTotal, 0)) : 0;
    const divCPConc = summary.passivoTotal > 0 ? Number(NaNEliminationGuard.sanitizeNumber(summary.passivoCirculante / summary.passivoTotal, 0)) : 0;

    // Funding Capacity Ratio
    if (summary.obrigacoesOperacionais !== null && summary.patrimonioLiquido > 0) {
      const ncg = (summary.clientes + summary.estoques) - summary.obrigacoesOperacionais;
      const ncgIncremental = ncg * 0.2; 
      
      const passivoOneroso = summary.passivosFinanceiros || 0;
      const tetoEndividamento = summary.patrimonioLiquido * 1.5;
      const margemEndividamento = Math.max(0, tetoEndividamento - passivoOneroso);
      
      if (ncgIncremental > 0) {
        const val = Number(NaNEliminationGuard.sanitizeNumber((summary.caixaEquivalentes + margemEndividamento) / ncgIncremental, 0));
        
        let classification = 'NEUTRAL';
        if (val > 3.0) classification = 'Excelente';
        else if (val > 2.0) classification = 'Alta';
        else if (val > 1.5) classification = 'Moderada';
        else classification = 'Baixa';

        // Guardrails for Funding Capacity
        if (lrValue < 0.75 || lsValue < 1.0) {
          if (classification === 'Excelente' || classification === 'Alta') {
            classification = 'Moderada';
          }
        }

        indicators.push({
          metricName: 'Capacidade de Financiamento',
          value: val,
          classification,
          severity: classification === 'Baixa' ? 'CRITICAL' : (classification === 'Moderada' ? 'ATTENTION' : 'HEALTHY'),
          confidence: 85,
          evidence: { Caixa: summary.caixaEquivalentes, MargemEndividamento: margemEndividamento, NCG_Incremental: ncgIncremental },
          rationale: classification === 'Excelente' || classification === 'Alta' ? 'Alta capacidade de financiar crescimento com recursos próprios ou captação segura.' : 'A expansão operacional não é recomendada enquanto persistirem as restrições atuais de liquidez e preservação de capital.',
          lineageHash: `CSIE-FUND-${Date.now().toString(16)}`,
          family,
          format: 'decimal'
        });
      }
    }

    // Debt Capacity Score
    if (summary.patrimonioLiquido > 0 && summary.ativoTotal > 0) {
      const debtToEquity = Number(NaNEliminationGuard.sanitizeNumber((summary.passivosFinanceiros || 0) / summary.patrimonioLiquido, 0));
      const liquidityProxy = Number(NaNEliminationGuard.sanitizeNumber(summary.ativoCirculante / (summary.passivoCirculante || 1), 0));
      
      let debtCapacityScore = 100;
      if (debtToEquity > 1.5) debtCapacityScore -= 40;
      else if (debtToEquity > 0.8) debtCapacityScore -= 20;

      if (liquidityProxy < 1.0) debtCapacityScore -= 30;
      else if (liquidityProxy < 1.2) debtCapacityScore -= 15;

      // Guardrails - Penalização Multicritério
      if (lrValue < 0.75) debtCapacityScore -= 20;
      if (laValue < 2.0) debtCapacityScore -= 15;
      if (estoqueConc > 0.40) debtCapacityScore -= 10;
      if (divCPConc > 0.70) debtCapacityScore -= 15;

      // Garantir que não fica negativo
      if (debtCapacityScore < 0) debtCapacityScore = 0;

      let classification = 'Excelente';
      if (debtCapacityScore >= 80) classification = 'Excelente';
      else if (debtCapacityScore >= 60) classification = 'Moderada';
      else if (debtCapacityScore >= 40) classification = 'Baixa';
      else classification = 'Crítica';

      indicators.push({
        metricName: 'Índice de Capacidade de Endividamento',
        value: debtCapacityScore,
        classification,
        severity: classification === 'Excelente' ? 'HEALTHY' : (classification === 'Moderada' ? 'ATTENTION' : 'CRITICAL'),
        confidence: 90,
        evidence: { ScoreBase: 100, DebtToEquity: debtToEquity, LiquidityProxy: liquidityProxy, LR: lrValue, LA: laValue, EstoqueConc: estoqueConc, DivCP: divCPConc },
        rationale: 'Capacidade de absorção de novo endividamento baseada na robustez patrimonial e penalizada por fragilidades de liquidez.',
        lineageHash: `CSIE-DEBT-${Date.now().toString(16)}`,
        family,
        format: 'decimal'
      });
    }

    return indicators;
  }
}
