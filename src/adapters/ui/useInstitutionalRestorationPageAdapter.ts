import { useState } from 'react';

export function useInstitutionalRestorationPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [restorationData, setRestorationData] = useState<any>({});

  return { restorationData, loading };
}
