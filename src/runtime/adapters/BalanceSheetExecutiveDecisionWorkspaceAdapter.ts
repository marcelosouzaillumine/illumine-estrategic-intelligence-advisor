import { 
  ExecutiveDecisionWorkspaceModel, 
  ExecutiveDecisionStatus, 
  ExecutiveConfidenceLevel, 
  ExecutiveExecutionStep 
} from '../../types/executive/ExecutiveDecisionWorkspaceModel';

// Legacy Type definitions representing the old runtime format
export type LegacyExecutivePlanAction = {
  prazo: string;
  acao: string;
};

export type LegacyBalanceSheetExecutivePlanProps = {
  executivePlan?: string;
  dominantRiskFamily?: string;
  executiveInterpretation?: {
    strategicSeverity?: string;
    strategicSeverityReason?: string;
    planFinanceiro?: LegacyExecutivePlanAction;
    planOperacional?: LegacyExecutivePlanAction;
    planGovernanca?: LegacyExecutivePlanAction;
  };
  strategicSeverity?: string;
  strategicSeverityReason?: string;
  executiveAnalysisContext?: any;
};

export class BalanceSheetExecutiveDecisionWorkspaceAdapter {
  
  static adapt(data: LegacyBalanceSheetExecutivePlanProps): ExecutiveDecisionWorkspaceModel {
    const finalSeverity = data.strategicSeverity ?? data.executiveInterpretation?.strategicSeverity;
    const finalMotive = data.strategicSeverityReason ?? data.executiveInterpretation?.strategicSeverityReason;

    const getStatus = (severity?: string): ExecutiveDecisionStatus => {
      switch(severity) {
        case 'CRITICAL': return 'CRITICAL';
        case 'WARNING': return 'ATTENTION';
        case 'HEALTHY': return 'MONITORING';
        case 'HIGH': return 'CRITICAL';
        case 'MODERATE': return 'EXECUTION';
        default: return 'MONITORING';
      }
    };

    const getConfidence = (severity?: string): ExecutiveConfidenceLevel => {
      if (severity === 'CRITICAL' || severity === 'HIGH') return 'HIGH';
      return 'MEDIUM';
    };

    const getConfidenceLabel = (conf: ExecutiveConfidenceLevel): string => {
      switch(conf) {
        case 'HIGH': return 'ALTA';
        case 'MEDIUM': return 'MÉDIA';
        case 'LOW': return 'BAIXA';
        default: return 'INDISPONÍVEL';
      }
    };

    const getStatusLabel = (stat: ExecutiveDecisionStatus): string => {
      switch(stat) {
        case 'CRITICAL': return 'CRÍTICA';
        case 'ATTENTION': return 'ATENÇÃO';
        case 'MONITORING': return 'MONITORAMENTO';
        case 'EXECUTION': return 'EXECUÇÃO';
        case 'OPTIMIZATION': return 'OTIMIZAÇÃO';
        case 'COMPLETED': return 'CONCLUÍDO';
        default: return 'INDISPONÍVEL';
      }
    };

    const parseExecutivePlanLegacyString = (str?: string) => {
      if (!str || str.trim() === '' || str.includes('Plano Executivo |') && str.length < 20) {
        return { decision: 'Revisão estratégica necessária.', rationale: 'Necessidade de intervenção tática imediata devido à ausência de diretrizes formatadas.' };
      }
      if (str.includes('|')) {
        const parts = str.split('|');
        return {
          decision: parts[1]?.trim() || str.replace('|', '').trim(),
          rationale: parts[2]?.trim() || str.replace('|', '').trim()
        };
      }
      return { decision: str, rationale: str };
    };

    const parsedPlan = parseExecutivePlanLegacyString(data.executivePlan);
    const finalStatus = getStatus(finalSeverity);
    const finalConfidence = getConfidence(finalSeverity);

    const steps: ExecutiveExecutionStep[] = [];
    if (data.executiveInterpretation?.planFinanceiro) {
      steps.push({
        domain: 'Financeiro',
        horizon: data.executiveInterpretation.planFinanceiro.prazo,
        description: data.executiveInterpretation.planFinanceiro.acao,
        isPrimaryStep: true
      });
    }
    if (data.executiveInterpretation?.planOperacional) {
      steps.push({
        domain: 'Operacional',
        horizon: data.executiveInterpretation.planOperacional.prazo,
        description: data.executiveInterpretation.planOperacional.acao
      });
    }
    if (data.executiveInterpretation?.planGovernanca) {
      steps.push({
        domain: 'Governança',
        horizon: data.executiveInterpretation.planGovernanca.prazo,
        description: data.executiveInterpretation.planGovernanca.acao
      });
    }

    return {
      sectionTitle: "Plano Executivo Recomendado",
      sectionSubtitle: "Ações priorizadas pela plataforma para fortalecer a posição institucional e orientar as decisões da Diretoria e do Conselho.",
      status: finalStatus,
      statusLabel: getStatusLabel(finalStatus),
      confidence: finalConfidence,
      confidenceLabel: getConfidenceLabel(finalConfidence),
      objective: data.dominantRiskFamily || 'Otimização Estratégica',
      recommendedDecision: parsedPlan.decision,
      rationale: parsedPlan.rationale,
      primaryDriver: finalMotive || 'Autonomia Financeira Robusta',
      steps: steps
    };
  }
}
