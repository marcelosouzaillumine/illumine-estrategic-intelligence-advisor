import { useState } from 'react';

export function usePortfolioPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  return { portfolioData, loading };
}
