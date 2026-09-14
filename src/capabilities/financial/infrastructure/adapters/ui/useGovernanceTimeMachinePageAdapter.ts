import { useState } from 'react';

export function useGovernanceTimeMachinePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  return { timelineData, loading };
}
