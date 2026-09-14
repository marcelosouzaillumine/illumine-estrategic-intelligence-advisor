import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import type { Diagnostic, DiagnosticAnswers, MentorAnnotation } from '../domain';

const COLLECTION = 'diagnostics';

export class DiagnosticRepository {
  static async getByMentee(menteeId: string, programId: string): Promise<Diagnostic | null> {
    const q = query(
      collection(db, COLLECTION),
      where('menteeId', '==', menteeId),
      where('programId', '==', programId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Diagnostic;
  }

  static async getById(id: string): Promise<Diagnostic | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Diagnostic;
  }

  static async create(data: Pick<Diagnostic, 'menteeId' | 'programId' | 'tenantId'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      status: 'PENDING',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  static async saveAnswers(id: string, answers: DiagnosticAnswers): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      answers,
      status: 'IN_PROGRESS',
      updatedAt: serverTimestamp(),
    });
  }

  static async submit(id: string, answers: DiagnosticAnswers): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      answers,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  }

  static async addMentorAnnotation(id: string, annotation: MentorAnnotation): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      mentorAnnotation: annotation,
      status: 'REVIEWED',
      reviewedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  }
}
