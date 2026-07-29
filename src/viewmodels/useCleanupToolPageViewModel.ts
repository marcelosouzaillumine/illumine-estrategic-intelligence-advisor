import { useState, useEffect } from 'react';
import { useCleanupToolPageAdapter } from '../adapters/ui/useCleanupToolPageAdapter';

export function useCleanupToolPageViewModel() {
  const adapter = useCleanupToolPageAdapter();
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    adapter.searchClientByCnpj('03.377.237/0001-84').then(id => {
      if (id) setClientId(id);
    });
  }, []);

  return {
    state: {
      loading: adapter.loading,
      status: adapter.status,
      clientId,
      targetCnpj: '03377237000184'
    },
    computed: {
      hasClient: Boolean(clientId)
    },
    actions: {
      setClientId,
      setStatus: adapter.setStatus
    }
  };
}
