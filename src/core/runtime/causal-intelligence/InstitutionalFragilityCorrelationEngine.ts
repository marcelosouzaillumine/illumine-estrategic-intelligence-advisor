// src/core/runtime/causal-intelligence/InstitutionalFragilityCorrelationEngine.ts

import { CashIntelligenceRuntimeOutput } from '../cash-intelligence/CashIntelligenceTypes';

export class InstitutionalFragilityCorrelationEngine {
  public static evaluate(
    cashReport: CashIntelligenceRuntimeOutput,
    fco: number,
    thirdPartyFunding: number,
    receivables: number,
    inventory: number
  ): string[] {
    const correlations: string[] = [];

    // 1. Correlation: Reconciliation variance and transparency issues
    if (cashReport.reconciliationAlerts?.reconciliationStatus !== 'RECONCILED') {
      correlations.push(
        'Correlação identificada: Divergência de conciliação contábil indica descompasso entre registros de competência e relatórios de fluxo de caixa.'
      );
    }

    // 2. Correlation: Negative FCO + Third Party Funding dependency
    if (fco < 0 && thirdPartyFunding > 0) {
      correlations.push(
        'Correlação identificada: Geração de caixa operacional deprimida (FCO Negativo) correlaciona-se diretamente com o aumento de passivos bancários (Funding de terceiros) para financiamento da sobrevivência.'
      );
    }

    // 3. Correlation: Working Capital Lock + Receivables/Inventory concentration
    if (cashReport.operationalSustainability?.operationalFragilityIndex > 30) {
      if (receivables > inventory) {
        correlations.push(
          'Correlação identificada: O índice de fragilidade operacional está fortemente atrelado ao alongamento do contas a receber e exposição de crédito a clientes.'
        );
      } else {
        correlations.push(
          'Correlação identificada: O índice de fragilidade operacional está fortemente atrelado ao sobre-estoque de insumos e lenta rotação de ativos físicos.'
        );
      }
    }

    // 4. Default baseline correlation if clean
    if (correlations.length === 0) {
      correlations.push(
        'Nenhuma correlação crítica de fragilidade estrutural foi mapeada neste ciclo.'
      );
    }

    return correlations;
  }
}
