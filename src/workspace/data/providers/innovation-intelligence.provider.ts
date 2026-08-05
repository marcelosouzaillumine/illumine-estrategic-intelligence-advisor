import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutiveInnovationHealthScore, 
  InnovationPortfolioData,
  OpportunityIntelligenceData,
  ExperimentManagementData, 
  DigitalTransformationData, 
  KnowledgeEvolutionData, 
  InnovationExecutiveSummaryData 
} from '../types/innovation-intelligence.types';

export interface InnovationIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<ExecutiveInnovationHealthScore>;
  getPortfolio(context: ExecutiveContext): Promise<InnovationPortfolioData>;
  getOpportunityIntelligence(context: ExecutiveContext): Promise<OpportunityIntelligenceData>;
  getExperimentManagement(context: ExecutiveContext): Promise<ExperimentManagementData>;
  getDigitalTransformation(context: ExecutiveContext): Promise<DigitalTransformationData>;
  getKnowledgeEvolution(context: ExecutiveContext): Promise<KnowledgeEvolutionData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<InnovationExecutiveSummaryData>;
}
