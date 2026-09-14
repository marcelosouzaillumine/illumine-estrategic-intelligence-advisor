import { useState } from 'react';

export function usePurchasingPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [purchasingData, setPurchasingData] = useState<any[]>([]);
  return { purchasingData, loading };
}
