import { useState } from 'react';

export function useAdvisorCockpitAdapter() {
  const [loading, setLoading] = useState(false);
  const [advisoryItems, setAdvisoryItems] = useState<any[]>([]);

  return { advisoryItems, loading };
}
