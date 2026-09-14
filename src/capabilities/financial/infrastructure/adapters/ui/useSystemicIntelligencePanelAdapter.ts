import { useState } from 'react';

export function useSystemicIntelligencePanelAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [systemicData, setSystemicData] = useState<any>({});
  return { systemicData, loading };
}
