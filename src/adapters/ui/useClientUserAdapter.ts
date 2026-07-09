import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  setDoc 
} from 'firebase/firestore';
import { db, createSecondaryUser } from '../../lib/firebase';

export function useClientUserAdapter(clientId: string) {
  const fetchUsers = async () => {
    if (!clientId) return [];
    try {
      const q = query(
        collection(db, 'client_users'), 
        where('clientId', '==', clientId)
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e: any) {
      console.error(e);
      return [];
    }
  };

  const saveUser = async (formData: any, editingId: string | null) => {
    const emailLower = formData.email.toLowerCase().trim();
    let generatedPass = null;

    const payload: any = {
      ...formData,
      email: emailLower,
      clientId,
      updatedAt: serverTimestamp(),
    };

    if (!editingId) {
      generatedPass = Math.random().toString(36).substring(2, 8).toUpperCase() + '@123';
      try {
        await createSecondaryUser(emailLower, generatedPass);
        payload.requirePasswordChange = true;
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          throw e; // Bubble it up to link it
        } else {
          throw e;
        }
      }
    }

    const docId = `${emailLower}_${clientId}`;
    await setDoc(doc(db, 'client_users', docId), payload, { merge: true });

    return { generatedPass, emailLower };
  };

  const linkExistingUser = async (formData: any) => {
    const emailLower = formData.email.toLowerCase().trim();
    const payload: any = {
      ...formData,
      email: emailLower,
      clientId,
      updatedAt: serverTimestamp(),
    };
    const docId = `${emailLower}_${clientId}`;
    await setDoc(doc(db, 'client_users', docId), payload, { merge: true });
  };

  const deleteUser = async (id: string) => {
    await deleteDoc(doc(db, 'client_users', id));
  };

  return {
    fetchUsers,
    saveUser,
    linkExistingUser,
    deleteUser
  };
}
