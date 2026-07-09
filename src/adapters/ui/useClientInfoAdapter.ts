import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function useClientInfoAdapter(clientId: string) {
  const [clientName, setClientName] = useState('Cliente');
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    async function fetchClient() {
      if (!clientId) return;
      try {
        const snap = await getDoc(doc(db, 'clients', clientId));
        if (snap.exists()) {
          const data = snap.data();
          setClientName(data.fantasia || data.razao || 'Empresa');
          setClientData(data);
        }
      } catch (error) {
        console.error('Failed to fetch client info', error);
      }
    }
    fetchClient();
  }, [clientId]);

  return {
    clientName,
    clientData,
    setClientName,
    setClientData
  };
}
