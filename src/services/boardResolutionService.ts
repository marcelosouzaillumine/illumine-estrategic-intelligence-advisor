// src/services/boardResolutionService.ts
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BoardResolution } from '../core/runtime/board-decision/board-decision-types';
import { DecisionLineageTracker } from '../core/runtime/board-decision/DecisionLineageTracker';

export class BoardResolutionService {
  private static readonly COLLECTION = 'board_resolutions';

  /**
   * Persists a formal board resolution in an append-only model.
   */
  public static async persistResolution(resolution: BoardResolution): Promise<void> {
    if (!DecisionLineageTracker.verifyLineage(resolution)) {
      throw new Error('FIDUCIARY_VIOLATION: Tentativa de persistir resolução com lineage hash inválido ou corrompido.');
    }

    try {
      const colRef = collection(db, this.COLLECTION);
      await addDoc(colRef, resolution);
    } catch (error) {
      console.error('Error persisting board resolution:', error);
      throw new Error('SYSTEM_ERROR: Falha ao persistir a resolução institucional.');
    }
  }

  /**
   * Retrieves the historical decision lineage for a specific client.
   */
  public static async getClientResolutions(clientId: string): Promise<BoardResolution[]> {
    try {
      const colRef = collection(db, this.COLLECTION);
      const q = query(
        colRef, 
        where('clientId', '==', clientId),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const resolutions: BoardResolution[] = [];
      
      snapshot.forEach(doc => {
        resolutions.push(doc.data() as BoardResolution);
      });

      return resolutions;
    } catch (error) {
      console.error('Error fetching board resolutions:', error);
      return [];
    }
  }
}
