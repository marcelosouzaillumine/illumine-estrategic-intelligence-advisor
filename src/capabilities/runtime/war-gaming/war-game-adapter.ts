// src/core/runtime/war-gaming/war-game-adapter.ts

import { InstitutionalWarGameEngine } from './InstitutionalWarGameEngine';
import { CrisisInput, WarGameResult } from './war-gaming-types';

export class WarGameAdapter {
  /**
   * Adapta os dados de payload legados do Executive Intelligence para as métricas fiduciárias
   * requeridas pela simulação institucional de crise.
   */
  public static executeSimulatedCrisis(
    scenarioId: string,
    inputs: CrisisInput[],
    rawData: any
  ): WarGameResult {
    
    // Extrai métricas básicas do payload
    const bpSummary = rawData.rawFinancialData?.bpSummary || {};
    const dreData = rawData.dreData || [];
    const dfcData = rawData.dfcData || [];
    
    const hasDFC = dfcData.length > 0 || !!rawData.rawFinancialData?.fco;
    const initialCash = bpSummary.caixaEquivalentes || 0;
    const hasValidCash = initialCash > 0;
    const hasValidFunding = bpSummary.passivoCirculante !== undefined;

    const receitaNode = dreData.find((d: any) => d.category?.toUpperCase().includes('RECEITA') && d.category?.toUpperCase().includes('LÍQUIDA'));
    const receita = receitaNode ? receitaNode.value : (rawData.rawFinancialData?.recLiquida || 1);
    
    const ebitdaNode = dreData.find((d: any) => d.category === 'EBITDA');
    const ebitda = ebitdaNode ? ebitdaNode.value : (rawData.rawFinancialData?.ebitda || 1);

    const custoNode = dreData.find((d: any) => d.category?.toUpperCase().includes('CUSTO'));
    const custos = custoNode ? Math.abs(custoNode.value) : 0;
    const margemContribuicaoPct = receita > 0 ? (receita - custos) / receita : 0;

    // FCO proxy
    const fcoNode = dfcData.find((d: any) => d.category === 'FCO');
    const fco = fcoNode ? fcoNode.value : (rawData.rawFinancialData?.fco || (ebitda * 0.8)); // Simple fallback if not provided, but war game engine blocks if not hasDFC

    const baselineContext = {
      hasDFC,
      hasValidCash,
      hasValidFunding,
      initialCash,
      receita,
      margemContribuicaoPct,
      custosFixos: receita - custos - ebitda,
      ebitda,
      prazoMedioFornecedores: rawData.rawFinancialData?.pmf || 30,
      estoques: bpSummary.estoques || 0,
      simulatedMonthlyCashFlow: fco / 12, // Average monthly FCO
      covenantThresholds: {
        minEbitda: ebitda * 0.5, // Arbitrary standard covenant proxy
        minCash: initialCash * 0.2 // Arbitrary proxy for minimum operating cash
      }
    };

    const baselineHash = `B-HASH-${Date.now()}`;

    return InstitutionalWarGameEngine.executeScenario(
      scenarioId,
      baselineHash,
      inputs,
      baselineContext
    );
  }
}
