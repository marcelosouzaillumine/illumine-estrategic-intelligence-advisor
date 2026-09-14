import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { getErrorMessage } from '../../../../../types/runtime/RuntimeErrorGuards';

export class IntercompanyRelationsLoader {
  /**
   * Busca operações intragrupo formalizadas.
   */
  static async fetchRelations(groupId: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'intercompany_relations'),
        where('groupId', '==', groupId)
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        return [];
      }

      return snap.docs.map(doc => ({ ...doc.data(), operationId: doc.id }));
    } catch (err: unknown) {
      console.error(`[IntercompanyRelationsLoader] Failed to fetch relations: ${getErrorMessage(err)}`);
      return [];
    }
  }
}
