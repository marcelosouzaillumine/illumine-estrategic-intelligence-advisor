import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, Timestamp, serverTimestamp,
} from 'firebase/firestore';
import type { MentoringProgram } from '../domain';

const COLLECTION = 'programs';

export class MentoringProgramRepository {
  static async getById(tenantId: string, programId: string): Promise<MentoringProgram | null> {
    const ref = doc(db, COLLECTION, programId);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data().tenantId !== tenantId) return null;
    return { id: snap.id, ...snap.data() } as MentoringProgram;
  }

  static async listByTenant(tenantId: string): Promise<MentoringProgram[]> {
    const q = query(
      collection(db, COLLECTION),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MentoringProgram);
  }

  static async create(data: Omit<MentoringProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async update(programId: string, updates: Partial<MentoringProgram>): Promise<void> {
    const ref = doc(db, COLLECTION, programId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  }
}
