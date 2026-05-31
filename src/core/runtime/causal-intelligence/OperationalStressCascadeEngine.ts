// src/core/runtime/causal-intelligence/OperationalStressCascadeEngine.ts

import { CausalFactor } from './types';

export class OperationalStressCascadeEngine {
  public static evaluate(
    factors: CausalFactor[],
    fco: number,
    isDfcAvailable: boolean
  ): string[] {
    const cascadePath: string[] = [];

    // Fallback for blocked / missing DFC analysis
    if (!isDfcAvailable) {
      cascadePath.push(
        'Ausência de DFC',
        'Impossibilidade de rastrear fluxo operacional (FCO)',
        'Incerteza na cadeia de conversão operacional',
        'Limitação de inferência de insolvência primária'
      );
      return cascadePath;
    }

    // Always start with structural vectors if present
    const hasMarginIssues = factors.some(f => f.type === 'MARGIN_COMPRESSION' || f.type === 'PRICE_COST_MISMATCH');
    const hasWCIssues = factors.some(f => f.type === 'EXCESS_INVENTORY' || f.type === 'CUSTOMER_CREDIT_EXPANSION');
    const hasDebtIssues = factors.some(f => f.type === 'DEBT_SERVICE_BURDEN' || f.type === 'SHORT_TERM_DEBT_REFINANCING_PRESSURE');
    const hasDistributionIssues = factors.some(f => f.type === 'CASH_DRAIN_BY_DISTRIBUTIONS');

    // 1. Initial trigger layer
    if (hasMarginIssues) {
      cascadePath.push('Desalinhamento Preço-Custo / Compressão de Margem Bruta');
    } else {
      cascadePath.push('Geração bruta estável');
    }

    // 2. Intermediary operational layer
    if (hasWCIssues) {
      cascadePath.push('Acúmulo de ativos circulantes (Estoques / Recebíveis) trancando liquidez');
    }

    // 3. FCO Impact
    if (fco < 0) {
      cascadePath.push('Queima operacional primária (FCO Negativo)');
    } else {
      cascadePath.push('Geração operacional positiva, mas insuficiente para expansão');
    }

    // 4. Financial layer
    if (hasDebtIssues) {
      cascadePath.push('Serviço da dívida onerando caixa / Necessidade de aporte de terceiros');
    }
    if (hasDistributionIssues) {
      cascadePath.push('Dreno de caixa por distribuições de dividendos/capital acima do FCO');
    }

    // 5. Final Solvency impact
    if (fco < 0 && hasDebtIssues) {
      cascadePath.push('Risco severo de interrupção operacional por dependência externa de liquidez');
    } else {
      cascadePath.push('Preservação de solvência sob estresse controlado');
    }

    return cascadePath;
  }
}
