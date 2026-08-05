import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutivePeopleHealthScore, 
  WorkforceIntelligenceData, 
  OrganizationalCultureData, 
  LeadershipIntelligenceData, 
  PeopleFinancialImpactData, 
  CapabilityDevelopmentData, 
  OrganizationalIntelligenceData, 
  WorkforceCapacityData, 
  PeopleExecutiveSummaryData 
} from '../types/people-intelligence.types';

export interface PeopleIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<ExecutivePeopleHealthScore>;
  getWorkforceIntelligence(context: ExecutiveContext): Promise<WorkforceIntelligenceData>;
  getOrganizationalCulture(context: ExecutiveContext): Promise<OrganizationalCultureData>;
  getLeadershipIntelligence(context: ExecutiveContext): Promise<LeadershipIntelligenceData>;
  getPeopleFinancialImpact(context: ExecutiveContext): Promise<PeopleFinancialImpactData>;
  getCapabilityDevelopment(context: ExecutiveContext): Promise<CapabilityDevelopmentData>;
  getOrganizationalIntelligence(context: ExecutiveContext): Promise<OrganizationalIntelligenceData>;
  getWorkforceCapacity(context: ExecutiveContext): Promise<WorkforceCapacityData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<PeopleExecutiveSummaryData>;
}
