import { useState } from 'react';

export function useEstruturaGovernancaAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [governanceStructure, setGovernanceStructure] = useState<any[]>([]);

  return {
    governanceStructure,
    loading
  };
}
