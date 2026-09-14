import { useState } from 'react';

export function useInstitutionalContinuityCockpitPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [continuityData, setContinuityData] = useState<any>({});

  return { continuityData, loading };
}
