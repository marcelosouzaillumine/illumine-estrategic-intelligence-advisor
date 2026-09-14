import { ExecutiveSnapshotMetadata } from '../../data/types/executive-snapshot.types';

export interface RawCfoEngineResults {
  revenue: number;
  revenueTrend: 'up' | 'down' | 'neutral';
  revenueGrowth: number;
  ebitda: number;
  ebitdaMargin: number;
  ebitdaTrend: 'up' | 'down' | 'neutral';
  cashFlow: number;
  cashFlowTrend: 'up' | 'down' | 'neutral';
  liquidityRisk: 'low' | 'medium' | 'high';
  runwayDays: number;
  budgetVarianceValue: number;
  budgetVariancePercentage: number;
  forecastVsTargetPercentage: number;
  insights: any[]; // Or an explicit type
}

export class CfoSnapshotGenerator {
  /**
   * Generates the final document payload to be saved in Firestore.
   */
  static generatePayload(
    tenantId: string, 
    periodId: string, 
    engineResults: RawCfoEngineResults
  ): any {
    
    const metadata: ExecutiveSnapshotMetadata = {
      id: `snapshot-cfo-${tenantId}-${periodId}`,
      tenantId,
      periodId,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:cfo-pipeline',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high',
      confidenceScore: 90, // In reality, this comes from an Inference Confidence Engine
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 150,
      tenantSchemaVersion: '1.0.0',
      source: 'financial-governance-pipeline',
      status: 'READY'
    };

    return {
      metadata,
      performance: {
        revenue: {
          value: engineResults.revenue,
          trend: engineResults.revenueTrend,
          percentageChange: engineResults.revenueGrowth
        },
        ebitda: {
          value: engineResults.ebitda,
          margin: engineResults.ebitdaMargin,
          trend: engineResults.ebitdaTrend
        },
        cashFlow: {
          value: engineResults.cashFlow,
          trend: engineResults.cashFlowTrend
        },
        insights: engineResults.insights.filter(i => i.domain === 'performance')
      },
      cashIntelligence: {
        freeCashFlow: {
          value: engineResults.cashFlow,
          trend: engineResults.cashFlowTrend
        },
        liquidity: {
          risk: engineResults.liquidityRisk,
          runwayDays: engineResults.runwayDays
        },
        forecast: {
          monthly: {
            "Month 1": engineResults.cashFlow * 1.05,
            "Month 2": engineResults.cashFlow * 1.10
          }
        },
        insights: engineResults.insights.filter(i => i.domain === 'cash')
      },
      planning: {
        budgetVariance: {
          value: engineResults.budgetVarianceValue,
          percentage: engineResults.budgetVariancePercentage
        },
        forecastVsTarget: {
          percentage: engineResults.forecastVsTargetPercentage
        },
        scenarios: {
          pessimistic: engineResults.revenue * 0.9,
          base: engineResults.revenue,
          optimistic: engineResults.revenue * 1.2
        },
        insights: engineResults.insights.filter(i => i.domain === 'planning')
      }
    };
  }
}
