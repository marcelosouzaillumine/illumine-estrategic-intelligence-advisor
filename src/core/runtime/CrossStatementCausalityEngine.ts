// src/core/runtime/CrossStatementCausalityEngine.ts

export type CausalityStatementNode = 'DRE' | 'BP' | 'DFC' | 'DLPA';

export interface CausalityPropagationLink {
  source: CausalityStatementNode;
  target: CausalityStatementNode;
  propagationDirection: string;
  mechanism: string;
  evidence: string;
  severity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
}

export interface CrossStatementCausalityProfile {
  tensions: CausalityPropagationLink[];
  resolution: {
    status: string;
  };
}

export function detectCrossStatementCausality(
  ebitda: number,
  operatingCashFlow: number,
  retainedEarnings: number,
  workingCapitalVariation: number,
  capex: number,
  totalDistributed: number
): CrossStatementCausalityProfile {
  
  const tensions: CausalityPropagationLink[] = [];

  // DRE -> DFC Propagation (Lucro sem Caixa)
  if (ebitda > 0 && operatingCashFlow <= 0) {
    tensions.push({
      source: 'DRE',
      target: 'DFC',
      propagationDirection: 'DRE → DFC',
      mechanism: 'Retenção de Capital de Giro',
      evidence: `EBITDA positivo (${ebitda}) não convertido em Caixa Operacional (${operatingCashFlow}). Possível aprisionamento em giro.`,
      severity: 'ALTA'
    });
  }

  // DFC -> BP Propagation (Caixa não cobre CAPEX gerando dependência)
  if (operatingCashFlow > 0 && capex > operatingCashFlow) {
    tensions.push({
      source: 'DFC',
      target: 'BP',
      propagationDirection: 'DFC → BP',
      mechanism: 'Dependência de Terceiros para Investimento',
      evidence: `Caixa Operacional (${operatingCashFlow}) insuficiente para cobrir CAPEX (${capex}), exigindo passivo (BP).`,
      severity: 'MODERADA'
    });
  }

  // DRE -> DLPA Propagation (Crescimento sem Retenção / Distribuição com Prejuízo)
  if (ebitda <= 0 && totalDistributed > 0) {
    tensions.push({
      source: 'DRE',
      target: 'DLPA',
      propagationDirection: 'DRE → DLPA',
      mechanism: 'Descapitalização com Déficit Operacional',
      evidence: `Distribuição de dividendos (${totalDistributed}) ocorrendo simultaneamente a um déficit operacional (EBITDA: ${ebitda}).`,
      severity: 'CRÍTICA'
    });
  }

  // BP -> DFC Propagation (Pressão de Dívida)
  // This would require debt data, omitting for now or assuming we have basic inputs.

  const status = tensions.length > 0 ? 'Sob Análise' : 'Estável';

  return { tensions, resolution: { status } };
}

export interface CrossStatementCausalityReport {
  tensions: {
    id: string;
    title: string;
    severity: string;
    description: string;
    evidence: string;
  }[];
  stressPatterns: string[];
}

export class CrossStatementCausalityEngine {
  public static analyze(
    bpSummary: any,
    dreEbitda: number,
    dreLucro: number,
    cashFlowReport: any,
    capitalGovernanceReport: any
  ): CrossStatementCausalityReport {
    const tensions: any[] = [];
    const stressPatterns: string[] = [];

    const operatingCashFlow = cashFlowReport?.isAvailable ? (cashFlowReport.operational?.operatingCashFlow ?? 0) : 0;
    
    // Case 1: Lucro sem caixa (Profitable DRE but negative Cash Flow)
    if (dreEbitda > 0 && operatingCashFlow <= 0) {
      tensions.push({
        id: 'LUCRO_SEM_CAIXA',
        title: 'Lucro sem Caixa',
        severity: 'ALTA',
        description: 'EBITDA positivo mas fluxo de caixa operacional negativo ou nulo.',
        evidence: `EBITDA: ${dreEbitda} | FCO: ${operatingCashFlow}`
      });
      stressPatterns.push('DESCALAS_GIRO');
    }

    return {
      tensions,
      stressPatterns
    };
  }
}

