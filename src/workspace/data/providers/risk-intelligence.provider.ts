import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutiveRiskHealthScore, 
  EnterpriseRiskOverviewData,
  RiskAppetiteData,
  ComplianceIntelligenceData, 
  ControlEffectivenessData, 
  AuditIntelligenceData, 
  EnterpriseResilienceData, 
  RiskExecutiveSummaryData 
} from '../types/risk-intelligence.types';

export interface RiskIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<ExecutiveRiskHealthScore>;
  getRiskAppetite(context: ExecutiveContext): Promise<RiskAppetiteData>;
  getEnterpriseRiskOverview(context: ExecutiveContext): Promise<EnterpriseRiskOverviewData>;
  getComplianceIntelligence(context: ExecutiveContext): Promise<ComplianceIntelligenceData>;
  getControlEffectiveness(context: ExecutiveContext): Promise<ControlEffectivenessData>;
  getAuditIntelligence(context: ExecutiveContext): Promise<AuditIntelligenceData>;
  getEnterpriseResilience(context: ExecutiveContext): Promise<EnterpriseResilienceData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<RiskExecutiveSummaryData>;
}
