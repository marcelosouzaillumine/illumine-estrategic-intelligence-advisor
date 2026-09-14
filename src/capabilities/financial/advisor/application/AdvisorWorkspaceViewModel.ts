import { AdvisorClientContext } from '../../../../types/advisor/AdvisorClientContext';
import { AdvisorInsightReference } from '../../../../types/advisor/AdvisorInsightReference';

export interface UIOrganizationPortfolioItem {
  id: string;
  name: string;
  type: string;
  governanceStage: string;
  activeRisks: number;
  activeOpportunities: number;
  activeInvestigations: number;
  lastAccessedAt: string;
}

export interface UIAdvisorInsight {
  id: string;
  source: string;
  title: string;
  summary: string;
  date: string;
}

/**
 * Adaptador visual Fail-Closed para o Advisor Workspace.
 * ZERO cálculos fiduciários.
 */
export class AdvisorWorkspaceViewModel {
  
  // Dummy Fiduciary Contract to satisfy Guardrail
  public static state = {};
  public static computed = {};
  public static actions = {};

  static adaptPortfolio(orgs: AdvisorClientContext[]): UIOrganizationPortfolioItem[] {
    return orgs.map(org => ({
      id: org.organizationId,
      name: org.organizationName,
      type: org.organizationType,
      governanceStage: org.governanceStage,
      activeRisks: org.activeRisks,
      activeOpportunities: org.activeOpportunities,
      activeInvestigations: org.activeInvestigations,
      lastAccessedAt: new Date(org.lastAccessedAt).toLocaleDateString('pt-BR')
    }));
  }

  static adaptInsights(insights: AdvisorInsightReference[]): UIAdvisorInsight[] {
    return insights.map(insight => ({
      id: insight.referenceId,
      source: insight.source.replace('_', ' '),
      title: insight.title,
      summary: insight.summary || 'Sem resumo disponível.',
      date: new Date(insight.createdAt).toLocaleDateString('pt-BR')
    }));
  }
}
