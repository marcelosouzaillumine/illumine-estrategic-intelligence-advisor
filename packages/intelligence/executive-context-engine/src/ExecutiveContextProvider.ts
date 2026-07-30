import { ExecutiveDecisionContext } from '@illumine/executive-contracts';

export interface ContextBuildInput {
  readonly companyId: string;
  readonly companyName?: string;
  readonly tenantId?: string;
  readonly pageId: string;
  readonly period: string;
  readonly comparisonPeriod?: string;
  readonly selectedKPI?: string;
  readonly filters?: Record<string, unknown>;
  readonly financialData?: Record<string, number>;
  readonly previousPeriodFinancialData?: Record<string, number>;
  readonly benchmarks?: Record<string, number>;
}

export class ExecutiveContextProvider {
  public static buildContext(input: ContextBuildInput): ExecutiveDecisionContext {
    const compYear = input.comparisonPeriod || String(Number(input.period || '2026') - 1);
    const companyName = input.companyName || (input.companyId === 'comp-emporio' ? 'Empório do Mármore' : 'Granatum S.A.');

    return {
      companyId: input.companyId,
      companyName,
      tenantId: input.tenantId || 'tenant-default',
      industry: 'Manufatura & Comércio',
      segment: 'Corporativo',
      organizationalUnit: 'Consolidado',

      pageId: input.pageId,
      pageType: 'EXECUTIVE_FINANCIAL',

      period: input.period || '2026',
      comparisonPeriod: compYear,
      comparisonType: 'YoY',

      selectedKPI: input.selectedKPI,
      filters: input.filters || {},
      currency: 'BRL',

      financialStatements: {
        incomeStatement: input.financialData,
        balanceSheet: input.financialData,
        cashFlow: input.financialData
      },

      executiveMetrics: {
        currentMetrics: input.financialData || {},
        previousPeriodMetrics: input.previousPeriodFinancialData || {},
        historicalSeries: [input.financialData || {}]
      },

      benchmarks: input.benchmarks || { ebitdaMarginBenchmark: 15.0 },

      confidenceLevel: 98.0,
      semanticContext: {
        hasRealFinancialData: !!input.financialData && Object.keys(input.financialData).length > 0
      }
    };
  }
}
