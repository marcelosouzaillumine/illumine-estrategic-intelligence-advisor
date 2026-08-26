import { FirestoreDocument } from "../types/contracts";

export const CLIENT_FINANCIAL_COLLECTIONS = {
  financialInputs: "modeling_inputs",
  scenarios: "institutional_scenarios",
  scenarioImpacts: "scenario_impacts",
};

export interface FinancialInput {
  isMockData: boolean;
  year?: number; // Added to track which year this represents
  scenarioId?: string; // Added to track which scenario this represents if projected
  historicalCyclesCount: number;
  clientProfile: {
    segmentoAtuacao: string;
  };
  rawFinancialData: {
    segmentoEmpresa: string;
    prevPl: number;
    bpSummary: {
      ativoTotal: number;
      ativoCirculante: number;
      passivoCirculante: number;
      passivoTotal: number;
      patrimonioLiquido: number;
      caixaEquivalentes: number;
      estoques: number;
    };
  };
  bpData: { accountId: string; value: number }[];
  dreData: { category: string; value: number }[];
  cashFlowData: {
    initialCash: number;
    finalCash: number;
    operatingFlow: number;
    investingFlow: number;
    financingFlow: number;
  }[];
}

export interface ClientExecutiveTimelineRequest {
  clientId: string;
  selectedYear: number;
  historyWindow?: number;     // default: 5
  projectionWindow?: number;  // default: 5
  _testOverride?: {
    getDocsForQuery?: (collectionName: string, clientId: string, status?: string) => Promise<FirestoreDocument[]>;
  };
}

export interface ClientExecutiveTimelineData {
  availableYears: number[];
  selectedYear: number;
  selectedPeriodInput: FinancialInput | null;
  historicalInputs: FinancialInput[];
  projectedScenarioInputs: FinancialInput[];
  historicalRange: {
    startYear: number;
    endYear: number;
  };
  projectionRange: {
    startYear: number;
    endYear: number;
  };
}

export class ClientExecutiveFinancialDataAdapter {
  /**
   * Fetches the complete timeline data (historical + projections) for a client.
   * Exclusively uses PostgreSQL as the Source of Truth.
   */
  static async fetchTimelineData(request: ClientExecutiveTimelineRequest): Promise<ClientExecutiveTimelineData> {
    return this.fetchTimelineDataFromPostgres(request);
  }

  private static async fetchTimelineDataFromPostgres(request: ClientExecutiveTimelineRequest): Promise<ClientExecutiveTimelineData> {
    const historyWindow = request.historyWindow || 5;
    const projectionWindow = request.projectionWindow || 5;
    const { getSupabaseClient } = await import('../infrastructure/supabase/SupabaseClient');
    const supabase = getSupabaseClient();

    // Fetch from Postgres
    const { data: inputs, error } = await supabase.from('finance.legacy_modeling_inputs').select('*').eq('client_id', request.clientId);
    
    if (error) {
       console.error("[PostgreSQL] Error fetching modeling inputs:", error);
       throw new Error("Financial data temporarily unavailable");
    }

    const historicalInputs: FinancialInput[] = (inputs || []).map(d => d.payload);
    historicalInputs.sort((a, b) => (a.year || 0) - (b.year || 0));

    const availableYears = historicalInputs.map(hi => hi.year || 0).filter(y => y > 0);
    const uniqueAvailableYears = Array.from(new Set(availableYears)).sort((a, b) => a - b);

    let finalSelectedYear = request.selectedYear;
    if (uniqueAvailableYears.length > 0 && !uniqueAvailableYears.includes(request.selectedYear)) {
      finalSelectedYear = uniqueAvailableYears[uniqueAvailableYears.length - 1];
    }

    const selectedPeriodInput = historicalInputs.find(hi => hi.year === finalSelectedYear) || null;
    const startYear = uniqueAvailableYears.length > 0 ? Math.max(uniqueAvailableYears[0], finalSelectedYear - historyWindow) : finalSelectedYear - historyWindow;
    const endYear = finalSelectedYear;

    const projectedScenarioInputs: FinancialInput[] = [];
    const { data: approvedScenarios } = await supabase.from('finance.legacy_institutional_scenarios').select('*').eq('client_id', request.clientId).eq('status', 'approved');
    const { data: impacts } = await supabase.from('finance.legacy_scenario_impacts').select('*').eq('client_id', request.clientId);

    if (approvedScenarios && approvedScenarios.length > 0) {
      for (const scenario of approvedScenarios) {
        const scenarioImpacts = (impacts || []).filter(i => i.scenario_id === scenario.id);
        const baselineRevenue = selectedPeriodInput?.dreData?.find(d => d.category === 'RECEITA LÍQUIDA')?.value || 1000;
        const baselineEbitda = selectedPeriodInput?.dreData?.find(d => d.category === 'EBITDA')?.value || 200;
        const revImpact = scenarioImpacts.reduce((sum, imp) => sum + (Number(imp.revenue_impact) || 0), 0);
        
        projectedScenarioInputs.push({
          isMockData: false,
          year: finalSelectedYear + 1,
          scenarioId: scenario.id,
          historicalCyclesCount: historicalInputs.length,
          clientProfile: selectedPeriodInput?.clientProfile || { segmentoAtuacao: 'N/A' },
          rawFinancialData: selectedPeriodInput?.rawFinancialData || {
            segmentoEmpresa: 'N/A', prevPl: 0,
            bpSummary: { ativoTotal: 0, ativoCirculante: 0, passivoCirculante: 0, passivoTotal: 0, patrimonioLiquido: 0, caixaEquivalentes: 0, estoques: 0 }
          },
          bpData: selectedPeriodInput?.bpData || [],
          dreData: [
            { category: 'RECEITA LÍQUIDA', value: baselineRevenue + revImpact },
            { category: 'EBITDA', value: baselineEbitda + (revImpact * 0.2) },
            { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: (baselineEbitda + (revImpact * 0.2)) * 0.6 }
          ],
          cashFlowData: selectedPeriodInput?.cashFlowData || []
        });
      }
    }

    return {
      availableYears: uniqueAvailableYears,
      selectedYear: finalSelectedYear,
      selectedPeriodInput,
      historicalInputs,
      projectedScenarioInputs,
      historicalRange: { startYear, endYear },
      projectionRange: { startYear: finalSelectedYear + 1, endYear: finalSelectedYear + projectionWindow }
    };
  }
}
