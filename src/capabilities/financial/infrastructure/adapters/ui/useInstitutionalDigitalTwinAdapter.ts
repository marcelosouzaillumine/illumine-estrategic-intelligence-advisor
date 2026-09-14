import { useState } from 'react';

export function useInstitutionalDigitalTwinAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [twinData, setTwinData] = useState<any[]>([]);

  return {
    twinData,
    loading
  };
}
