import { useState } from 'react';

export function useAvaliacaoOrganogramaAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [orgData, setOrgData] = useState<any>({});

  return { orgData, loading };
}
