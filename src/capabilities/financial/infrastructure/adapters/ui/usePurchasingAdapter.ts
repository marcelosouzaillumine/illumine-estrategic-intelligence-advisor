import { useState } from 'react';

export function usePurchasingAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  return {
    orders,
    loading
  };
}
