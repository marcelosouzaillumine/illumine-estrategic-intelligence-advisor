import { EntityGraph } from './EntityGraph';
import { IntercompanyOperation } from './types';

export interface EliminationResult {
  eliminatedAmount: number;
  unreconciledOperations: IntercompanyOperation[];
}

export class IntercompanyResolver {
  /**
   * Identifica operações não reconciliadas e calcula o total a ser eliminado do consolidado.
   * Nesta fase 1, assumimos consolidação integral (100%), então todo o valor de intercompany é eliminado.
   */
  static resolve(graph: EntityGraph, scopeIds: string[]): EliminationResult {
    const operations = graph.getIntercompanyOperations();
    
    // Filtrar operações onde AMBOS os lados (source e target) estão no escopo de consolidação atual
    const internalOperations = operations.filter(op => 
      scopeIds.includes(op.sourceEntityId) && scopeIds.includes(op.targetEntityId)
    );

    let eliminatedAmount = 0;
    const unreconciledOperations: IntercompanyOperation[] = [];

    // Lógica básica de reconciliação (nesta fase, assumimos que se a flag estiver true, está ok)
    // Se fosse um motor real, tentaríamos parear recebíveis com pagáveis.
    for (const op of internalOperations) {
      if (!op.reconciled) {
        unreconciledOperations.push(op);
      } else {
        eliminatedAmount += op.amount;
      }
    }

    return {
      eliminatedAmount,
      unreconciledOperations
    };
  }
}
