import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutiveGovernanceHealthScore, 
  StrategicAlignmentData, 
  DecisionGovernanceData, 
  BoardIntelligenceData, 
  GovernanceMaturityData, 
  GovernanceExecutiveSummaryData 
} from '../types/governance-intelligence.types';

export interface GovernanceIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<ExecutiveGovernanceHealthScore>;
  getStrategicAlignment(context: ExecutiveContext): Promise<StrategicAlignmentData>;
  getDecisionGovernance(context: ExecutiveContext): Promise<DecisionGovernanceData>;
  getBoardIntelligence(context: ExecutiveContext): Promise<BoardIntelligenceData>;
  getGovernanceMaturity(context: ExecutiveContext): Promise<GovernanceMaturityData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<GovernanceExecutiveSummaryData>;
}
