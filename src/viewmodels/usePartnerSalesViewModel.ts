import { useState } from 'react';

export function usePartnerSalesViewModel(props?: any) {
  const [pipelineTotalValue] = useState<number>(4500000);
  const [activeDealsCount] = useState<number>(14);

  return {
    state: { pipelineTotalValue, activeDealsCount },
    computed: {},
    actions: {}
  };
}
