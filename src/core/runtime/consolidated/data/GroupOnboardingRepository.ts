import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { v4 as generateId } from 'uuid'; // Assuming this exists or I'll use standard id generation

export interface EconomicGroupModel {
  id: string;
  groupName: string;
  legalName?: string;
  fiscalYear: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export class GroupOnboardingRepository {
  /**
   * Lista grupos econômicos cadastrados.
   */
  static async listGroups(): Promise<EconomicGroupModel[]> {
    try {
      const snap = await getDocs(collection(db, 'economic_groups'));
      return snap.docs.map(d => d.data() as EconomicGroupModel);
    } catch (err: unknown) {
      console.error('[GroupOnboardingRepository] Error listing groups:', err);
      throw err;
    }
  }

  /**
   * Cria um novo grupo econômico puro, sem inferências.
   */
  static async createGroup(input: Omit<EconomicGroupModel, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<EconomicGroupModel> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const newGroup: EconomicGroupModel = {
        id,
        ...input,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now
      };

      await setDoc(doc(db, 'economic_groups', id), newGroup);
      return newGroup;
    } catch (err: unknown) {
      console.error('[GroupOnboardingRepository] Error creating group:', err);
      throw err;
    }
  }
}
