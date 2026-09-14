import { ConsolidatedFinancialInput } from '../../../capabilities/financial/runtime/consolidated/types';

export class ScenarioSnapshotBuilder {
  /**
   * Constrói uma cópia puramente imutável (Deep Clone) do estado atual, 
   * separando a Memória do contexto da Memória do Runtine Operacional.
   */
  static buildClone(input: ConsolidatedFinancialInput): ConsolidatedFinancialInput {
    // Utiliza structuredClone para garantir a quebra total de referência.
    // Assim, aplicar uma falência no contexto não apagará a conta do BD ou View Local
    return structuredClone(input);
  }

  static generateHash(input: ConsolidatedFinancialInput): string {
    // Um mock seguro de hash estrutural para rastreabilidade de lineage
    return btoa(JSON.stringify({ group: input.groupId, ents: input.entities.length, time: new Date().toISOString() })).slice(0, 16);
  }
}
