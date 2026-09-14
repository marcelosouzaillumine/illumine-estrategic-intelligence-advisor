import { ExecutivePriority, ActionPlan, TrackArea } from './PrescriptiveTypes';
import { PredictiveRiskOutput, EmergingRisk } from '../predictive-governance/PredictiveRiskEngine';

export class PrescriptiveActionEngine {
  static generateActions(riskOutput: PredictiveRiskOutput): ExecutivePriority[] {
    if (riskOutput.confidenceLevel === 'INSUFFICIENT_HISTORY' || riskOutput.emergingRisks.length === 0) {
      return [];
    }

    const priorities: ExecutivePriority[] = [];

    riskOutput.emergingRisks.forEach((risk, index) => {
      const actionMap = this.mapRiskToAction(risk);
      priorities.push({
        actionId: `act_${Date.now()}_${index}`,
        title: actionMap.title,
        description: actionMap.description,
        urgency: this.mapUrgency(risk.severityLabel),
        impact: this.mapImpact(risk.category),
        track: actionMap.track,
        priorityScore: 0, // Set by FiduciaryPriorityEngine later
        priorityRank: 0, // Set by FiduciaryPriorityEngine later
        priorityReason: '',
        confidenceLevel: riskOutput.confidenceLevel,
        confidenceReason: riskOutput.confidenceReason,
        actionPlan: {
          id: `plan_${Date.now()}_${index}`,
          title: `Plano de Ação: ${actionMap.title}`,
          description: actionMap.actionDescription,
          expectedOutcome: actionMap.expectedOutcome,
          primaryTrack: actionMap.track
        }
      });
    });

    return priorities;
  }

  private static mapUrgency(severity: string): 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' {
    switch (severity) {
      case 'CRITICAL': return 'CRITICAL';
      case 'HIGH': return 'HIGH';
      case 'MODERATE': return 'MODERATE';
      default: return 'LOW';
    }
  }

  private static mapImpact(type: string): 'SYSTEMIC' | 'SIGNIFICANT' | 'MODERATE' | 'MARGINAL' {
    if (type === 'LIQUIDITY_RISK' || type === 'SOLVENCY_RISK') return 'SYSTEMIC';
    if (type === 'GOVERNANCE_BREAKDOWN' || type === 'OPERATIONAL_RISK') return 'SIGNIFICANT';
    return 'MODERATE';
  }

  private static mapRiskToAction(risk: EmergingRisk): { title: string; description: string; actionDescription: string; expectedOutcome: string; track: TrackArea } {
    if (risk.category === 'LIQUIDITY_RISK' as any) {
      return {
        title: 'Reforço de Capital de Giro',
        description: 'Intervenção imediata para alongamento de dívida e preservação de caixa.',
        actionDescription: '1. Renegociar dívidas de ciclo imediato. 2. Congelar CAPEX não essencial. 3. Antecipar recebíveis.',
        expectedOutcome: 'Redução da exposição financeira e restauração do capital de giro.',
        track: 'LIQUIDITY'
      };
    }
    if (risk.category === 'GOVERNANCE_RISK' as any) {
      return {
        title: 'Revisão do Board Composition',
        description: 'Restabelecer controles fiduciários após desgaste consecutivo em governança.',
        actionDescription: '1. Convocar comitê de risco extraordinário. 2. Nomear conselheiro independente. 3. Revisar matriz de alçada.',
        expectedOutcome: 'Mitigação de risco fiduciário e proteção dos diretores estatutários.',
        track: 'GOVERNANCE'
      };
    }
    if (risk.category === 'EXECUTION_RISK' as any) {
      return {
        title: 'Otimização de Custos e Escalabilidade',
        description: 'Adequar a estrutura de custos operacionais face à queima contínua de margem.',
        actionDescription: '1. Auditoria de contratos de fornecedores. 2. Otimização de quadro. 3. Redução de despesas fixas.',
        expectedOutcome: 'Recuperação de margem operacional.',
        track: 'OPERATIONS'
      };
    }
    if (risk.category === 'CAPITAL_RISK' as any) {
      return {
        title: 'Reestruturação de Capital',
        description: 'Injeção de capital ou venda de ativos para evitar insolvência.',
        actionDescription: '1. Avaliar captação via equity. 2. Estruturar plano de alienação de ativos não core.',
        expectedOutcome: 'Restauração dos índices de solvência institucional.',
        track: 'CAPITAL'
      };
    }
    
    // Fallback
    return {
      title: 'Auditoria de Conformidade ESG',
      description: 'Revisão dos fatores de sustentabilidade e risco socioambiental.',
      actionDescription: '1. Revisão de compliance. 2. Implementação de KPIs ESG.',
      expectedOutcome: 'Alinhamento às melhores práticas de sustentabilidade.',
      track: 'ESG'
    };
  }
}
