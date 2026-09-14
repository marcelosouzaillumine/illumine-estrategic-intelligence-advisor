import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../../../lib/firebase';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export interface ActionItem {
  id?: string;
  clientId: string;
  minuteId?: string;
  title: string;
  desc: string;
  responsible: string;
  deadline: string;
  priority: 'Alta' | 'Média' | 'Baixa' | 'Crítica';
  status: 'Pendente' | 'Em curso' | 'Concluído' | 'Impedido';
  phase: 'Estabilização' | 'Otimização' | 'Expansão';
  progress: number;
  effort?: number;
  tags?: string[];
  origin?: string;
  originTitle?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function useActionPlanAdapter(clientId: string) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setActions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'action_items'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActionItem));
      // Sort in-memory to avoid composite index requirement
      data.sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
      setActions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching actions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const handleSaveAction = async (formData: ActionItem, editingId: string | null) => {
    if (!auth.currentUser) return;
    const data = {
      ...formData,
      updatedAt: serverTimestamp()
    };

    if (editingId) {
      blockedFirestoreWrite(); // updateDoc(doc(db, 'action_items', editingId), data);
    } else {
      blockedFirestoreWrite(); // addDoc(collection(db, 'action_items'), {
        // ...data,
        // createdAt: serverTimestamp()
      // });
    }
  };

  const handleDeleteAction = async (id: string) => {
    blockedFirestoreWrite(); // deleteDoc(doc(db, 'action_items', id));
  };

  const handleUpdateStatus = async (id: string, newStatus: ActionItem['status']) => {
    blockedFirestoreWrite(); // updateDoc(doc(db, 'action_items', id), {
      // status: newStatus,
      // updatedAt: serverTimestamp()
    // });
  };

  return {
    actions,
    loading,
    setLoading,
    handleSaveAction,
    handleDeleteAction,
    handleUpdateStatus
  };
}
