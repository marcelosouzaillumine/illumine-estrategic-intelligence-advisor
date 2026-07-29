import { useState } from 'react';

export function useCashFlowPageViewModel(props?: any) {
  const [currentBalance] = useState<number>(14850000);
  const [projectedMonthlyInflow] = useState<number>(3200000);

  return {
    state: { currentBalance, projectedMonthlyInflow },
    computed: {},
    actions: {}
  };
}
