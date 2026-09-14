import { useState } from 'react';

export function useGovernanceTimeMachineAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  return {
    historyData,
    loading
  };
}
