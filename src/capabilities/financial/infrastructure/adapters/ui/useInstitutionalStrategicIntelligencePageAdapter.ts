import { useState } from 'react';

export function useInstitutionalStrategicIntelligencePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [intelligenceData, setIntelligenceData] = useState<any>({});

  return { intelligenceData, loading };
}
