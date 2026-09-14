import { useState } from 'react';

export function usePartnerSalesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<any[]>([]);

  return {
    sales,
    loading
  };
}
