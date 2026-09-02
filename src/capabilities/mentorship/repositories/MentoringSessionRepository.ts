import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import type { MentoringSession } from '../domain';

const COLLECTION = 'mentoring_sessions';

export class MentoringSessionRepository {
  static async getById(sessionId: string): Promise<MentoringSession | null> {
    const ref = doc(db, COLLECTION, sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as MentoringSession;
  }

  static async listByMentor(mentorId: string, programId: string): Promise<MentoringSession[]> {
    const q = query(
      collection(db, COLLECTION),
      where('mentorId', '==', mentorId),
      where('programId', '==', programId),
      orderBy('scheduledAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MentoringSession);
  }

  static async listByMentee(menteeId: string, programId: string): Promise<MentoringSession[]> {
    const q = query(
      collection(db, COLLECTION),
      where('menteeId', '==', menteeId),
      where('programId', '==', programId),
      orderBy('scheduledAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MentoringSession);
  }

  static async listByPair(mentorId: string, menteeId: string): Promise<MentoringSession[]> {
    const q = query(
      collection(db, COLLECTION),
      where('mentorId', '==', mentorId),
      where('menteeId', '==', menteeId),
      orderBy('scheduledAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MentoringSession);
  }

  static async create(data: Omit<MentoringSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async update(sessionId: string, updates: Partial<MentoringSession>): Promise<void> {
    const ref = doc(db, COLLECTION, sessionId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  }
}
