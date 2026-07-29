import { useState } from 'react';

export function useInstitutionalIOSAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [iosData, setIosData] = useState<any[]>([]);

  return {
    iosData,
    loading
  };
}
