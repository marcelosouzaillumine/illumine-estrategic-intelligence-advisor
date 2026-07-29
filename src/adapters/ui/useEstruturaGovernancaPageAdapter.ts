import { useState } from 'react';

export function useEstruturaGovernancaPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [governanceStructure, setGovernanceStructure] = useState<any>({});

  return { governanceStructure, loading };
}
