import { ExecutiveOrganizationState } from '../domain/ExecutiveOrganizationState';
import { DecisionRecord, DecisionStatus } from '../governance/DecisionRecord';
import { FinancialEvidenceContract } from '../contracts/FinancialEvidenceContract';

export class ExecutiveStateAggregator {
  /**
   * Constrói o estado executivo dinamicamente a partir dos eventos e registros brutos.
   */
  public static aggregate(
    companyId: string,
    companyName: string,
    decisions: DecisionRecord[],
    evidences: FinancialEvidenceContract[],
    financialState: string
  ): ExecutiveOrganizationState {
    
    // Filtra as decisões ativas (PROPOSED ou UNDER_REVIEW)
    const activeDecisions = decisions
      .filter(d => d.approval.status === DecisionStatus.PROPOSED || d.approval.status === DecisionStatus.UNDER_REVIEW)
      .map(d => ({
        id: d.id,
        topic: d.decisionContext.decisionObjective,
        status: d.approval.status,
        risk: d.decisionContext.financialState === 'RISCO DE CONTINUIDADE' ? 'CRITICAL' : 'MEDIUM',
        urgency: d.decisionContext.urgency
      }));
      
    // Conta históricos de sucesso
    let successfulCount = 0;
    let failedCount = 0;
    let recentLearnings: string[] = [];
    
    decisions.filter(d => d.learning && d.learning.successStatus).forEach(d => {
      if (d.learning.successStatus === 'SUCCESS') successfulCount++;
      if (d.learning.successStatus === 'FAILURE' || d.learning.successStatus === 'PARTIAL') failedCount++;
      
      if (d.learning.lessonsLearned && d.learning.lessonsLearned.length > 0) {
        recentLearnings.push(...d.learning.lessonsLearned);
      }
    });
    
    // Simplificação da inferência de maturidade
    let maturity: "AD-HOC" | "REACTIVE" | "PROACTIVE" | "PREDICTIVE" | "INSTITUTIONAL" = "REACTIVE";
    if (decisions.length > 5) maturity = "PROACTIVE";
    if (successfulCount > 3) maturity = "INSTITUTIONAL";
    
    return {
      identity: {
        companyId,
        companyName,
        lastAggregatedAt: new Date().toISOString()
      },
      
      institutionalMoment: financialState,
      
      financialCondition: {
        confidenceLevel: 94,
        healthStatus: financialState === 'RISCO DE CONTINUIDADE' ? 'AT_RISK' : 'STABLE',
        keyMetricFocus: evidences.length > 0 ? evidences[0].metric : 'EBITDA'
      },
      
      strategicPressure: {
        level: financialState === 'RISCO DE CONTINUIDADE' ? 'CRITICAL' : (financialState === 'RECUPERAÇÃO PATRIMONIAL' ? 'HIGH' : 'MEDIUM'),
        reason: 'Crescimento superior à geração operacional de caixa (Baseado em simulação analítica)'
      },
      
      criticalSignals: [
        {
          domain: 'FINANCIAL',
          level: 'HIGH',
          description: 'Queda projetada no Capital de Giro Líquido para o próximo trimestre.',
          recommendedAction: 'Reavaliar prazo médio de recebimento.'
        }
      ],
      
      activeDecisions,
      
      unresolvedRisks: [
        'Exposição cambial em contratos de importação',
        'Turnover elevado na camada gerencial'
      ],
      
      organizationalLearning: {
        recentLearnings: recentLearnings.slice(-3), // Top 3 most recent
        successfulDecisionsCount: successfulCount,
        failedDecisionsCount: failedCount
      },
      
      maturityLevel: maturity,
      
      recommendedAttention: activeDecisions.length > 0 
        ? `Atenção prioritária requerida na decisão: ${activeDecisions[0].topic}`
        : 'Revisar projeções de caixa livre.'
    };
  }
}
