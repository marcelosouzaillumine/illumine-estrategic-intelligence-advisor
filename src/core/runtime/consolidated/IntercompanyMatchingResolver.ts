import { IntercompanyCandidate } from './CrossEntityBalanceMatcher';
import { IntercompanyConfidenceResolver } from './IntercompanyConfidenceResolver';
import { ConsolidatedAdjustmentRegistry } from './ConsolidatedAdjustmentRegistry';
import { EntityInputPayload } from './consolidated-types';

export class IntercompanyMatchingResolver {
  private confidenceResolver: IntercompanyConfidenceResolver;

  constructor() {
    this.confidenceResolver = new IntercompanyConfidenceResolver();
  }

  public resolveMatches(
    candidates: IntercompanyCandidate[],
    registry: ConsolidatedAdjustmentRegistry,
    entities: EntityInputPayload[]
  ): void {
    const processedIndices = new Set<number>();

    for (let i = 0; i < candidates.length; i++) {
      if (processedIndices.has(i)) continue;

      const source = candidates[i];
      let bestMatchIndex = -1;
      let minDiscrepancy = Infinity;

      for (let j = i + 1; j < candidates.length; j++) {
        if (processedIndices.has(j)) continue;

        const target = candidates[j];

        // Regras básicas para ser um match potencial:
        // 1. Entidades diferentes
        // 2. Mesma origem (BP vs BP ou DRE vs DRE)
        // 3. Opcional: Se houver counterpartyHint, deve bater (heurística fraca)
        if (source.entityId !== target.entityId && source.source === target.source) {
           const discrepancy = Math.abs(source.value - target.value);
           if (discrepancy < minDiscrepancy) {
             minDiscrepancy = discrepancy;
             bestMatchIndex = j;
           }
        }
      }

      if (bestMatchIndex !== -1) {
        const target = candidates[bestMatchIndex];
        const { confidence, discrepancy } = this.confidenceResolver.resolveMatchConfidence(source.value, target.value);

        if (confidence === 'EXACT_MATCH' || confidence === 'PROBABLE_MATCH') {
          // Efetiva a eliminação pelo valor mínimo (conservadorismo)
          const elimValue = Math.min(source.value, target.value);
          const elimId = `elim-${Math.random().toString(36).substring(7)}`;

          registry.recordElimination({
            eliminationId: elimId,
            type: source.source === 'BP' ? 'Mutuo' : 'Intercompany Revenue', // simplificação
            sourceEntityId: source.entityId,
            targetEntityId: target.entityId,
            amount: elimValue,
            justification: `Eliminação intercompany (${confidence}): ${source.category} cruzado com ${target.category}`
          });

          // Registra Adjustments para Lineage (Source e Target)
          registry.recordAdjustment({
            adjustmentId: `adj-${Math.random().toString(36).substring(7)}`,
            entityId: source.entityId,
            accountAffected: source.category,
            originalValue: source.value,
            adjustmentValue: -elimValue,
            finalValue: source.value - elimValue,
            eliminationRefId: elimId
          });

          registry.recordAdjustment({
            adjustmentId: `adj-${Math.random().toString(36).substring(7)}`,
            entityId: target.entityId,
            accountAffected: target.category,
            originalValue: target.value,
            adjustmentValue: -elimValue,
            finalValue: target.value - elimValue,
            eliminationRefId: elimId
          });

          processedIndices.add(i);
          processedIndices.add(bestMatchIndex);

        } else if (confidence === 'LOW_CONFIDENCE_MATCH') {
          registry.recordWarning({
            warningId: `warn-${Math.random().toString(36).substring(7)}`,
            message: `Mismatch Material (LOW_CONFIDENCE): Discrepância de ${discrepancy} entre ${source.entityId} e ${target.entityId}`,
            relatedEntities: [source.entityId, target.entityId]
          });
          // Trata como unreconciled
          registry.recordUnreconciled({
            unreconciledId: `unrec-${Math.random().toString(36).substring(7)}`,
            sourceEntityId: source.entityId,
            targetEntityId: target.entityId,
            declaredAmount: source.value,
            counterpartyAmount: target.value,
            discrepancy: discrepancy,
            category: source.category,
            reason: 'Diferença material acima da tolerância permitida (> 10%).'
          });

          processedIndices.add(i);
          processedIndices.add(bestMatchIndex);
        }
      } else {
        // Nenhuma contraparte encontrada -> UNRECONCILED
        registry.recordUnreconciled({
          unreconciledId: `unrec-${Math.random().toString(36).substring(7)}`,
          sourceEntityId: source.entityId,
          declaredAmount: source.value,
          counterpartyAmount: 0,
          discrepancy: source.value,
          category: source.category,
          reason: 'Nenhuma contraparte identificada no perímetro de consolidação submetido.'
        });
        processedIndices.add(i);
      }
    }
  }
}
