import { useState } from 'react';
import { useDadosHistoricosAdapter } from '../../../adapters/ui/useDadosHistoricosAdapter.ts';

export function useDadosHistoricosViewModel({ clientId }: any) {
  const { data, loading } = useDadosHistoricosAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      totalRecords: data.length
    },
    actions: {
      setActiveTab
    }
  };
}
