import { useState } from 'react';
import { useDLPAPageAdapter } from '../adapters/ui/useDLPAPageAdapter.ts';

export function useDLPAPageViewModel({ clientId }: any) {
  const { dlpaData, loading } = useDLPAPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('retained');

  return {
    state: { dlpaData, loading, activeTab },
    computed: { retainedEarningsTotal: 15400000 },
    actions: { setActiveTab }
  };
}
