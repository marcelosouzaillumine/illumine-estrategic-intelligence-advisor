export interface FinancialStatementsContext {
  readonly incomeStatement?: Record<string, number>;
  readonly balanceSheet?: Record<string, number>;
  readonly cashFlow?: Record<string, number>;
}

export interface ExecutiveMetricsContext {
  readonly currentMetrics?: Record<string, number>;
  readonly previousPeriodMetrics?: Record<string, number>;
  readonly historicalSeries?: readonly Record<string, number>[];
}

export interface ExecutiveDecisionContext {
  readonly companyId: string;
  readonly companyName: string;
  readonly tenantId: string;
  readonly industry?: string;
  readonly segment?: string;
  readonly organizationalUnit?: string;

  readonly pageId: string;
  readonly pageType: string;

  readonly period: string;
  readonly comparisonPeriod: string;
  readonly comparisonType: 'YoY' | 'MoM' | 'QoQ' | 'CUSTOM';

  readonly selectedKPI?: string;
  readonly filters?: Record<string, unknown>;
  readonly currency: string;

  readonly financialStatements: FinancialStatementsContext;
  readonly executiveMetrics: ExecutiveMetricsContext;
  readonly benchmarks?: Record<string, number>;

  readonly confidenceLevel: number;
  readonly semanticContext?: Record<string, unknown>;
}
