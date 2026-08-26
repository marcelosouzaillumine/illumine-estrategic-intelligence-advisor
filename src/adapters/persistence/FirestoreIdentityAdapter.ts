import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { IIdentityPersistence } from '../../contracts/persistence/IIdentityPersistence';
import { User, UserProfile, Session } from '../../domain/identity/User';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';

export class FirestoreIdentityAdapter implements IIdentityPersistence {
  async getUserByAuthUid(uid: string): Promise<User | null> {
    const q = query(collection(db, 'users'), where('authUid', '==', uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase().trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as User;
  }

  async createUser(user: User): Promise<void> {
    blockedFirestoreWrite(); // setDoc(doc(db, 'users', user.id), user);
  }

  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    blockedFirestoreWrite(); // setDoc(doc(db, 'users', userId), { status }, { merge: true });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const d = await getDoc(doc(db, 'user_profiles', userId));
    return d.exists() ? (d.data() as UserProfile) : null;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    blockedFirestoreWrite(); // setDoc(doc(db, 'user_profiles', profile.userId), profile, { merge: true });
  }

  async createSession(session: Session): Promise<void> {
    blockedFirestoreWrite(); // setDoc(doc(db, 'sessions', session.id), session);
  }

  async revokeSession(sessionId: string): Promise<void> {
    blockedFirestoreWrite(); // setDoc(doc(db, 'sessions', sessionId), { status: 'REVOKED' }, { merge: true });
  }
}
