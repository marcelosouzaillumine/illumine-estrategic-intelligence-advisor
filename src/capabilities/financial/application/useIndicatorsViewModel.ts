import { useState } from 'react';
import { useIndicatorsAdapter } from '../../../adapters/ui/useIndicatorsAdapter.ts';

export function useIndicatorsViewModel({ clientId }: any) {
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      activeTab
    },
    computed: {
      totalIndicators: 15
    },
    actions: {
      setActiveTab
    }
  };
}
