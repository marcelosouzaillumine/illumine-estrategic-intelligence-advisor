import { SemanticRootAudit } from './DFCSemanticRootAudit';

export interface SemanticRootEvidenceInput {
  semanticSource?: string;
  lifecycleProfile?: any;
  semanticContext?: any;
  cqsSemantic?: any;
  eqsSemantic?: any;
  executiveNarrative?: string;
}

export class DFCSemanticCanonicalRootResolver {
  static resolve(evidence: SemanticRootEvidenceInput): SemanticRootAudit {
    const isElsaSource = evidence.semanticSource === 'ELSA';
    const isElsaContext = evidence.semanticContext?.semanticSource === 'ELSA';
    const isElsaProfile = evidence.lifecycleProfile?.semanticSource === 'ELSA';
    const isElsaCqs = evidence.cqsSemantic?.lifecycleStage === 'INITIAL_CAPITALIZATION' || evidence.cqsSemantic === 'Estrutura de Caixa Dependente de Capitalização Inicial';
    const isElsaEqs = evidence.eqsSemantic?.lifecycleStage === 'INITIAL_CAPITALIZATION' || evidence.eqsSemantic === 'Risco de Resultado em Fase Inicial de Capitalização';
    const isElsaNarrative = evidence.executiveNarrative?.toLowerCase().includes('fase inicial de capitalização');

    const hasElsaEvidence = isElsaSource || isElsaContext || isElsaProfile || isElsaCqs || isElsaEqs || isElsaNarrative;

    const resolvedRoot = hasElsaEvidence ? 'ELSA' : 'LEGACY';

    return {
      root: resolvedRoot,
      originalRoot: evidence.semanticSource || 'LEGACY',
      canonicalRoot: resolvedRoot,
      resolvedRoot: resolvedRoot,
      canonicalized: hasElsaEvidence,
      lifecycleStage: hasElsaEvidence ? 'INITIAL_CAPITALIZATION' : evidence.semanticContext?.lifecycleStage || 'ESTABLISHED_ANALYSIS',
      lifecycleLabel: hasElsaEvidence ? 'Fase Inicial de Capitalização' : evidence.semanticContext?.lifecycleLabel || 'Análise Estabelecida',
      evidence: {
        hasSemanticContext: !!evidence.semanticContext,
        hasLifecycleProfile: !!evidence.lifecycleProfile,
        hasCqsElsaEvidence: !!isElsaCqs,
        hasEqsElsaEvidence: !!isElsaEqs,
        hasNarrativeElsaEvidence: !!isElsaNarrative
      }
    };
  }
}
