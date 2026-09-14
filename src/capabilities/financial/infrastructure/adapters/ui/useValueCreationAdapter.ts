import { useState } from 'react';

export function useValueCreationAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<any[]>([]);

  return {
    planData,
    loading
  };
}
