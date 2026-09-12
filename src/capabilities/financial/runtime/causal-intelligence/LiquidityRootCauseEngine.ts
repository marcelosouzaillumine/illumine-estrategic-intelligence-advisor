// src/core/runtime/causal-intelligence/LiquidityRootCauseEngine.ts

import { CausalFactor, CausalFactorType, CausalSeverity } from './types';
import { CashIntelligenceRuntimeOutput } from '../cash-intelligence/CashIntelligenceTypes';
import { WorkingCapitalCausalEngine } from './WorkingCapitalCausalEngine';
import { StructuralDeteriorationMapper } from './StructuralDeteriorationMapper';
import { HistoricalCycleData } from '../../../runtime/institutional-memory/types';

export class LiquidityRootCauseEngine {
  public static evaluate(
    cashReport: CashIntelligenceRuntimeOutput,
    dreNetIncome: number,
    dreEbitda: number,
    fco: number,
    workingCapitalVariation: number,
    receivables: number,
    inventory: number,
    availableCash: number,
    thirdPartyFunding: number,
    allHistData: any[],
    historicalCycles: HistoricalCycleData[],
    filterYear: number,
    isDfcAvailable: boolean
  ): CausalFactor[] {
    const factors: CausalFactor[] = [];

    // 1. Fetch Structural Deterioration Trends
    const structTrends = StructuralDeteriorationMapper.evaluate(allHistData, filterYear);
    
    // 2. Fetch Working Capital Trends
    const wcTrends = WorkingCapitalCausalEngine.evaluate(
      historicalCycles,
      receivables,
      inventory,
      workingCapitalVariation
    );

    // Helper to add factor under fiduciarily safe naming convention
    const addFactor = (
      type: CausalFactorType,
      label: string,
      severity: CausalSeverity,
      rationale: string,
      confidenceValue: number
    ) => {
      // Enforce: If DFC is missing, nothing is definitive. Prefix and adjust terminology.
      let adjustedRationale = rationale;
      let finalLabel = label;
      const isDefinitive = isDfcAvailable;

      if (!isDfcAvailable) {
        finalLabel = `Possível Área de Pressão: ${label}`;
        adjustedRationale = `Inferência causal restrita devido à ausência de DFC. ${rationale.replace(/confirmado|comprovado|gerou/gi, 'sinalizado como vetor provável de')}`;
      }

      // Enforce language rules:
      adjustedRationale = adjustedRationale
        .replace(/a causa e/gi, 'detectado sinal de pressão em')
        .replace(/a causa é/gi, 'detectado sinal de pressão em')
        .replace(/isso prova/gi, 'evidências estruturais indicam')
        .replace(/a empresa faliu porque|a empresa falhou porque/gi, 'vetor de estresse operacional severo associado a');

      factors.push({
        type,
        label: finalLabel,
        severity,
        rationale: adjustedRationale,
        confidence: isDfcAvailable ? confidenceValue : confidenceValue * 0.5,
        isDefinitive
      });
    };

    // --- RULE A: MARGIN_COMPRESSION & PRICE_COST_MISMATCH ---
    if (structTrends.marginCompression) {
      addFactor(
        'MARGIN_COMPRESSION',
        'Compressão de Margem Bruta',
        'HIGH',
        'Sinal fiduciário de perda sistemática de rentabilidade operacional nas vendas de produtos ou serviços.',
        0.9
      );
    }
    if (structTrends.priceCostMismatch) {
      addFactor(
        'PRICE_COST_MISMATCH',
        'Desalinhamento Preço-Custo',
        'HIGH',
        'Evidências estruturais indicam que os custos de produtos/serviços cresceram em ritmo acelerado em relação às receitas.',
        0.85
      );
    }

    // --- RULE B: EXCESS_INVENTORY ---
    if (wcTrends.inventoryTrend === 'GROWING' && inventory > availableCash * 0.5) {
      addFactor(
        'EXCESS_INVENTORY',
        'Excesso e Acúmulo de Estoque',
        fco < 0 ? 'HIGH' : 'MODERATE',
        'Vetor provável de dreno de liquidez devido a investimentos excessivos na estocagem de insumos ou produtos finalizados.',
        0.8
      );
    }

    // --- RULE C: CUSTOMER_CREDIT_EXPANSION & CUSTOMER_CONCENTRATION_RISK ---
    if (wcTrends.receivablesTrend === 'GROWING' && receivables > availableCash * 0.5) {
      addFactor(
        'CUSTOMER_CREDIT_EXPANSION',
        'Expansão de Crédito a Clientes',
        fco < 0 ? 'HIGH' : 'MODERATE',
        'Sinalização de extensão de ciclos médios de recebimento concedidos a clientes, postergando entrada de caixa.',
        0.8
      );
    }
    if (receivables > availableCash * 1.5 && receivables > 1000) {
      addFactor(
        'CUSTOMER_CONCENTRATION_RISK',
        'Risco de Concentração de Recebíveis',
        'HIGH',
        'Elevada exposição de crédito de ciclo imediato em relação ao caixa livre disponível da organização.',
        0.75
      );
    }

    // --- RULE D: OPERATING_EXPENSE_LEVERAGE ---
    if (structTrends.operatingExpenseLeverage) {
      addFactor(
        'OPERATING_EXPENSE_LEVERAGE',
        'Desalinhamento de Despesas Operacionais',
        'MODERATE',
        'Aceleração desproporcional de custos SG&A em relação às receitas operacionais líquidas.',
        0.8
      );
    }

    // --- RULE E: TAX_BURDEN_PRESSURE ---
    if (structTrends.taxBurdenPressure) {
      addFactor(
        'TAX_BURDEN_PRESSURE',
        'Pressão de Carga Tributária',
        'MODERATE',
        'Aumento da alíquota fiscal efetiva ou das despesas tributárias correntes no período analisado.',
        0.7
      );
    }

    // --- RULE F: DEBT_SERVICE_BURDEN & SHORT_TERM_DEBT_REFINANCING_PRESSURE ---
    if (thirdPartyFunding > Math.max(availableCash, 1000) && fco < 0) {
      addFactor(
        'DEBT_SERVICE_BURDEN',
        'Serviço e Encargos da Dívida',
        'HIGH',
        'Dependência contínua de linhas bancárias para amortização e pagamento de encargos financeiros.',
        0.85
      );
    }
    if (thirdPartyFunding > 0 && availableCash < thirdPartyFunding * 0.3) {
      addFactor(
        'SHORT_TERM_DEBT_REFINANCING_PRESSURE',
        'Pressão de Rolagem de Dívida de ciclo imediato',
        'HIGH',
        'Vetores de refinanciamento necessários devido à baixa cobertura de caixa sobre as obrigações bancárias vincendas.',
        0.8
      );
    }

    // --- RULE G: CASH_DRAIN_BY_DISTRIBUTIONS ---
    if (structTrends.cashDrainByDistributions) {
      addFactor(
        'CASH_DRAIN_BY_DISTRIBUTIONS',
        'Dreno de Caixa por Distribuições',
        'HIGH',
        'Vazamento severo de liquidez operacional decorrente da distribuição desproporcional de proventos corporativos.',
        0.9
      );
    }

    return factors;
  }
}
