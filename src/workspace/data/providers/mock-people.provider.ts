import { ExecutiveContext } from '../../context/executive-context.types';
import { PeopleIntelligenceProvider } from './people-intelligence.provider';
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
import { InsightSeverity } from '../types/executive-insight.types';

export class MockPeopleProvider implements PeopleIntelligenceProvider {
  async getHealthScore(context: ExecutiveContext): Promise<ExecutivePeopleHealthScore> {
    return {
      score: 72,
      trend: 'stable',
      components: {
        workforceCapacity: 68,
        culture: 75,
        leadership: 80,
        capabilityDevelopment: 65,
        financialImpact: 70,
        organizationalResilience: 74
      }
    };
  }

  async getWorkforceIntelligence(context: ExecutiveContext): Promise<WorkforceIntelligenceData> {
    return {
      headcount: 450,
      openPositions: 24,
      turnoverRate: 0.12,
      retentionRate: 0.88,
      absenteeismRate: 0.03,
      timeToFill: 42
    };
  }

  async getOrganizationalCulture(context: ExecutiveContext): Promise<OrganizationalCultureData> {
    return {
      eNPS: 45,
      cultureAlignmentScore: 82,
      diversityIndex: 65,
      employeeSatisfaction: 78,
      burnoutRiskIndex: 40
    };
  }

  async getLeadershipIntelligence(context: ExecutiveContext): Promise<LeadershipIntelligenceData> {
    return {
      leadershipReadiness: 0.75,
      successionPipelineCoverage: 0.60,
      managementToStaffRatio: 0.15,
      leadershipTurnover: 0.05,
      strategicAlignment: 0.85
    };
  }

  async getPeopleFinancialImpact(context: ExecutiveContext): Promise<PeopleFinancialImpactData> {
    return {
      totalPayroll: 3500000,
      revenuePerEmployee: 120000,
      profitPerEmployee: 15000,
      laborCostPercentage: 0.35,
      laborLiabilitiesRisk: 120000
    };
  }

  async getCapabilityDevelopment(context: ExecutiveContext): Promise<CapabilityDevelopmentData> {
    return {
      trainingAdoptionRate: 0.65,
      averageTrainingHours: 18,
      skillsGapIndex: 35,
      roiOnTraining: 1.5,
      complianceTrainingCompletion: 0.95
    };
  }

  async getOrganizationalIntelligence(context: ExecutiveContext): Promise<OrganizationalIntelligenceData> {
    return {
      crossFunctionalCollaboration: 0.60,
      siloIndex: 0.70,
      decisionBottlenecks: 12,
      knowledgeConcentrationRisk: 0.65,
      agilityIndex: 0.55
    };
  }

  async getWorkforceCapacity(context: ExecutiveContext): Promise<WorkforceCapacityData> {
    return {
      installedCapacity: 18000,
      utilizedCapacity: 16500,
      overloadIndex: 0.85,
      futureCapacityNeed: 19500,
      criticalBottlenecks: ['Engenharia de Dados', 'Atendimento N3']
    };
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<PeopleExecutiveSummaryData> {
    return {
      healthScore: 72,
      maturityLevel: 'Standardized',
      capacityUtilization: 0.92,
      eNPS: 45,
      laborCostPercentage: 0.35,
      criticalRisks: ['Risco de burnout em times de TI', 'Silos entre Comercial e Operações'],
      topBottlenecks: ['Engenharia de Dados', 'Sucessão de Liderança'],
      criticalInsights: [
        {
          id: 'p1',
          title: 'Alto Turnover Comercial Afetando Vendas',
          narrative: 'A rotatividade da equipe comercial está em 18%, afetando diretamente o atingimento da meta de receita.',
          severity: 'warning' as InsightSeverity,
          evidence: ['Turnover Comercial: 18%', 'Queda de Vendas M/M: 5%'],
          impact: 'Risco de perder R$ 2M no trimestre',
          recommendation: 'Acelerar ramp-up pelo Academy e revisar remuneração variável.',
          affectedOffice: 'people',
          relatedOffices: ['cfo', 'commercial', 'coo']
        }
      ]
    };
  }
}
