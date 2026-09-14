import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';
import { ExecutivePolicy, ExecutivePolicyRules } from '../policy/ExecutivePolicyRules';
import { ExecutiveInsightCategory, ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { ExecutivePriorityEngine, PriorityProfile } from '../policy/ExecutivePriorityEngine';
import { DecisionIntentResult } from '../governance/DecisionIntentGuard';

export class ExecutiveDiagnosisBuilder {
  /**
   * Constrói o diagnóstico executivo cruzando Estado, Política, Prioridade e Intento.
   */
  public static build(
    state: ExecutiveFinancialState,
    policy: ExecutivePolicy,
    intentResult: DecisionIntentResult,
    memoryAlerts: string[],
    evidenceHash: string
  ): ExecutiveDiagnosis {
    
    // Determinar a hierarquia real baseada na política e no profile padrão
    const prioritizedInsights = ExecutivePriorityEngine.prioritize(policy.allowedInsights);
    
    const primaryDriver: ExecutiveInsightCategory = prioritizedInsights.length > 0 ? prioritizedInsights[0] : 'CASH';
    const secondaryDrivers = prioritizedInsights.slice(1, 4); // Pega os próximos 3
    
    let summary = '';
    if (state.status === 'CRITICAL') {
      summary = `Financial Condition Assessment: CRITICAL. Priority: PRESERVE CAPITAL. Driver: ${primaryDriver}. Narrative: RESTRICTED.`;
    } else if (state.status === 'HEALTHY') {
      summary = `Financial Condition Assessment: HEALTHY. Priority: ACCELERATE GROWTH. Driver: ${primaryDriver}. Narrative: FULL.`;
    } else {
      summary = `Financial Condition Assessment: ${state.status}. Priority: ${policy.decisionMode}. Driver: ${primaryDriver}. Narrative: RESTRICTED.`;
    }

    if (intentResult.status === 'BLOCKED') {
      summary += ` | Intent Blocked: ${intentResult.reason}`;
    }

    if (memoryAlerts.length > 0) {
      summary += ` | Institutional Memory: Active warnings.`;
    }

    return {
      id: `ED-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      evidenceHash,
      policyVersion: ExecutivePolicyRules.VERSION,
      knowledgeVersion: 'v1.0',
      validatorVersion: 'v2.0',
      financialState: state,
      decisionMode: policy.decisionMode,
      primaryDriver,
      secondaryDrivers,
      criticalRisks: memoryAlerts,
      blockedActions: policy.blockedActions,
      priorityKPIs: prioritizedInsights,
      executiveSummary: summary,
      recommendations: [] // Será preenchido pelo RecommendationEngine
    };
  }
}
