// src/core/runtime/CrossStatementCausalityEngine.ts

export type CausalityStatementNode = 'DRE' | 'BP' | 'DFC' | 'DLPA';

export interface CausalityPropagationLink {
  source: CausalityStatementNode;
  target: CausalityStatementNode;
  mechanism: string;
  evidence: string;
  severity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
}

export interface CrossStatementCausalityProfile {
  tensions: CausalityPropagationLink[];
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
      mechanism: 'Descapitalização com Déficit Operacional',
      evidence: `Distribuição de dividendos (${totalDistributed}) ocorrendo simultaneamente a um déficit operacional (EBITDA: ${ebitda}).`,
      severity: 'CRÍTICA'
    });
  }

  // BP -> DFC Propagation (Pressão de Dívida)
  // This would require debt data, omitting for now or assuming we have basic inputs.

  return { tensions };
}
