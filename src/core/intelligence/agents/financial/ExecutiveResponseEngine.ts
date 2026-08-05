import { ExecutiveAgentResponse, AgentEvidence, AgentInsight } from '../contracts/ExecutiveAgentResponse';

export class ExecutiveResponseEngine {
  public synthesize(
    retrievedContext: any,
    baseAnswer: string,
    confidence: number = 85
  ): ExecutiveAgentResponse {
    
    const evidence: AgentEvidence[] = [];
    const insights: AgentInsight[] = [];
    let answer = baseAnswer;

    if (retrievedContext.criticalFindings) {
      for (const finding of retrievedContext.criticalFindings) {
        insights.push({
          finding: finding.finding,
          severity: finding.severity
        });
        evidence.push({
          description: `Identificado sinal de ${finding.finding} no período ${finding.period}`,
          source: finding.origin
        });
      }
    }

    if (retrievedContext.profile) {
      evidence.push({
        description: `Perfil financeiro classificado como ${retrievedContext.profile}`,
        source: 'FinancialIntelligenceCoordinator'
      });
    }

    return {
      answer,
      evidence,
      insights,
      confidence,
      limitations: [],
      relatedQuestions: retrievedContext.executiveQuestions || []
    };
  }
}
