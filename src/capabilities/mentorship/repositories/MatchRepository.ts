import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import type { Match } from '../domain';

const COLLECTION = 'matches';

export class MatchRepository {
  static async getById(matchId: string): Promise<Match | null> {
    const ref = doc(db, COLLECTION, matchId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Match;
  }

  static async listByProgram(programId: string): Promise<Match[]> {
    const q = query(
      collection(db, COLLECTION),
      where('programId', '==', programId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Match);
  }

  static async findActivePair(mentorId: string, menteeId: string): Promise<Match | null> {
    const q = query(
      collection(db, COLLECTION),
      where('mentorId', '==', mentorId),
      where('menteeId', '==', menteeId),
      where('status', '==', 'ACTIVE')
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Match;
  }

  static async create(data: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async update(matchId: string, updates: Partial<Match>): Promise<void> {
    const ref = doc(db, COLLECTION, matchId);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  }
}
