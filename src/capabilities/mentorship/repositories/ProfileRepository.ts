import { db } from '../../../lib/firebase';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import type { MentorProfile, MenteeProfile } from '../domain';

export class ProfileRepository {
  // Mentor
  static async getMentor(userId: string, programId: string): Promise<MentorProfile | null> {
    const q = query(
      collection(db, 'mentor_profiles'),
      where('userId', '==', userId),
      where('programId', '==', programId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as MentorProfile;
  }

  static async listMentorsByProgram(programId: string): Promise<MentorProfile[]> {
    const q = query(
      collection(db, 'mentor_profiles'),
      where('programId', '==', programId),
      orderBy('displayName', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MentorProfile);
  }

  static async upsertMentor(profile: Omit<MentorProfile, 'createdAt' | 'updatedAt'> & { id: string }): Promise<void> {
    const ref = doc(db, 'mentor_profiles', profile.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { ...profile, updatedAt: serverTimestamp() });
    } else {
      await setDoc(ref, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  }

  // Mentee
  static async getMentee(userId: string, programId: string): Promise<MenteeProfile | null> {
    const q = query(
      collection(db, 'mentee_profiles'),
      where('userId', '==', userId),
      where('programId', '==', programId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as MenteeProfile;
  }

  static async listMenteesByProgram(programId: string): Promise<MenteeProfile[]> {
    const q = query(
      collection(db, 'mentee_profiles'),
      where('programId', '==', programId),
      orderBy('displayName', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as MenteeProfile);
  }

  static async upsertMentee(profile: Omit<MenteeProfile, 'createdAt' | 'updatedAt'> & { id: string }): Promise<void> {
    const ref = doc(db, 'mentee_profiles', profile.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { ...profile, updatedAt: serverTimestamp() });
    } else {
      await setDoc(ref, { ...profile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  }
}
