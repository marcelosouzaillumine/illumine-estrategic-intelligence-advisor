import { useState } from 'react';

export function useGovernanceOrchestrationPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [orchestrationData, setOrchestrationData] = useState<any>({});

  return { orchestrationData, loading };
}
