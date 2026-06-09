import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { ConsolidationEntity } from '../types';
import { getErrorMessage } from '../../../../types/runtime/RuntimeErrorGuards';

export class ConsolidatedGroupRepository {
  /**
   * Busca os metadados do grupo econômico.
   * Não executa cálculo nem resolve conflitos de lineage.
   */
  static async fetchGroupMetadata(groupId: string): Promise<{ groupName: string; entities: ConsolidationEntity[] }> {
    try {
      const groupDoc = await getDoc(doc(db, 'economic_groups', groupId));
      
      if (!groupDoc.exists()) {
        throw new Error(`Group ${groupId} not found in economic_groups.`);
      }

      const data = groupDoc.data();
      
      const entities: ConsolidationEntity[] = (data.entities || []).map((e: any) => ({
        id: e.id, // Legacy ClientId as EntityId Bridge
        name: e.name || 'Unnamed Entity',
        role: e.role || 'SUBSIDIARY',
        ownershipPercentage: e.ownershipPercentage || 100,
        consolidationMethod: 'FULL' // Fase 1 enforce
      }));

      return {
        groupName: data.name || 'Unnamed Group',
        entities
      };
    } catch (err: unknown) {
      console.error(`[ConsolidatedGroupRepository] Failed to fetch group: ${getErrorMessage(err)}`);
      throw err; // Repassa ao runtime, sem fallback silencioso
    }
  }
}
