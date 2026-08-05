import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutiveOperationalHealthScore, 
  ProcessExecutionData, 
  LogisticsSupplyChainData, 
  ProcurementIntelligenceData, 
  OperationalExcellenceData, 
  OperationalExecutiveSummaryData 
} from '../types/operational-intelligence.types';
import { OperationalSnapshotGenerator } from '../../intelligence/coo/engines/operational-snapshot.generator';

export class MockCooProvider {
  private generator = new OperationalSnapshotGenerator();
  private mockRawData = {
    processScore: 82,
    capacityScore: 88,
    logisticsScore: 85,
    procurementScore: 80,
    continuousImprovementScore: 78,
    productivity: 115.5,
    efficiency: 0.85,
    capacityUtilization: 0.88,
    cycleTime: 42.1,
    bottlenecks: ['Linha de Embalagem 2', 'Aprovação de Qualidade'],
    queueSize: 215,
    oee: 0.76,
    quality: 0.98,
    slaCompliance: 0.95,
    otif: 0.92,
    transportationCost: 135000,
    inventoryValue: 750000,
    distributionRisk: 'Low',
    savingYTD: 250000,
    averageLeadTime: 12.5,
    supplierConcentration: 0.35,
    criticalSuppliersCount: 8,
    supplyRiskStatus: 'low',
    activeProjects: 5,
    wasteReductionValue: 85000,
    roiFromImprovements: 2.8,
    frameworks: ['Lean', '5S'],
    operationalPressureIndex: 65,
    maturityLevel: 'Standardized'
  };

  public async getHealthScore(context: ExecutiveContext): Promise<ExecutiveOperationalHealthScore> {
    return this.generator.generateHealthScore(context, this.mockRawData);
  }

  public async getProcessExecution(context: ExecutiveContext): Promise<ProcessExecutionData> {
    return this.generator.generateProcessExecution(context, this.mockRawData);
  }

  public async getLogisticsSupplyChain(context: ExecutiveContext): Promise<LogisticsSupplyChainData> {
    return this.generator.generateLogisticsSupplyChain(context, this.mockRawData);
  }

  public async getProcurementIntelligence(context: ExecutiveContext): Promise<ProcurementIntelligenceData> {
    return this.generator.generateProcurementIntelligence(context, this.mockRawData);
  }

  public async getOperationalExcellence(context: ExecutiveContext): Promise<OperationalExcellenceData> {
    return this.generator.generateOperationalExcellence(context, this.mockRawData);
  }

  public async getExecutiveSummary(context: ExecutiveContext): Promise<OperationalExecutiveSummaryData> {
    return this.generator.generateExecutiveSummary(context, this.mockRawData);
  }
}
