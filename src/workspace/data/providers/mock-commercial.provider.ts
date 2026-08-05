import { ExecutiveContext } from '../../context/executive-context.types';
import { CommercialIntelligenceProvider } from './commercial-intelligence.provider';
import { 
  CommercialPerformanceData, 
  PipelineIntelligenceData, 
  CustomerIntelligenceData, 
  MarketOpportunityData, 
  CommercialExecutiveSummaryData, 
  CommercialHealthScore 
} from '../types/commercial-intelligence.types';

import { CommercialPerformanceEngine } from '../../intelligence/commercial/engines/commercial-performance.engine';
import { PipelineHealthEngine } from '../../intelligence/commercial/engines/pipeline-health.engine';
import { CustomerHealthEngine } from '../../intelligence/commercial/engines/customer-health.engine';
import { GrowthOpportunityEngine } from '../../intelligence/commercial/engines/growth-opportunity.engine';
import { CommercialHealthScoreEngine } from '../../intelligence/commercial/engines/commercial-health-score.engine';
import { CommercialSnapshotGenerator } from '../../intelligence/commercial/commercial-snapshot.generator';

export class MockCommercialProvider implements CommercialIntelligenceProvider {
  private perfEngine = new CommercialPerformanceEngine();
  private pipelineEngine = new PipelineHealthEngine();
  private customerEngine = new CustomerHealthEngine();
  private growthEngine = new GrowthOpportunityEngine();
  private healthEngine = new CommercialHealthScoreEngine();
  private snapshotGenerator = new CommercialSnapshotGenerator();

  private createMockMetadata(context: ExecutiveContext, source: string) {
    const year = context.period?.year || new Date().getFullYear();
    const month = context.period?.month || (new Date().getMonth() + 1);
    
    return {
      id: `snapshot-comm-mock-${year}-${String(month).padStart(2, '0')}`,
      tenantId: 'comm-mock-tenant',
      periodId: `${year}-${String(month).padStart(2, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system:commercial-mock-engine',
      lastUpdatedAt: new Date().toISOString(),
      dataQuality: 'high' as const,
      confidenceScore: 92,
      version: 'v1',
      schemaVersion: '1.0.0',
      engineVersion: '1.0.0',
      providerVersion: '1.0.0',
      sourceVersion: '1.0.0',
      pipelineVersion: '1.0.0',
      calibrationVersion: '1.0.0',
      validationVersion: '1.0.0',
      snapshotHash: 'mock-hash',
      processingTime: 110,
      tenantSchemaVersion: '1.0.0',
      source: source,
      status: 'READY' as const
    };
  }

  async getHealthScore(context: ExecutiveContext): Promise<CommercialHealthScore> {
    const data = await this.healthEngine.evaluate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'health-engine') } as CommercialHealthScore;
  }

  async getPerformance(context: ExecutiveContext): Promise<CommercialPerformanceData> {
    const data = await this.perfEngine.evaluate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'perf-engine') } as CommercialPerformanceData;
  }

  async getPipelineIntelligence(context: ExecutiveContext): Promise<PipelineIntelligenceData> {
    const data = await this.pipelineEngine.evaluate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'pipeline-engine') } as PipelineIntelligenceData;
  }

  async getCustomerIntelligence(context: ExecutiveContext): Promise<CustomerIntelligenceData> {
    const data = await this.customerEngine.evaluate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'customer-engine') } as CustomerIntelligenceData;
  }

  async getMarketOpportunities(context: ExecutiveContext): Promise<MarketOpportunityData> {
    const data = await this.growthEngine.evaluate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'growth-engine') } as MarketOpportunityData;
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<CommercialExecutiveSummaryData> {
    const data = await this.snapshotGenerator.generate(context);
    return { ...data, metadata: this.createMockMetadata(context, 'snapshot-engine') } as CommercialExecutiveSummaryData;
  }
}
