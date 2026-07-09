import { CapitalGovernanceAdapter, LifecycleContextBuilder, LifecycleSemanticAuthority, ExecutiveDecisionSynthesisEngine, HistoricalInsightEngine } from '../../../services/FiduciaryRuntimeAdapter';

import { FirestoreAuthAdapter } from '../../../adapters/persistence/FirestoreAuthAdapter';
import { FirestoreFinancialAdapter } from '../../../adapters/persistence/FirestoreFinancialAdapter';

export class DLPAApplicationService {
  static async deleteDLPAData(clientId: string, year: number): Promise<void> {
    if (!FirestoreAuthAdapter.isAuthenticated()) {
      throw new Error('Você precisa estar logado para excluir dados.');
    }
    await FirestoreFinancialAdapter.deleteEntriesByClientAndYear(clientId, year, 'DLPA');
  }

  static processGovernance(
    dbDataDLPA: any[],
    dlpaMetrics: any,
    allHistoryData: any[],
    clients: any[],
    selectedClient: string,
    filterYear: number
  ) {
    if (!dlpaMetrics || dbDataDLPA.length === 0) return null;
    const { lucroLiquido, dividendos, plInicio, plFim, aumentoCapital, capitalSocial } = dlpaMetrics;
    const retainedEarnings = plFim > 0 ? plFim - (plInicio || plFim) : lucroLiquido - dividendos;

    const currentClient = clients?.find((c: any) => c.id === selectedClient);

    let foundationYear: number | undefined = undefined;
    if (currentClient?.dataFundacao) {
      const parts = currentClient.dataFundacao.split('/');
      if (parts.length === 3) {
        const yearPart = Number(parts[2]);
        if (!isNaN(yearPart)) foundationYear = yearPart;
      } else {
        const yearPart = Number(currentClient.dataFundacao);
        if (!isNaN(yearPart)) {
          foundationYear = yearPart;
        } else {
          const dateObj = new Date(currentClient.dataFundacao);
          if (!isNaN(dateObj.getFullYear())) {
            foundationYear = dateObj.getFullYear();
          }
        }
      }
    }
    if (foundationYear === undefined && typeof currentClient?.foundationYear === 'number') {
      foundationYear = currentClient.foundationYear;
    }

    const uniqueYears = Array.from(new Set((allHistoryData as any[]).map((d: any) => Number(d.year)).filter(Boolean))) as number[];
    const historicalCycles = uniqueYears.filter(y => y <= filterYear).length;

    const normalize = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dreEntries = allHistoryData.filter((d: any) =>
      Number(d.year) === filterYear &&
      ['dre', 'dre gerencial', 'resultado'].includes(normalize(d.docType || d.type || ''))
    );
    const revEntry = dreEntries.find((d: any) => {
      const name = normalize(d.conta || d.category || d.item || '');
      return name.includes('receita') || name.includes('faturamento') || name.includes('vendas');
    });
    const revenue = revEntry ? Number(revEntry.val ?? revEntry.valor ?? revEntry.value ?? 0) : 0;

    const lContext = LifecycleContextBuilder.build({
      foundationYear,
      analysisYear: filterYear,
      historicalCycles,
      capitalSocial,
      revenue,
      netIncome: lucroLiquido
    });
    const lifecycleProfile = LifecycleSemanticAuthority.getSemanticProfile(lContext);

    const financialRuntimeContext = {
      lifecycle: lContext,
      analysisYear: filterYear,
      lifecycleProfile,
      contextualConfidence: 'HIGH' as const,
      interpretationWarnings: [] as string[],
      requiredDisclosures: [] as string[],
      auditTrail: [] as string[]
    };

    try {
      return CapitalGovernanceAdapter.process(
        dbDataDLPA,
        lucroLiquido,
        retainedEarnings,
        dividendos,
        plInicio || plFim,
        plFim,
        aumentoCapital,
        financialRuntimeContext,
        allHistoryData
      );
    } catch (e: any) {
      console.error("DLPA Adapter Error:", e);
      return { error: e.message };
    }
  }

  static generateStrategicDiagnosisPayload(executiveLayer: any, dlpaMetrics: any, selectedYear: number) {
    if (!executiveLayer) return null;
    return ExecutiveDecisionSynthesisEngine.generateStrategicDiagnosisPayload({
      analysisYear: selectedYear,
      generatedAt: new Date().toISOString(),
      moduleContext: 'DLPA',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: 'HEALTHY',
      mathematicalClassification: '',
      globalScore: 75,
      primaryIndicators: {},
      technicalDrivers: {
        lucroLiquido: dlpaMetrics?.lucroLiquido || 0,
        dividendosPagos: dlpaMetrics?.dividendos || 0,
        payoutRatio: (dlpaMetrics?.lucroLiquido || 0) > 0 ? (dlpaMetrics?.dividendos || 0) / (dlpaMetrics?.lucroLiquido || 1) : 0,
        lucroPrejuizoPeriodo: dlpaMetrics?.lucroLiquido || 0,
        lucrosPrejuizosAcumulados: (dlpaMetrics?.lucrosPrejuizosInicio || 0) + (dlpaMetrics?.lucroLiquido || 0),
        capitalSocial: dlpaMetrics?.capitalSocial || 0,
        patrimonioLiquido: dlpaMetrics?.plFim || 0,
        capacidadeDistribuicao: (dlpaMetrics?.lucroLiquido || 0) - (dlpaMetrics?.dividendos || 0)
      },
      contextualAlerts: []
    });
  }

  static generateExecutiveNarrative(chartData: any[]) {
    return HistoricalInsightEngine.generateExecutiveNarrative(
      { module: 'DLPA', globalFiduciaryStatus: 'NEUTRAL' },
      { profit: { metricName: 'Lucro', data: chartData.map((d: any) => ({ year: d.year, value: d.LucroLíquido })) } }
    );
  }
}
