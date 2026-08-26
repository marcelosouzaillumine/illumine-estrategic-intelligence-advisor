import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export interface IntercompanyRelationModel {
  id: string;
  groupId: string;
  fromEntityId: string; // Canonical entityId
  toEntityId: string; // Canonical entityId
  relationType: 'MUTUO' | 'RECEITA_CRUZADA' | 'DIVIDENDOS' | 'SHARED_COSTS';
  amount: number;
  fiscalYear: string;
  accountCode?: string;
  accountName?: string;
  materiality: 'MATERIAL' | 'IMMATERIAL';
  source: 'MANUAL_ONBOARDING' | 'INTEGRATION';
  status: 'ACTIVE' | 'RESOLVED' | 'UNMATCHED';
}

export class IntercompanyRelationRepository {
  static async listRelationsByGroup(groupId: string): Promise<IntercompanyRelationModel[]> {
    try {
      const q = query(collection(db, 'intercompany_relations'), where('groupId', '==', groupId));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as IntercompanyRelationModel);
    } catch (err: unknown) {
      console.error('[IntercompanyRelationRepository] Error listing relations:', err);
      throw err;
    }
  }

  static async addRelation(input: Omit<IntercompanyRelationModel, 'id'>): Promise<IntercompanyRelationModel> {
    try {
      const id = crypto.randomUUID();
      const relation: IntercompanyRelationModel = {
        ...input,
        id
      };

      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'intercompany_relations', id), relation);
      return relation;
    } catch (err: unknown) {
      console.error('[IntercompanyRelationRepository] Error adding relation:', err);
      throw err;
    }
  }

  static async removeRelation(relationId: string): Promise<void> {
    try {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // deleteDoc(doc(db, 'intercompany_relations', relationId));
    } catch (err: unknown) {
      console.error('[IntercompanyRelationRepository] Error removing relation:', err);
      throw err;
    }
  }
}
