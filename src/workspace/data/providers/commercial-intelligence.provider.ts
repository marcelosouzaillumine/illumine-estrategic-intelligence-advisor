import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  CommercialPerformanceData, 
  PipelineIntelligenceData, 
  CustomerIntelligenceData, 
  MarketOpportunityData, 
  CommercialExecutiveSummaryData, 
  CommercialHealthScore 
} from '../types/commercial-intelligence.types';

export interface CommercialIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<CommercialHealthScore>;
  getPerformance(context: ExecutiveContext): Promise<CommercialPerformanceData>;
  getPipelineIntelligence(context: ExecutiveContext): Promise<PipelineIntelligenceData>;
  getCustomerIntelligence(context: ExecutiveContext): Promise<CustomerIntelligenceData>;
  getMarketOpportunities(context: ExecutiveContext): Promise<MarketOpportunityData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<CommercialExecutiveSummaryData>;
}
