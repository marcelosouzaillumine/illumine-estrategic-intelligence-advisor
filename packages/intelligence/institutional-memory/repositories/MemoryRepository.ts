import { DecisionMemoryRecord } from '../models/DecisionMemoryRecord';

export interface MemoryRepository {
  /**
   * Armazena ou atualiza uma decisão na memória institucional
   */
  saveRecord(record: DecisionMemoryRecord): Promise<DecisionMemoryRecord>;

  /**
   * Recupera um registro pelo seu ID
   */
  getRecordById(id: string): Promise<DecisionMemoryRecord | null>;

  /**
   * Busca decisões similares baseadas em contexto, premissas ou categoria
   */
  findSimilarDecisions(
    organizationId: string, 
    contextKeywords: string[], 
    limit?: number
  ): Promise<DecisionMemoryRecord[]>;
}
