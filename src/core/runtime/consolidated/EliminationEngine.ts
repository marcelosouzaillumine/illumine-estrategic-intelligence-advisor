import { RuntimeConfidence, RuntimeViolation } from '../../../runtime/types';
import { IntercompanyOperation } from '../../../topology/types';
import { EliminationRecord } from './types';

export class EliminationEngine {
  private static MATERIALITY_THRESHOLD = 50000; // Valor arbitrário para a fase 1, futuramente dinâmico

  static processOperations(operations: IntercompanyOperation[], scopeIds: string[]): EliminationRecord[] {
    const records: EliminationRecord[] = [];

    for (const op of operations) {
      if (!scopeIds.includes(op.sourceEntityId) || !scopeIds.includes(op.targetEntityId)) {
        continue; // Fora do escopo consolidado
      }

      const isMaterial = op.amount >= this.MATERIALITY_THRESHOLD;
      let status: 'MATCHED' | 'PARTIAL_MATCH' | 'UNMATCHED' = op.reconciled ? 'MATCHED' : 'UNMATCHED';
      let confidence: RuntimeConfidence = 'HIGH';
      let violation: RuntimeViolation | undefined = undefined;

      if (status === 'UNMATCHED') {
        if (isMaterial) {
          violation = {
            rule: 'INTERCOMPANY_MATCHING',
            severity: 'CRITICAL',
            message: `Divergência MATERIAL não reconciliada de ${op.type} entre ${op.sourceEntityId} e ${op.targetEntityId} no valor de ${op.amount}. Bloqueando emissão.`,
            sourceEngine: 'EliminationEngine',
            blocked: true,
            entityId: op.sourceEntityId
          };
          confidence = 'LOW';
        } else {
          violation = {
            rule: 'INTERCOMPANY_MATCHING',
            severity: 'MEDIUM',
            message: `Divergência imaterial não reconciliada de ${op.type} entre ${op.sourceEntityId} e ${op.targetEntityId} no valor de ${op.amount}.`,
            sourceEngine: 'EliminationEngine',
            blocked: false,
            entityId: op.sourceEntityId
          };
          confidence = 'MEDIUM'; // Degradado
        }
      }

      records.push({
        eliminationId: op.operationId,
        type: op.type as unknown as "MUTUO" | "RECEITA_DESPESA" | "DIVIDENDO" | "INVESTIMENTO",
        sourceEntityId: op.sourceEntityId,
        targetEntityId: op.targetEntityId,
        sourceAccountCategory: op.sourceAccountCategory,
        targetAccountCategory: op.targetAccountCategory,
        amount: op.amount,
        status,
        isMaterial,
        impactOnConsolidated: op.amount,
        confidence,
        violation
      });
    }

    return records;
  }
}
