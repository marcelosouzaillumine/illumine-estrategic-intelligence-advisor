// src/core/runtime/strategic-intelligence/CapitalStrategyAlignmentEngine.ts

import { StrategicEvaluationContext, CapitalStrategyAlignment, StrategicContradiction, StrategicPosture } from './strategic-intelligence-types';

export class CapitalStrategyAlignmentEngine {
  static evaluate(
    context: StrategicEvaluationContext, 
    posture: StrategicPosture, 
    contradictions: StrategicContradiction[]
  ): CapitalStrategyAlignment {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return {
        status: 'ALIGNED',
        isCoherent: true,
        tensions: [],
        rationale: 'Dados insuficientes para avaliação de alinhamento.'
      };
    }

    const tensions: string[] = [];
    let isCoherent = true;
    let status: CapitalStrategyAlignmentStatus = 'ALIGNED';

    const hasDistributionContradiction = contradictions.some(c => c.id.includes('DIST'));
    const hasFundingExpansionContradiction = contradictions.some(c => c.id.includes('FUNDING-EXP'));
    const isExpanding = (context.metrics.scaleEfficiency.recGrowth && context.metrics.scaleEfficiency.recGrowth > 0.05) || false;
    const isRestricted = posture === 'RESTRICTION_POSTURE';
    const ocf = context.metrics.financialMetrics.ocf;

    if (hasDistributionContradiction) {
      isCoherent = false;
      status = 'MISALIGNED_DISTRIBUTION';
      tensions.push('Distribuição de capital incompatível com o estado de tesouraria / preservação fiduciária.');
    }

    if (hasFundingExpansionContradiction || (isExpanding && ocf < 0 && context.capitalStructure.rolloverRisk === 'HIGH')) {
      if (isCoherent) {
        status = 'MISALIGNED_EXPANSION';
      }
      isCoherent = false;
      tensions.push('Expansão não está respaldada por funding sustentável ou rollover risk tolerável.');
    }

    if (isRestricted && ocf < 0) {
      // CAPEX is misaligned with the fact that we are restricted and burning cash
      tensions.push('Alocação de recursos tensiona as diretrizes de sobrevivência ou suspensão ativas.');
      if (isCoherent) {
        status = 'STRUCTURAL_DISCONNECT';
      }
      isCoherent = false;
    }

    const rationale = isCoherent 
      ? 'O direcionamento estratégico atual está devidamente alinhado à capacidade da estrutura de capital e tesouraria.'
      : 'Foram detectados pontos de atrito fiduciário entre a direção executada e as restrições da estrutura de capital.';

    return {
      status,
      isCoherent,
      tensions,
      rationale
    };
  }
}

export type CapitalStrategyAlignmentStatus = 
  | 'ALIGNED'
  | 'MISALIGNED_EXPANSION'
  | 'MISALIGNED_DISTRIBUTION'
  | 'MISALIGNED_CAPEX'
  | 'STRUCTURAL_DISCONNECT';
