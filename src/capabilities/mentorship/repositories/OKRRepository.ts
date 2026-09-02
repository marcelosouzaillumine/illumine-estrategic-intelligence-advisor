import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import type { OKR } from '../domain';

const COLLECTION = 'okrs';

export class OKRRepository {
  static async getById(okrId: string): Promise<OKR | null> {
    const ref = doc(db, COLLECTION, okrId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as OKR;
  }

  static async listByMentee(menteeId: string, programId: string): Promise<OKR[]> {
    const q = query(
      collection(db, COLLECTION),
      where('menteeId', '==', menteeId),
      where('programId', '==', programId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as OKR);
  }

  static async create(data: Omit<OKR, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      overallProgress: 0,
      status: 'ACTIVE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async update(okrId: string, updates: Partial<OKR>): Promise<void> {
    const ref = doc(db, COLLECTION, okrId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  }
}
