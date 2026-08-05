import { ExecutiveInsight } from './executive-insight.types';
import { ExecutiveDataPayload } from './executive-snapshot.types';

export type OperationalMaturityLevel = 'Initial' | 'Managed' | 'Standardized' | 'Optimized' | 'Intelligent';

export interface ExecutiveOperationalHealthScore extends ExecutiveDataPayload {
  overallScore: number; // 0-100
  processScore: number; // 35%
  capacityScore: number; // 20%
  logisticsScore: number; // 15%
  procurementScore: number; // 15%
  continuousImprovementScore: number; // 15%
  criticalInsights: ExecutiveInsight[];
}

export interface ProcessExecutionData extends ExecutiveDataPayload {
  metrics: {
    productivity: number; // e.g. units/hour or tasks/hour
    efficiency: number; // %
    capacityUtilization: number; // %
    cycleTime: number; // minutes or hours
  };
  bottlenecks: string[];
  queueSize: number;
  oee?: number; // Overall Equipment Effectiveness (if applicable)
  quality?: number; // % (if applicable)
  insights: ExecutiveInsight[];
}

export interface LogisticsSupplyChainData extends ExecutiveDataPayload {
  metrics: {
    slaCompliance: number; // %
    otif: number; // On Time In Full %
    transportationCost: number;
    inventoryValue: number;
  };
  distributionRisk: string;
  insights: ExecutiveInsight[];
}

export interface ProcurementIntelligenceData extends ExecutiveDataPayload {
  metrics: {
    savingYTD: number;
    averageLeadTime: number; // days
    supplierConcentration: number; // % in top 5 suppliers
  };
  criticalSuppliersCount: number;
  supplyRiskStatus: 'low' | 'medium' | 'high' | 'critical';
  insights: ExecutiveInsight[];
}

export interface OperationalExcellenceData extends ExecutiveDataPayload {
  metrics: {
    activeProjects: number;
    wasteReductionValue: number;
    roiFromImprovements: number;
  };
  frameworks: string[]; // e.g. Lean, Six Sigma, Kaizen
  insights: ExecutiveInsight[];
}

export interface OperationalExecutiveSummaryData extends ExecutiveDataPayload {
  operationalHealthScore: number;
  operationalPressureIndex: number; // Synthesizes backlog, delays, occupation, risk (0-100)
  maturityLevel: OperationalMaturityLevel;
  topBottlenecks: string[];
  criticalRisks: string[];
  criticalInsights: ExecutiveInsight[];
}
