import { useState } from 'react';

export function useLeadershipProfilePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [leadersData, setLeadersData] = useState<any[]>([]);

  return { leadersData, loading };
}
