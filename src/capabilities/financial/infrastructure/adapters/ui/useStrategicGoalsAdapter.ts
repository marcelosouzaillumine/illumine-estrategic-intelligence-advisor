import { useState } from 'react';

export function useStrategicGoalsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);

  return {
    goals,
    loading
  };
}
