import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

export function useFiscalAdapter(clientId: string) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const unsub = onSnapshot(doc(db, 'clients', clientId), (snap) => {
      if (snap.exists()) {
        setClientData(snap.data());
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching client for fiscal data:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [clientId]);

  const saveFiscalData = async (data: any) => {
    if (!clientId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    clientData,
    setClientData,
    loading,
    saving,
    saveFiscalData
  };
}
