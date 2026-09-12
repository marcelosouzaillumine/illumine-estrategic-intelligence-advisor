import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { EvidenceResolver } from './EvidenceResolver';
import { ExecutiveNarrativeRenderer } from '../narrative/ExecutiveNarrativeRenderer';
import { ConsistencyGuard } from '../governance/ConsistencyGuard';
import { ExecutiveEvidenceAssembler } from './ExecutiveEvidenceAssembler';
import { ExecutiveEvidencePackage } from '../contracts/ExecutiveEvidencePackage';

export class PresentationPipeline {
  /**
   * Resolve evidências, verbaliza e empacota, com guarda final de consistência.
   */
  public static run(diagnosis: ExecutiveDiagnosis, rawFinancialData: any): ExecutiveEvidencePackage {
    
    // 1. Evidence Resolver
    const resolvedEvidence = EvidenceResolver.resolve(diagnosis, rawFinancialData);

    // 2. Executive Narrative Renderer
    const narrativeBlocks = ExecutiveNarrativeRenderer.render(diagnosis);

    // 3. Consistency Guard
    const consistencyErrors = ConsistencyGuard.checkConsistency(diagnosis);
    if (consistencyErrors.length > 0) {
      // Caso a IA tenha falhado brutalmente, gera um bloco forçado
      narrativeBlocks.unshift({
        type: 'MONITORING',
        title: 'Bloqueio de Consistência Renderizada',
        body: `Erros críticos de consistência institucional: ${consistencyErrors.join(' | ')}`,
        confidence: 0,
        priority: 'CRITICAL',
        source: 'Consistency Guard',
        recommendation: 'Sistema interrompeu a exibição por divergência algorítmica.',
        evidenceRefs: [],
        validationStatus: 'BLOCKED',
        causalRelationship: false
      });
    }

    // 4. Executive Evidence Assembler
    return ExecutiveEvidenceAssembler.assemble(
      diagnosis,
      resolvedEvidence,
      narrativeBlocks,
      [] // execution plan can be derived from recommendations if needed
    );
  }
}
