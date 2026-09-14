import { useState } from 'react';

export function useExecutiveScenarioLabPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);

  return { scenarios, loading };
}
