import { useState } from 'react';

export function usePortfolioAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any[]>([]);

  return {
    portfolio,
    loading
  };
}
