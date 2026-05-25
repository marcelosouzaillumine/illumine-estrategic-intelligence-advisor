import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export interface EconomicGroupEntityModel {
  id: string; // Canonical entityId
  groupId: string;
  legacyClientId: string; // Legacy Bridge Link
  entityName: string;
  cnpj?: string;
  institutionalRole: 'PARENT' | 'SUBSIDIARY';
  ownershipPercentage: number;
  consolidationMethod: 'FULL' | 'PROPORTIONAL' | 'EQUITY';
  isControllingEntity: boolean;
  includeInConsolidation: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export class GroupEntityMappingRepository {
  static async listEntitiesByGroup(groupId: string): Promise<EconomicGroupEntityModel[]> {
    try {
      const q = query(collection(db, 'economic_group_entities'), where('groupId', '==', groupId));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as EconomicGroupEntityModel);
    } catch (err: any) {
      console.error('[GroupEntityMappingRepository] Error listing entities:', err);
      throw err;
    }
  }

  static async linkEntity(input: Omit<EconomicGroupEntityModel, 'id' | 'status'>): Promise<EconomicGroupEntityModel> {
    try {
      // O ID canônico é gerado de forma isolada, mas mantém o legacyClientId intacto.
      const id = crypto.randomUUID();
      const newEntity: EconomicGroupEntityModel = {
        ...input,
        id,
        status: 'ACTIVE'
      };

      await setDoc(doc(db, 'economic_group_entities', id), newEntity);
      return newEntity;
    } catch (err: any) {
      console.error('[GroupEntityMappingRepository] Error linking entity:', err);
      throw err;
    }
  }

  static async unlinkEntity(entityId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'economic_group_entities', entityId));
    } catch (err: any) {
      console.error('[GroupEntityMappingRepository] Error unlinking entity:', err);
      throw err;
    }
  }
}
