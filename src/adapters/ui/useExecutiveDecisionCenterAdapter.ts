import { useState } from 'react';

export function useExecutiveDecisionCenterAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [decisionsData, setDecisionsData] = useState<any>({});

  return { decisionsData, loading };
}
