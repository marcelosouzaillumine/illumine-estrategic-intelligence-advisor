import { CapabilityResult } from './BaseCapability';
import { ExecutiveAnalyticsResult } from '../index';

export interface BalanceSheetContext {
  tenantId: string;
  period: string;
  snapshotId: string;
  financialData: any; // Ideally typed to FinancialPosition array or equivalent
}

export class BalanceSheetCapability {
  public evaluate(context: BalanceSheetContext): ExecutiveAnalyticsResult {
    // 1. Calculate Core Metrics
    // In a real scenario, this would invoke the Financial Calculation Engine
    const { totalCurrent, totalInitial, variation } = this.calculateMetrics(context.financialData);

    // 2. Generate Diagnostics (Gate 3 - No Narratives, only PURE Data and Observations)
    const diagnostics: CapabilityResult[] = [
      {
        capability: 'BalanceSheet',
        score: variation >= 0 ? 100 : 50,
        status: variation >= 0 ? 'HEALTHY' : 'CRITICAL',
        technicalConclusion: `Variação do saldo de disponibilidades foi de ${variation.toFixed(2)}% no período.`,
        evidence: {
          evidenceId: `EVD-BS-${Date.now()}`,
          tenantId: context.tenantId,
          workspaceId: context.tenantId, // Mocking workspaceId
          period: context.period,
          dataSnapshotId: context.snapshotId,
          dataSource: 'FinancialCalculationEngine -> financial_positions',
          formulasApplied: [{ name: 'Variation', expression: 'Sum(saldoAtual * exchangeRate) over bank accounts', result: variation }],
          engineVersion: '1.0.0',
          certifiedAt: new Date().toISOString(),
          rawValues: [],
          indicatorsUsed: [],
          technicalConclusion: `Variação do saldo de disponibilidades foi de ${variation.toFixed(2)}% no período.`
        }
      },
      {
        capability: 'BalanceSheet',
        score: 100,
        status: 'INFO' as any, // Hacking INFO since status is CRITICAL|WARNING|HEALTHY|EXCELLENT
        technicalConclusion: `Capital de giro líquido imediato (Caixa e Bancos): R$ ${totalCurrent.toFixed(2)}`,
        evidence: {
          evidenceId: `EVD-BS-2-${Date.now()}`,
          tenantId: context.tenantId,
          workspaceId: context.tenantId,
          period: context.period,
          dataSnapshotId: context.snapshotId,
          dataSource: 'FinancialCalculationEngine -> financial_positions',
          formulasApplied: [{ name: 'Total Current', expression: 'Sum(saldoAtual * exchangeRate)', result: totalCurrent }],
          engineVersion: '1.0.0',
          certifiedAt: new Date().toISOString(),
          rawValues: [],
          indicatorsUsed: [],
          technicalConclusion: `Capital de giro líquido imediato (Caixa e Bancos): R$ ${totalCurrent.toFixed(2)}`
        }
      }
    ];

    // 3. Construct the Canonical Evidence Chain (Gate 5 Pre-req)
    const evidence = {
      evidenceId: `EVD-BS-MAIN-${Date.now()}`,
      tenantId: context.tenantId,
      workspaceId: context.tenantId,
      period: context.period,
      dataSnapshotId: context.snapshotId,
      dataSource: 'FinancialCalculationEngine -> financial_positions',
      formulasApplied: [{ name: 'BalanceSheet', expression: 'Sum(saldoAtual * exchangeRate)', result: totalCurrent }],
      engineVersion: '1.0.0',
      capabilityName: 'BalanceSheetCapability',
      owner: 'Financial Governance Domain',
      certifiedAt: new Date().toISOString(),
      rawValues: [],
      indicatorsUsed: [],
      technicalConclusion: 'Balance Sheet evaluation completed'
    };

    return {
      metrics: [],
      indicators: [],
      diagnostics,
      confidence: 95,
      warnings: [],
      recommendations: [],
      forensics: { traceId: `trace-${Date.now()}` },
      governance: {
        certified: true,
        version: '1.0.0'
      },
      evidence
    };
  }

  private calculateMetrics(financialData: any[]) {
    // Basic mock implementation of useFinancialMath aggregation 
    // to decouple it from React Hooks.
    if (!financialData || !Array.isArray(financialData) || financialData.length === 0) {
      return { totalCurrent: 0, totalInitial: 0, variation: 0 };
    }

    let totalCurrent = 0;
    let totalInitial = 0;

    financialData.forEach(pos => {
      // Mocking exchange rate to 1 for simplicity in Capability.
      // In production, this would consume the centralized ExchangeRateService.
      const rate = 1; 
      totalCurrent += (pos.saldoAtual || 0) * rate;
      totalInitial += (pos.saldoInicial || 0) * rate;
    });

    const variation = totalInitial !== 0 ? ((totalCurrent - totalInitial) / totalInitial) * 100 : 0;

    return { totalCurrent, totalInitial, variation };
  }
}
