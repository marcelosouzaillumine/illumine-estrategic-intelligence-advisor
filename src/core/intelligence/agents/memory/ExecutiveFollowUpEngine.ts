import { ExecutiveMemoryArtifact } from './contracts/ExecutiveMemoryArtifact';
import { UnifiedFinancialIntelligenceContext } from '../../financial/orchestration/FinancialIntelligenceCoordinator';

export class ExecutiveFollowUpEngine {
  public generateFollowUp(triggeredMemory: ExecutiveMemoryArtifact, currentContext: UnifiedFinancialIntelligenceContext): string | null {
    // Crucially, it doesn't just say "we talked about this". It cross-references current context.
    
    if (triggeredMemory.type === 'RISK' || triggeredMemory.type === 'INSIGHT') {
      const hasCurrentRisk = currentContext.criticalFindings.some(f => 
        triggeredMemory.content.toLowerCase().includes(f.finding.toLowerCase()) ||
        (triggeredMemory.content.toLowerCase().includes('caixa') && f.finding.includes('CASH')) ||
        (triggeredMemory.content.toLowerCase().includes('capital de giro') && f.finding.includes('WORKING_CAPITAL'))
      );

      if (hasCurrentRisk) {
        return `Na última análise, identificamos: "${triggeredMemory.content}". Os dados financeiros atuais mostram que o cenário persiste (${currentContext.financialHealthProfile}). Deseja revisar a estratégia de mitigação?`;
      } else {
        return `Na análise anterior, acompanhávamos o cenário: "${triggeredMemory.content}". Os novos resultados indicam uma evolução para o perfil ${currentContext.financialHealthProfile}. Podemos reclassificar este risco como resolvido?`;
      }
    }

    return null;
  }
}
