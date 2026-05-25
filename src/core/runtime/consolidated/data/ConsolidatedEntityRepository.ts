import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export class ConsolidatedEntityRepository {
  /**
   * Padrão Oficial: Legacy ClientId as EntityId Bridge
   * Usa entityId para buscar na coluna clientId legada.
   */
  static async fetchBP(entityId: string, fiscalYear: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'bp'),
        where('clientId', '==', entityId),
        where('year', '==', fiscalYear)
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        return [];
      }

      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (err: any) {
      console.error(`[ConsolidatedEntityRepository] Failed to fetch BP for ${entityId}: ${err.message}`);
      return []; // Devolve vazio. A ausência deve ser punida pelo Motor Financeiro via Confidence Downgrade.
    }
  }

  static async fetchDRE(entityId: string, fiscalYear: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'dre'),
        where('clientId', '==', entityId),
        where('year', '==', fiscalYear)
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        return [];
      }

      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (err: any) {
      console.error(`[ConsolidatedEntityRepository] Failed to fetch DRE for ${entityId}: ${err.message}`);
      return []; // Devolve vazio. Ausência rebaixa confidence no Runtime.
    }
  }
}
