import { useState } from 'react';
import { useDREAdapter } from '../../../adapters/ui/useDREAdapter';

export function useDREViewModel({ clientId }: any) {
  const { dreData, loading } = useDREAdapter(clientId);
  const [activeTab, setActiveTab] = useState('dre');

  return {
    state: {
      dreData,
      loading,
      activeTab
    },
    computed: {
      netRevenue: 0
    },
    actions: {
      setActiveTab
    }
  };
}
