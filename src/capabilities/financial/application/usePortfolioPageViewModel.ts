import { useState } from 'react';

export function usePortfolioPageViewModel(props?: any) {
  const [totalPortfolioValue] = useState<number>(38500000);
  const [activeAssetsCount] = useState<number>(8);

  return {
    state: { totalPortfolioValue, activeAssetsCount },
    computed: {},
    actions: {}
  };
}
