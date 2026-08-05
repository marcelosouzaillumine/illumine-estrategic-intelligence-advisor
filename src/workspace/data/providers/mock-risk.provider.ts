import { ExecutiveContext } from '../../context/executive-context.types';
import { RiskIntelligenceProvider } from './risk-intelligence.provider';
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
import { InsightSeverity } from '../types/executive-insight.types';

export class MockRiskProvider implements RiskIntelligenceProvider {
  async getHealthScore(context: ExecutiveContext): Promise<ExecutiveRiskHealthScore> {
    return {
      overallScore: 68,
      strategicRiskScore: 72,
      operationalRiskScore: 65,
      financialRiskScore: 75,
      complianceRiskScore: 60,
      controlMaturityScore: 65,
      trend: 'deteriorating',
      criticalExposures: 4
    };
  }

  async getRiskAppetite(context: ExecutiveContext): Promise<RiskAppetiteData> {
    return {
      strategicRiskStatus: 'within_appetite',
      regulatoryRiskStatus: 'exceeding_appetite',
      financialRiskStatus: 'nearing_limit',
      operationalRiskStatus: 'exceeding_appetite',
      breachesCount: 2,
      appetiteAlignmentIndex: 65
    };
  }

  async getEnterpriseRiskOverview(context: ExecutiveContext): Promise<EnterpriseRiskOverviewData> {
    return {
      activeRisksCount: 45,
      criticalRisksCount: 8,
      highProbabilityHighImpact: 4,
      risksWithNoOwner: 6,
      risksWithoutMitigation: 12,
      riskExposureTrend: 'deteriorating'
    };
  }

  async getComplianceIntelligence(context: ExecutiveContext): Promise<ComplianceIntelligenceData> {
    return {
      activeRegulatoryObligations: 24,
      upcomingDeadlines30Days: 5,
      activePolicies: 18,
      nonConformities: 12,
      criticalComplianceGaps: 3,
      complianceAdherenceIndex: 78
    };
  }

  async getControlEffectiveness(context: ExecutiveContext): Promise<ControlEffectivenessData> {
    return {
      totalControls: 142,
      automatedControls: 35,
      failedTests30Days: 15,
      recurrentFailures: 8,
      controlMaturityLevel: 'Defined',
      controlEffectivenessIndex: 65
    };
  }

  async getAuditIntelligence(context: ExecutiveContext): Promise<AuditIntelligenceData> {
    return {
      openAuditFindings: 32,
      criticalFindings: 7,
      overdueActionPlans: 12,
      recurrentAuditIssues: 4,
      averageResolutionTimeDays: 45
    };
  }

  async getEnterpriseResilience(context: ExecutiveContext): Promise<EnterpriseResilienceData> {
    return {
      criticalBusinessProcesses: 14,
      processesWithoutContinuityPlan: 5,
      criticalSuppliersAtRisk: 3,
      keyPersonDependencyCount: 8,
      techSystemSinglePointOfFailures: 2,
      resilienceReadinessIndex: 70
    };
  }

  async getExecutiveSummary(context: ExecutiveContext): Promise<RiskExecutiveSummaryData> {
    return {
      healthScore: await this.getHealthScore(context),
      appetiteAlignment: await this.getRiskAppetite(context),
      criticalExposures: 4,
      overdueActionPlans: 12,
      complianceAdherenceIndex: 78,
      criticalRisks: ['Risco Regulatório Trabalhista (Apetite Excedido)', 'Falta de Plano de Continuidade em Logística'],
      criticalInsights: [
        {
          id: 'risk1',
          title: 'Exposição Operacional Ameaça Apetite de Risco Estratégico',
          narrative: 'A falha recorrente em controles operacionais no CD Principal somada ao alto turnover na operação logística elevou a exposição operacional acima da tolerância aprovada pelo conselho.',
          severity: 'critical' as InsightSeverity,
          evidence: ['Turnover Logística > 15%', '3 controles preventivos falhos', 'Appetite status: Excedido'],
          impact: 'Possível quebra de SLA na entrega de Q4, ameaçando meta de receita',
          recommendation: 'Reunião executiva de emergência com COO e CHRO para mitigar sobrecarga humana.',
          affectedOffice: 'risk',
          relatedOffices: ['governance', 'coo', 'people', 'cfo']
        }
      ]
    };
  }
}
