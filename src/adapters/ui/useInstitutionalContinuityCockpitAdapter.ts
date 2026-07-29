import { useState } from 'react';

export function useInstitutionalContinuityCockpitAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [continuityData, setContinuityData] = useState<any[]>([]);

  return {
    continuityData,
    loading
  };
}
