import { useState } from 'react';

export function useRiskCenterAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState<any[]>([]);

  return { risks, loading };
}
