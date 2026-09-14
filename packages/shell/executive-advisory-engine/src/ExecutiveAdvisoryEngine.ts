import {
  ExecutiveDecisionContext,
  ExecutiveAdvisoryOpportunity,
  ExecutiveRecommendationContract,
  ExecutiveActionPlanContract
} from '@illumine/executive-contracts';
import { ExecutiveOpportunityDetector } from './ExecutiveOpportunityDetector';
import { ExecutiveDecisionPrioritizer } from './ExecutiveDecisionPrioritizer';
import { ExecutiveRecommendationEngine } from './ExecutiveRecommendationEngine';
import { ExecutiveScenarioSimulator, ScenarioDefinition } from './ExecutiveScenarioSimulator';

export interface AdvisoryOrchestrationResult {
  readonly opportunity: ExecutiveAdvisoryOpportunity;
  readonly priorityScore: number;
  readonly recommendation: ExecutiveRecommendationContract;
  readonly simulatedScenarios: readonly ScenarioDefinition[];
  readonly actionPlan: ExecutiveActionPlanContract;
}

export class ExecutiveAdvisoryEngine {
  public static orchestrateAdvisoryCycle(context: ExecutiveDecisionContext): AdvisoryOrchestrationResult | null {
    const rawOpportunities = ExecutiveOpportunityDetector.detectOpportunities(context);
    if (rawOpportunities.length === 0) return null;

    const ranked = ExecutiveDecisionPrioritizer.rankOpportunities(rawOpportunities);
    const topOpportunity = ranked[0];

    const priorityScore = ExecutiveDecisionPrioritizer.calculatePriorityScore(topOpportunity);
    const recommendation = ExecutiveRecommendationEngine.generateRecommendation(topOpportunity);
    const simulatedScenarios = ExecutiveScenarioSimulator.simulateScenarios(recommendation);

    const actionPlan: ExecutiveActionPlanContract = {
      actionId: `act-${recommendation.recommendationId}`,
      recommendationId: recommendation.recommendationId,
      owner: 'Diretor Financeiro (CFO)',
      responsibleArea: 'Controladoria & Tesouraria',
      deadline: '30 dias',
      milestones: [
        { milestoneId: 'm1', title: 'Aprovação pelo Conselho', dueDate: '7 dias', isCompleted: true },
        { milestoneId: 'm2', title: 'Assinatura dos aditivos contratuais', dueDate: '21 dias', isCompleted: false },
        { milestoneId: 'm3', title: 'Quitação das dívidas de curto prazo', dueDate: '30 dias', isCompleted: false }
      ],
      expectedOutcome: recommendation.expectedKPIShift,
      executionStatus: 'IN_PROGRESS'
    };

    return {
      opportunity: topOpportunity,
      priorityScore,
      recommendation,
      simulatedScenarios,
      actionPlan
    };
  }
}
