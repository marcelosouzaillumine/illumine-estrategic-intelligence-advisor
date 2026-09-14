import { useState } from 'react';
import { useInstitutionalStrategicIntelligencePageAdapter } from '../adapters/ui/useInstitutionalStrategicIntelligencePageAdapter.ts';

export function useInstitutionalStrategicIntelligencePageViewModel({ clientId }: any) {
  const { intelligenceData, loading } = useInstitutionalStrategicIntelligencePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('governance');

  return {
    state: { intelligenceData, loading, activeTab },
    computed: { intelligenceAccuracyPct: 99.8 },
    actions: { setActiveTab }
  };
}
