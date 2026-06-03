import { BPSummary } from '../../../../lib/bpEngine';
import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';

export interface LiquidityRealityConfig {
  receivablesHaircut: number; // 0.0 to 1.0, e.g., 0.70 for 70% haircut
}

export class LiquidityRealityEngine {
  /**
   * Calculates "Liquidez Real" and "Liquidez Instantânea Real"
   */
  static evaluate(
    summary: BPSummary,
    config: LiquidityRealityConfig = { receivablesHaircut: 0.70 }
  ): {
    indicators: PatrimonialIndicator[];
    liquidezReal: number | 'INSUFFICIENT_DATA';
    liquidezInstantaneaReal: number | 'INSUFFICIENT_DATA';
    realClassification: string;
    instantClassification: string;
  } {
    const indicators: PatrimonialIndicator[] = [];
    const family = 'Liquidez Real Operacional';

    if (summary.passivoCirculante === 0) {
      return {
        indicators: [],
        liquidezReal: 'INSUFFICIENT_DATA',
        liquidezInstantaneaReal: 'INSUFFICIENT_DATA',
        realClassification: 'INSUFFICIENT_DATA',
        instantClassification: 'INSUFFICIENT_DATA'
      };
    }

    // 1. Liquidez Instantânea Real = (Caixa + Aplicações) / Passivo Circulante
    // "Caixa e Equivalentes" is already (Caixa + Aplicações Imediatas)
    const liquidezInstantaneaReal = summary.caixaEquivalentes / summary.passivoCirculante;
    
    let instantClass = 'CRITICAL';
    let instantSeverity = 'CRITICAL';
    if (liquidezInstantaneaReal >= 0.5) {
      instantClass = 'HEALTHY';
      instantSeverity = 'HEALTHY';
    } else if (liquidezInstantaneaReal >= 0.25) {
      instantClass = 'ATTENTION';
      instantSeverity = 'ATTENTION';
    }

    indicators.push({
      metricName: 'Liquidez Instantânea Real',
      value: liquidezInstantaneaReal,
      classification: instantClass,
      severity: instantSeverity,
      confidence: 100,
      evidence: {
        caixaEquivalentes: summary.caixaEquivalentes,
        passivoCirculante: summary.passivoCirculante
      },
      rationale: `Mede a capacidade imediata de honrar obrigações de curto prazo utilizando apenas disponibilidades puras.`,
      lineageHash: `LRE-LIR-${Date.now().toString(16)}`,
      family,
      format: 'decimal'
    });

    // 2. Liquidez Real = (Caixa + Aplicações + Recebíveis * Haircut) / Passivo Circulante
    const recebiveisPrudenciais = summary.clientes * config.receivablesHaircut;
    const liquidezReal = (summary.caixaEquivalentes + recebiveisPrudenciais) / summary.passivoCirculante;

    let realClass = 'CRITICAL';
    let realSeverity = 'CRITICAL';
    
    if (liquidezReal >= 1.0) {
      realClass = 'Excelente';
      realSeverity = 'HEALTHY';
    } else if (liquidezReal >= 0.75) {
      realClass = 'Adequada';
      realSeverity = 'HEALTHY'; // Or Neutral
    } else if (liquidezReal >= 0.50) {
      realClass = 'Frágil';
      realSeverity = 'ATTENTION';
    } else {
      realClass = 'Crítica';
      realSeverity = 'CRITICAL';
    }

    indicators.push({
      metricName: 'Liquidez Real',
      value: liquidezReal,
      classification: realClass,
      severity: realSeverity,
      confidence: 95,
      evidence: {
        caixaEquivalentes: summary.caixaEquivalentes,
        recebiveisPrudenciais,
        haircut: config.receivablesHaircut,
        passivoCirculante: summary.passivoCirculante
      },
      rationale: `Avalia a verdadeira capacidade de sobrevivência financeira excluindo estoques e aplicando um fator prudencial de ${(config.receivablesHaircut * 100).toFixed(0)}% sobre recebíveis.`,
      lineageHash: `LRE-LR-${Date.now().toString(16)}`,
      family,
      format: 'decimal'
    });

    return {
      indicators,
      liquidezReal,
      liquidezInstantaneaReal,
      realClassification: realClass,
      instantClassification: instantClass
    };
  }
}
