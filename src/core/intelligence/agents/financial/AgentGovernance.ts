import { FinancialExecutiveIntent } from './FinancialExecutiveIntent';
import { AgentReasoningTrace } from './AgentReasoningTrace';
import { ExecutiveAgentResponse } from '../contracts/ExecutiveAgentResponse';
import { ExecutiveAgentMode } from '../contracts/ExecutiveAgentMode';

export class AgentGovernance {
  public validatePreFlight(intent: FinancialExecutiveIntent, mode: ExecutiveAgentMode, trace: AgentReasoningTrace): boolean {
    // Escudo Constitucional: Não permitir decisões autônomas
    if (intent === FinancialExecutiveIntent.DECISION_SUPPORT && mode === 'ANALYST') {
      trace.addGovernanceLog('Blocked DECISION_SUPPORT intent in ANALYST mode.');
      return false;
    }
    return true;
  }

  public validatePostFlight(response: ExecutiveAgentResponse, trace: AgentReasoningTrace): ExecutiveAgentResponse {
    // Escudo Constitucional: Exigir evidência
    if (response.evidence.length === 0) {
      trace.addGovernanceLog('Violation: No evidence provided in response. Appending limitation.');
      response.limitations.push('A resposta não pôde ser baseada em fatos financeiros concretos desta empresa.');
      // Diminuir confiança se alucinar
      response.confidence = Math.min(response.confidence, 40);
    }
    
    // Escudo Constitucional: Inserir Disclaimer de Autonomia
    const indicatesDecision = response.answer.toLowerCase().includes('devemos investir') || response.answer.toLowerCase().includes('recomendo');
    if (indicatesDecision) {
      trace.addGovernanceLog('Violation: Response implies autonomous decision. Forcing disclaimer.');
      response.answer += ' (Nota: A plataforma Illumine atua como inteligência assistiva, a decisão estratégica final requer aprovação humana).';
    }

    return response;
  }
}
