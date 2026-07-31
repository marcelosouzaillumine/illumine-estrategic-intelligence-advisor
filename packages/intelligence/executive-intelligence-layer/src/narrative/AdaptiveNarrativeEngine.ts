import { DecisionAssessmentContract } from '../contracts/DecisionAssessmentContract';
import { FinancialEvidenceContract } from '../contracts/FinancialEvidenceContract';
import { ExecutiveNarrativeState } from './ExecutiveNarrativeState';
import { ExecutiveIntelligenceContract } from '../contracts/ExecutiveIntelligenceContract';

export class AdaptiveNarrativeEngine {
  /**
   * Constrói o "Executive Brief" modular baseado nos outputs das camadas de base.
   */
  public static generateBrief(
    businessState: string,
    evidences: FinancialEvidenceContract[],
    decisionAssessment?: DecisionAssessmentContract
  ): ExecutiveIntelligenceContract['narrativeBlocks'] {
    const blocks: ExecutiveIntelligenceContract['narrativeBlocks'] = [];
    
    // Define Narrative State based on Business State
    let narrativeState: ExecutiveNarrativeState = ExecutiveNarrativeState.STABLE;
    if (businessState === 'RISCO DE CONTINUIDADE') narrativeState = ExecutiveNarrativeState.CRITICAL;
    else if (businessState === 'RECUPERAÇÃO PATRIMONIAL') narrativeState = ExecutiveNarrativeState.RECOVERY;
    else if (businessState === 'PRESSÃO FINANCEIRA CONTROLADA') narrativeState = ExecutiveNarrativeState.WARNING;

    // 1. Situação Executiva (Executive Situation)
    let situationStr = 'A estrutura financeira encontra-se equilibrada.';
    if (narrativeState === ExecutiveNarrativeState.CRITICAL) {
      situationStr = 'A empresa apresenta deterioração progressiva da estrutura patrimonial, culminando em insuficiência de capital de giro e dependência estrutural. A operação carece de intervenção para preservação fiduciária.';
    } else if (narrativeState === ExecutiveNarrativeState.RECOVERY) {
      situationStr = 'A empresa preserva base patrimonial positiva, mas sofre de asfixia em sua estrutura de capital circulante, requerendo reestruturação do ciclo financeiro.';
    }

    blocks.push({
      type: 'SITUATION',
      content: situationStr,
      confidence: 100,
      severity: narrativeState === ExecutiveNarrativeState.CRITICAL ? 'CRITICAL' : (narrativeState === ExecutiveNarrativeState.STABLE ? 'LOW' : 'WARNING')
    });

    // 2. Critical Signals (Evidências agrupadas por Fato e Interpretação)
    const facts = evidences.filter(e => e.level === 'FACT').map(e => e.description);
    if (facts.length > 0) {
      blocks.push({
        type: 'SIGNALS',
        content: `**Fatos Numéricos Observados:**\n- ${facts.join('\n- ')}`,
        confidence: 100,
        severity: 'MEDIUM'
      });
    }

    // 3. Risk Interpretation & Hypothesis
    const interpretations = evidences.filter(e => e.level === 'INTERPRETATION').map(e => e.description);
    const hypothesis = evidences.filter(e => e.level === 'HYPOTHESIS').map(e => e.description);
    
    if (interpretations.length > 0 || hypothesis.length > 0) {
      let riskStr = '';
      if (interpretations.length > 0) riskStr += `**Implicação Técnica (85%):**\n${interpretations.join(' ')}\n\n`;
      if (hypothesis.length > 0) riskStr += `**Hipóteses a Validar (45%):**\n- ${hypothesis.join('\n- ')}`;
      
      blocks.push({
        type: 'RISK',
        content: riskStr.trim(),
        confidence: 85, // Weighted average placeholder
        severity: 'MEDIUM'
      });
    }

    // 4. Decision Assessment (Se aplicável)
    if (decisionAssessment) {
      let decisionStr = `**Decisão Proposta:** ${decisionAssessment.proposedDecision}\n**Status:** ${decisionAssessment.status}\n\n`;
      if (decisionAssessment.reasons.length > 0) {
        decisionStr += `**Motivos Fiduciários:**\n- ${decisionAssessment.reasons.join('\n- ')}\n\n`;
      }
      if (decisionAssessment.recommendedAlternative) {
        decisionStr += `**Alternativa Recomendada:** ${decisionAssessment.recommendedAlternative}`;
      }

      blocks.push({
        type: 'DECISION',
        content: decisionStr.trim(),
        confidence: 100,
        severity: decisionAssessment.status === 'BLOCKED' ? 'CRITICAL' : 'LOW'
      });
    }

    // 5. Recommended Actions (Acionabilidade Direcionada)
    if (narrativeState === ExecutiveNarrativeState.CRITICAL) {
      blocks.push({
        type: 'ACTION',
        content: `**Ações Imediatas (Prioridade Fiduciária):**
1. **Preservar Caixa Operacional** | Indicador: Saldo de Caixa Diário | Responsável: CFO | Prazo: Imediato
2. **Renegociar Passivos de Curto Prazo** | Indicador: Índice de Liquidez > 1.0 | Responsável: Tesouraria | Prazo: 30 dias
3. **Avaliar Aporte de Capital Estratégico** | Indicador: Reversão do PL | Responsável: Conselho/Sócios | Prazo: 90 dias`,
        confidence: 100,
        severity: 'HIGH'
      });
    }

    return blocks;
  }
}
