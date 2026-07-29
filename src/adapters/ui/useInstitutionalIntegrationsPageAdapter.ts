import { useState } from 'react';

export function useInstitutionalIntegrationsPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [integrationsData, setIntegrationsData] = useState<any[]>([]);

  return { integrationsData, loading };
}
