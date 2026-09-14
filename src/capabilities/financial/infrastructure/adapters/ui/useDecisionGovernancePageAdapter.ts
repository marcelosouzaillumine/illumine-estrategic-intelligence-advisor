import { useState } from 'react';

export function useDecisionGovernancePageAdapter() {
  const [loading, setLoading] = useState(false);
  const [governanceData, setGovernanceData] = useState<any>({});

  return { governanceData, loading };
}
