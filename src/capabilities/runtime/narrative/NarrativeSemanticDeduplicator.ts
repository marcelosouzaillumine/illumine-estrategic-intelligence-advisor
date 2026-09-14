import { InstitutionalLocaleGuard } from '../../../core/runtime/locale/InstitutionalLocaleGuard';
import { ExecutiveLocaleEnforcer } from '../../../core/enforcement/ExecutiveLocaleEnforcer';
import { InstitutionalSemanticGraph, SemanticSentence, SemanticTag } from '../../../core/runtime/coherence/InstitutionalSemanticGraph';

export type { SemanticSentence, SemanticTag };

export class NarrativeSemanticDeduplicator {
  /**
   * Remove redundâncias narrativas por meio de tags semânticas.
   * Se uma categoria semântica já foi abordada, as demais da mesma categoria são ignoradas.
   */
  public static deduplicate(sentences: SemanticSentence[]): string {
    const seenTags = new Set<SemanticTag>();
    const composed: string[] = [];

    for (const s of sentences) {
      if (!s.text) continue;

      if (InstitutionalSemanticGraph.shouldSuppress(s, seenTags)) {
        continue;
      }

      // Verifica jargões de engine
      const lower = s.text.toLowerCase();
      const engineTerms = ['runtime detectou', 'composite score', 'dampener', 'cap institucional', 'score comprimido'];
      if (engineTerms.some(et => lower.includes(et))) {
        continue;
      }

      // Adiciona à composição e marca as tags
      let sanitized = ExecutiveLocaleEnforcer.humanizeStrategicTerms(s.text);
      composed.push(sanitized.trim());

      s.tags.forEach(t => {
        if (t === 'LOW_HISTORICAL_DENSITY' || t === 'PARTIAL_CONTEXT' || t === 'NON_CONCLUSIVE_EVOLUTION') {
          seenTags.add('LONGITUDINAL_LIMITATION');
        }
        seenTags.add(t);
      });
    }

    return composed.join(' ').trim();
  }
}
