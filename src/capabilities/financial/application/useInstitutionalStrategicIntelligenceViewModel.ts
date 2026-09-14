import { useState } from 'react';
import { useInstitutionalStrategicIntelligenceAdapter } from '../../../adapters/ui/useInstitutionalStrategicIntelligenceAdapter';

export function useInstitutionalStrategicIntelligenceViewModel({ clientId }: any) {
  const { strategicItems, loading } = useInstitutionalStrategicIntelligenceAdapter(clientId);
  const [activeTab, setActiveTab] = useState('governance');

  return {
    state: {
      strategicItems,
      loading,
      activeTab
    },
    computed: {
      readinessIndex: 94.6
    },
    actions: {
      setActiveTab
    }
  };
}
