import { useState } from 'react';
import { useSystemicIntelligenceAdapter } from '../adapters/ui/useSystemicIntelligenceAdapter.ts';

export function useSystemicIntelligenceViewModel() {
  const { nodes, loading } = useSystemicIntelligenceAdapter();
  const [activeTab, setActiveTab] = useState('graph');

  return {
    state: { nodes, loading, activeTab },
    computed: { systemHealthIndex: 98.4 },
    actions: { setActiveTab }
  };
}
