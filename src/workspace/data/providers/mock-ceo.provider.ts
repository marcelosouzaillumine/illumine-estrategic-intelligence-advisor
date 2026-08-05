import { ExecutiveContext } from '../../context/executive-context.types';
import { CeoIntelligenceProvider, CeoStrategicPerformanceData, CeoGrowthData, CeoRiskOverviewData, CeoExecutiveSummaryData } from '../types/ceo-intelligence.types';
import { CeoDecisionEngine } from '../../intelligence/ceo/engines/ceo-decision.engine';
import { CeoRiskEngine } from '../../intelligence/ceo/engines/ceo-risk.engine';
import { CeoSummaryEngine } from '../../intelligence/ceo/engines/ceo-summary.engine';

export class MockCeoProvider implements CeoIntelligenceProvider {
  private decisionEngine = new CeoDecisionEngine();
  private riskEngine = new CeoRiskEngine();
  private summaryEngine = new CeoSummaryEngine();

  private createMockMetadata(context: ExecutiveContext) {
    return {
      id: `snapshot-ceo-mock-tenant-${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      tenantId: 'ceo-mock-tenant',
      periodId: `${context.period.year}-${String(context.period.month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:ceo-mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 94,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 120,
      tenantSchemaVersion: '1.0.0',
      source: 'ceo-mock-engine',
      status: 'READY' as const
    };
  }

  async getStrategicPerformance(context: ExecutiveContext): Promise<CeoStrategicPerformanceData> {
    const data = await this.decisionEngine.evaluateStrategicPerformance('mock-tenant', 'mock-period');
    return {
      metadata: this.createMockMetadata(context),
      ...data
    };
  }

  async getGrowthIntelligence(context: ExecutiveContext): Promise<CeoGrowthData> {
    const data = await this.decisionEngine.evaluateGrowthIntelligence('mock-tenant', 'mock-period');
    return {
      metadata: this.createMockMetadata(context),
      ...data
    };
  }

  async getRiskOverview(context: ExecutiveContext): Promise<CeoRiskOverviewData> {
    const data = await this.riskEngine.evaluateRiskOverview('mock-tenant', 'mock-period');
    return {
      metadata: this.createMockMetadata(context),
      ...data
    };
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<CeoExecutiveSummaryData> {
    const data = await this.summaryEngine.evaluateExecutiveSummary('mock-tenant', 'mock-period');
    return {
      metadata: this.createMockMetadata(context),
      ...data
    };
  }
}
