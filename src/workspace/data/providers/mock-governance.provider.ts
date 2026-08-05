import { ExecutiveContext } from '../../context/executive-context.types';
import { GovernanceIntelligenceProvider } from './governance-intelligence.provider';
import { 
  ExecutiveGovernanceHealthScore, 
  StrategicAlignmentData, 
  DecisionGovernanceData, 
  BoardIntelligenceData, 
  GovernanceMaturityData, 
  GovernanceExecutiveSummaryData 
} from '../types/governance-intelligence.types';
import { InsightSeverity } from '../types/executive-insight.types';

export class MockGovernanceProvider implements GovernanceIntelligenceProvider {
  async getHealthScore(context: ExecutiveContext): Promise<ExecutiveGovernanceHealthScore> {
    return {
      score: 76,
      trend: 'stable',
      components: {
        strategicAlignment: 82,
        decisionEffectiveness: 68,
        accountability: 74,
        executionGovernance: 79,
        transparency: 85
      }
    };
  }

  async getStrategicAlignment(context: ExecutiveContext): Promise<StrategicAlignmentData> {
    return {
      strategicObjectivesCount: 12,
      okrsOnTrackPercentage: 0.65,
      criticalGoalsAtRisk: 3,
      strategyExecutionIndex: 72,
      alignmentScore: 82
    };
  }

  async getDecisionGovernance(context: ExecutiveContext): Promise<DecisionGovernanceData> {
    return {
      openDecisions: 24,
      approvedDecisions: 115,
      delayedDecisions: 8,
      averageDecisionTimeDays: 14,
      decisionsByLifecycle: {
        Identified: 5,
        Analyzed: 9,
        Approved: 10,
        Executing: 18,
        Measured: 12,
        Closed: 85
      },
      criticalDecisionsWithoutAction: 3
    };
  }

  async getBoardIntelligence(context: ExecutiveContext): Promise<BoardIntelligenceData> {
    return {
      upcomingBoardMeetings: 2,
      criticalTopicsPending: 5,
      pendingBoardResolutions: 3,
      boardPackReadinessIndex: 85,
      executiveCommitmentsAtRisk: 2
    };
  }

  async getGovernanceMaturity(context: ExecutiveContext): Promise<GovernanceMaturityData> {
    return {
      processMaturityLevel: 'Managed',
      activeForumsCount: 8,
      managementCadenceAdherence: 0.88,
      auditFindingsOpen: 4,
      transparencyIndex: 85
    };
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<GovernanceExecutiveSummaryData> {
    return {
      healthScore: 76,
      strategyExecutionIndex: 72,
      delayedDecisions: 8,
      managementCadenceAdherence: 0.88,
      criticalRisks: ['Decisões críticas de CapEx sem dono', 'Desalinhamento nos OKRs do trimestre atual'],
      criticalInsights: [
        {
          id: 'gov1',
          title: 'Decisões de Expansão Operacional Travadas',
          narrative: 'Existem 3 decisões estratégicas de expansão paradas há mais de 30 dias na fase de análise, atrasando a meta de crescimento comercial e impactando projeções financeiras.',
          severity: 'critical' as InsightSeverity,
          evidence: ['3 Decisões > 30 dias', 'Owner não definido'],
          impact: 'Atraso no rollout de 2 novas filiais',
          recommendation: 'Definir owner executivo na próxima reunião de diretoria e escalar para o Board.',
          affectedOffice: 'governance',
          relatedOffices: ['ceo', 'cfo', 'coo', 'commercial']
        }
      ]
    };
  }
}
