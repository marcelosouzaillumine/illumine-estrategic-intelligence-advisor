import { useState } from 'react';
import { DATA } from '../../../../../data';

export function usePremissasEconomicasAdapter() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [econData, setEconData] = useState<any[]>(DATA.premissas?.economicas || []);
  const [lastSync, setLastSync] = useState<string>('Hoje, 14:00');
  const [lastSyncFull, setLastSyncFull] = useState<string>('Última sincronização completa em 23/07/2026 14:00');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return {
    econData,
    data: econData,
    loading: isSyncing,
    isSyncing,
    lastSync,
    lastSyncFull,
    handleSync
  };
}
