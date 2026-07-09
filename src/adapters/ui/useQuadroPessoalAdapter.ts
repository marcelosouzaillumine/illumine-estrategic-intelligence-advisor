import { useState, useEffect } from 'react';
import { FirestoreClientsAdapter } from '../persistence/FirestoreClientsAdapter';


export function useQuadroPessoalAdapter(clientId: string) {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const unsub = FirestoreClientsAdapter.subscribeToClientById(clientId, (data) => {
      if (data) {
        setClientData(data);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [clientId]);

  return { loading, clientData };
}
