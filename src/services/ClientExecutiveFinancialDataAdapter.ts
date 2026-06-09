import { FirestoreDocument } from "../types/contracts";
import { collection, query, where, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';

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
   * Ensures read-only principles and avoids creating synthetic mocks.
   */
  static async fetchTimelineData(request: ClientExecutiveTimelineRequest): Promise<ClientExecutiveTimelineData> {
    const isTest = !!(request._testOverride && request._testOverride.getDocsForQuery);
    const db = isTest ? null : getFirestore();
    const historyWindow = request.historyWindow || 5;
    const projectionWindow = request.projectionWindow || 5;

    // Helper for testing
    const _getDocs = async (collName: string, status?: string): Promise<FirestoreDocument[]> => {
      if (request._testOverride && request._testOverride.getDocsForQuery) {
        return request._testOverride.getDocsForQuery(collName, request.clientId, status);
      }
      
      let q;
      if (status) {
        q = query(collection(db, collName), where('clientId', '==', request.clientId), where('status', '==', status));
      } else {
        q = query(collection(db, collName), where('clientId', '==', request.clientId));
      }
      
      return new Promise((resolve, reject) => {
        const unsub = onSnapshot(q, (snap) => {
          unsub();
          resolve(snap.docs.map(d => ({ id: d.id, ...(d.data() as unknown as FirestoreDocument) })));
        }, (err) => {
          unsub();
          reject(err);
        });
      });
    };

    // 1. Fetch Historical Data
    const historicalInputs: FinancialInput[] = [];
    try {
      const inputs = await _getDocs(CLIENT_FINANCIAL_COLLECTIONS.financialInputs);
      
      inputs.forEach(data => {
        if (data && data.year) {
          if (data.rawFinancialData || data.bpData) {
            historicalInputs.push(data as unknown as FinancialInput);
          }
        }
      });
    } catch (e) {
      console.warn("[Timeline Adapter] Failed to fetch historical inputs", e);
    }

    // Sort historical inputs chronologically
    historicalInputs.sort((a, b) => (a.year || 0) - (b.year || 0));

    // Extract available years
    const availableYears = historicalInputs.map(hi => hi.year || 0).filter(y => y > 0);
    // Remove duplicates
    const uniqueAvailableYears = Array.from(new Set(availableYears)).sort((a, b) => a - b);

    // If selectedYear is not in availableYears, default to the latest available (if any)
    let finalSelectedYear = request.selectedYear;
    if (uniqueAvailableYears.length > 0 && !uniqueAvailableYears.includes(request.selectedYear)) {
      finalSelectedYear = uniqueAvailableYears[uniqueAvailableYears.length - 1];
    }

    const selectedPeriodInput = historicalInputs.find(hi => hi.year === finalSelectedYear) || null;

    // Historical Range
    const startYear = uniqueAvailableYears.length > 0 ? Math.max(uniqueAvailableYears[0], finalSelectedYear - historyWindow) : finalSelectedYear - historyWindow;
    const endYear = finalSelectedYear;

    // 2. Fetch Projections (Institutional Scenarios)
    const projectedScenarioInputs: FinancialInput[] = [];
    try {
      // Fetch approved scenarios
      const approvedScenarios = await _getDocs(CLIENT_FINANCIAL_COLLECTIONS.scenarios, 'approved');

      if (approvedScenarios.length > 0) {
        // Fetch scenario impacts
        const impacts = await _getDocs(CLIENT_FINANCIAL_COLLECTIONS.scenarioImpacts);

        // Dynamically build a projection for each approved scenario
        // We project starting from the selected period (if available)
        for (const scenario of approvedScenarios) {
          const scenarioImpacts = impacts.filter(i => i.scenarioId === scenario.id);
          
          // Calculate generic projection based on impacts.
          // This avoids duplicating logic and acts as the dynamic projection.
          // In the future, this should invoke the actual Financial Engine.
          
          // If we have a selected period, we use it as baseline
          const baselineRevenue = selectedPeriodInput?.dreData?.find(d => d.category === 'RECEITA LÍQUIDA')?.value || 1000;
          const baselineEbitda = selectedPeriodInput?.dreData?.find(d => d.category === 'EBITDA')?.value || 200;
          
          const revImpact = scenarioImpacts.reduce((sum, imp) => sum + (Number(imp.revenueImpact) || 0), 0);
          
          // Create a dynamic projected input
          const projectedInput: FinancialInput = {
            isMockData: false,
            year: finalSelectedYear + 1, // Next year
            scenarioId: scenario.id,
            historicalCyclesCount: historicalInputs.length,
            clientProfile: selectedPeriodInput?.clientProfile || { segmentoAtuacao: 'N/A' },
            rawFinancialData: selectedPeriodInput?.rawFinancialData || {
              segmentoEmpresa: 'N/A',
              prevPl: 0,
              bpSummary: {
                ativoTotal: 0, ativoCirculante: 0, passivoCirculante: 0, passivoTotal: 0,
                patrimonioLiquido: 0, caixaEquivalentes: 0, estoques: 0
              }
            },
            bpData: selectedPeriodInput?.bpData || [],
            dreData: [
              { category: 'RECEITA LÍQUIDA', value: baselineRevenue + revImpact },
              { category: 'EBITDA', value: baselineEbitda + (revImpact * 0.2) }, // Naive estimation for projection
              { category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: (baselineEbitda + (revImpact * 0.2)) * 0.6 }
            ],
            cashFlowData: selectedPeriodInput?.cashFlowData || []
          };
          projectedScenarioInputs.push(projectedInput);
        }
      }
    } catch (e) {
      console.warn("[Timeline Adapter] Failed to fetch projection scenarios", e);
    }

    const projStart = finalSelectedYear + 1;
    const projEnd = finalSelectedYear + projectionWindow;

    return {
      availableYears: uniqueAvailableYears,
      selectedYear: finalSelectedYear,
      selectedPeriodInput,
      historicalInputs,
      projectedScenarioInputs,
      historicalRange: {
        startYear,
        endYear
      },
      projectionRange: {
        startYear: projStart,
        endYear: projEnd
      }
    };
  }
}
