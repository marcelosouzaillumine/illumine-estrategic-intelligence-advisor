import { ExecutiveContext } from '../../context/executive-context.types';
import { InnovationIntelligenceProvider } from './innovation-intelligence.provider';
import { 
  ExecutiveInnovationHealthScore, 
  InnovationPortfolioData,
  OpportunityIntelligenceData,
  ExperimentManagementData, 
  DigitalTransformationData, 
  KnowledgeEvolutionData, 
  InnovationExecutiveSummaryData 
} from '../types/innovation-intelligence.types';
import { InsightSeverity } from '../types/executive-insight.types';

export class MockInnovationProvider implements InnovationIntelligenceProvider {
  async getHealthScore(context: ExecutiveContext): Promise<ExecutiveInnovationHealthScore> {
    return {
      overallScore: 71,
      pipelineScore: 75,
      portfolioScore: 68,
      experimentationScore: 82,
      digitalMaturityScore: 65,
      knowledgeScore: 65,
      innovationVelocity: 4.2,
      strategicAlignment: 85,
      trend: 'accelerating'
    };
  }

  async getPortfolio(context: ExecutiveContext): Promise<InnovationPortfolioData> {
    return {
      activeProjects: 14,
      strategicInitiatives: 4,
      totalCapexAllocated: 12500000,
      expectedROI: 18.5,
      projectsAtRisk: 2,
      portfolioAlignmentIndex: 85
    };
  }

  async getOpportunityIntelligence(context: ExecutiveContext): Promise<OpportunityIntelligenceData> {
    return {
      mappedMarketTrends: 8,
      disruptiveThreats: 3,
      newBusinessTheses: 5,
      strategicPartnerships: 2,
      opportunityCaptureRate: 35
    };
  }

  async getExperimentManagement(context: ExecutiveContext): Promise<ExperimentManagementData> {
    return {
      activeExperiments: 22,
      fastFailRate: 68,
      successfulConversions: 4,
      averageExperimentCycleDays: 45,
      innovationFunnelYield: 18
    };
  }

  async getDigitalTransformation(context: ExecutiveContext): Promise<DigitalTransformationData> {
    return {
      digitalMaturityLevel: 'Developing',
      automationRate: 42,
      techAdoptionIndex: 65,
      legacySystemsToModernize: 7,
      digitalTransformationROI: 12.4
    };
  }

  async getKnowledgeEvolution(context: ExecutiveContext): Promise<KnowledgeEvolutionData> {
    return {
      strategicTrainingHours: 1240,
      activeCommunitiesOfPractice: 6,
      knowledgeRetentionIndex: 78,
      internalSMEs: 45,
      organizationalLearningRate: 72
    };
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<InnovationExecutiveSummaryData> {
    return {
      healthScore: await this.getHealthScore(context),
      velocity: 4.2,
      strategicAlignment: 85,
      activeProjects: 14,
      digitalMaturityLevel: 'Developing',
      criticalInsights: [
        {
          id: 'inv1',
          title: 'Atraso em Projeto de Automação Afeta Margem Operacional',
          narrative: 'O projeto ERP Digital (Transformação Digital) apresenta atraso crítico de 60 dias. Isso está retardando o ganho de eficiência no backoffice e desengajando a base de usuários da operação logística.',
          severity: 'high' as InsightSeverity,
          evidence: ['Atraso > 60 dias', 'Maturidade Digital estacionada em 65'],
          impact: 'Aumento do custo operacional projetado em R$ 450k no Q3 e perda de eficiência produtiva.',
          recommendation: 'Alocação emergencial de SME (Subject Matter Experts) do RH para treinar equipe e intervenção do COO na gestão de fornecedores.',
          affectedOffice: 'innovation',
          relatedOffices: ['ceo', 'cfo', 'coo', 'people', 'commercial', 'risk']
        }
      ]
    };
  }
}
