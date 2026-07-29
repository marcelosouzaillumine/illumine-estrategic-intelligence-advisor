import { useState } from 'react';

export function usePartnerSalesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [partnerSalesData, setPartnerSalesData] = useState<any>({});

  return { partnerSalesData, loading };
}
