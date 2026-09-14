import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../../lib/firebase';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export function useLoanAdapter(clientId: string | undefined) {
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser || !clientId) return;
    const q = query(
        collection(db, 'captacao_projetos'),
        where('clientId', '==', clientId),
        where('ownerId', '==', auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
        setSavedProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [clientId]);

  const saveProject = async (selectedProjectId: string | null, payload: any) => {
    if (!auth.currentUser || !clientId) throw new Error("No user or client id");
    const fullPayload = {
      ...payload,
      clientId,
      ownerId: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    };
    if (selectedProjectId) {
      blockedFirestoreWrite(); // updateDoc(doc(db, 'captacao_projetos', selectedProjectId), fullPayload);
      return selectedProjectId;
    } else {
      const docRef: any = blockedFirestoreWrite(); // addDoc(collection(db, 'captacao_projetos'), fullPayload);
      return docRef.id;
    }
  };

  return {
    savedProjects,
    saveProject
  };
}
