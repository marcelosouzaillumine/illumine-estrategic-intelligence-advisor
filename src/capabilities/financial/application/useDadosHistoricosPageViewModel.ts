import { useState } from 'react';
import { useDadosHistoricosPageAdapter } from '../../../adapters/ui/useDadosHistoricosPageAdapter.ts';

export function useDadosHistoricosPageViewModel({ clientId }: any) {
  const { historyData, loading } = useDadosHistoricosPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('history');

  return {
    state: { historyData, loading, activeTab },
    computed: { historicalYearsCount: 5 },
    actions: { setActiveTab }
  };
}
