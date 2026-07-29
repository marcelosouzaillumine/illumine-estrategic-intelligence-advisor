import { useState } from 'react';
import { useSystemicIntelligencePanelAdapter } from '../adapters/ui/useSystemicIntelligencePanelAdapter.ts';

export function useSystemicIntelligencePanelViewModel({ clientId }: any) {
  const { systemicData, loading } = useSystemicIntelligencePanelAdapter(clientId);
  const [activeTab, setActiveTab] = useState('systemic');

  return {
    state: { systemicData, loading, activeTab },
    computed: { systemicHealthIndex: 98.9 },
    actions: { setActiveTab }
  };
}
