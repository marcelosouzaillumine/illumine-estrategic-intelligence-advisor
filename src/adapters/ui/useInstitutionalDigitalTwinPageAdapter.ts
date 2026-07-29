import { useState } from 'react';

export function useInstitutionalDigitalTwinPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [digitalTwinData, setDigitalTwinData] = useState<any>({});

  return { digitalTwinData, loading };
}
