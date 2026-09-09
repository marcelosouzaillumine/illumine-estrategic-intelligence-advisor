import { ExecutiveContext } from '../../../context/executive-context.types';
import { 
  ExecutiveOperationalHealthScore, 
  ProcessExecutionData, 
  LogisticsSupplyChainData, 
  ProcurementIntelligenceData, 
  OperationalExcellenceData, 
  OperationalExecutiveSummaryData 
} from '../../../data/types/operational-intelligence.types';
import { OperationalHealthEngine } from './operational-health.engine';
import { ProcessExecutionEngine } from './process-execution.engine';
import { LogisticsSupplyChainEngine } from './logistics-supply-chain.engine';
import { ProcurementEngine } from './procurement.engine';
import { OperationalExcellenceEngine } from './operational-excellence.engine';
import { OperationalBottleneckEngine } from './operational-bottleneck.engine';
import { OperationalDependencyEngine } from './operational-dependency.engine';

export class OperationalSnapshotGenerator {
  private healthEngine = new OperationalHealthEngine();
  private processEngine = new ProcessExecutionEngine();
  private logisticsEngine = new LogisticsSupplyChainEngine();
  private procurementEngine = new ProcurementEngine();
  private excellenceEngine = new OperationalExcellenceEngine();
  private bottleneckEngine = new OperationalBottleneckEngine();
  private dependencyEngine = new OperationalDependencyEngine();

  private createMetadata(context: ExecutiveContext, dataType: string): any {
    return {
      id: `meta-${Date.now()}`,
      periodId: 'current',
      generatedBy: 'system',
      lastUpdatedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      tenantId: 'unknown-tenant',
      contextSource: 'operational-governance-engines',
      dataType,
      version: '1.0'
    };
  }

  public async generateHealthScore(context: ExecutiveContext, rawData: any): Promise<ExecutiveOperationalHealthScore> {
    const data = await this.healthEngine.computeHealth(context, rawData);
    return {
      metadata: this.createMetadata(context, 'health-score'),
      ...data
    };
  }

  public async generateProcessExecution(context: ExecutiveContext, rawData: any): Promise<ProcessExecutionData> {
    const data = await this.processEngine.computeProcess(context, rawData);
    return {
      metadata: this.createMetadata(context, 'process-execution'),
      ...data
    };
  }

  public async generateLogisticsSupplyChain(context: ExecutiveContext, rawData: any): Promise<LogisticsSupplyChainData> {
    const data = await this.logisticsEngine.computeLogistics(context, rawData);
    return {
      metadata: this.createMetadata(context, 'logistics-supply-chain'),
      ...data
    };
  }

  public async generateProcurementIntelligence(context: ExecutiveContext, rawData: any): Promise<ProcurementIntelligenceData> {
    const data = await this.procurementEngine.computeProcurement(context, rawData);
    return {
      metadata: this.createMetadata(context, 'procurement-governance'),
      ...data
    };
  }

  public async generateOperationalExcellence(context: ExecutiveContext, rawData: any): Promise<OperationalExcellenceData> {
    const data = await this.excellenceEngine.computeExcellence(context, rawData);
    return {
      metadata: this.createMetadata(context, 'operational-excellence'),
      ...data
    };
  }

  public async generateExecutiveSummary(context: ExecutiveContext, rawData: any): Promise<OperationalExecutiveSummaryData> {
    const health = await this.healthEngine.computeHealth(context, rawData);
    const bottlenecks = await this.bottleneckEngine.computeBottlenecks(rawData);
    
    // Simplification for the summary
    return {
      metadata: this.createMetadata(context, 'operational-executive-summary'),
      operationalHealthScore: health.overallScore,
      operationalPressureIndex: rawData.operationalPressureIndex || 68,
      maturityLevel: rawData.maturityLevel || 'Standardized',
      topBottlenecks: bottlenecks.map(b => b.nodeName),
      criticalRisks: ['Risco de parada por fornecedor único', 'Saturação da linha principal de produção'],
      criticalInsights: health.criticalInsights
    };
  }
}
