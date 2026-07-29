import { useState } from 'react';
import { useExecutiveCognitivePageAdapter } from '../adapters/ui/useExecutiveCognitivePageAdapter.ts';

export function useExecutiveCognitivePageViewModel({ clientId }: any) {
  const { cognitiveInsights, loading } = useExecutiveCognitivePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('cognitive');

  return {
    state: { cognitiveInsights, loading, activeTab },
    computed: { confidenceScorePct: 97.8 },
    actions: { setActiveTab }
  };
}
