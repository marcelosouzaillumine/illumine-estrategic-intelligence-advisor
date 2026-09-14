import { useState } from 'react';

export function useFinancialPositionPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [positionData, setPositionData] = useState<any>({});

  return { positionData, loading };
}
