import { useState } from 'react';

export function useDadosHistoricosPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  return { historyData, loading };
}
