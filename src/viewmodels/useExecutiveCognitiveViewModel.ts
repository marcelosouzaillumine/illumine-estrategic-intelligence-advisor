import { useState } from 'react';
import { useExecutiveCognitiveAdapter } from '../adapters/ui/useExecutiveCognitiveAdapter';

export function useExecutiveCognitiveViewModel({ clientId }: any) {
  const { cognitiveInsights, loading } = useExecutiveCognitiveAdapter(clientId);
  const [activeTab, setActiveTab] = useState('insights');

  return {
    state: {
      cognitiveInsights,
      loading,
      activeTab
    },
    computed: {
      insightCount: cognitiveInsights.length
    },
    actions: {
      setActiveTab
    }
  };
}
