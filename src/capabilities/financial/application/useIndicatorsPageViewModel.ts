import { useState } from 'react';

export function useIndicatorsPageViewModel({ clientId }: any) {
  const [activeTab, setActiveTab] = useState('indicators');

  const capability: any = {
    status: 'UNAVAILABLE',
    reason: 'INDICATORS_DATA_SOURCE_NOT_MIGRATED'
  };

  return {
    state: { capability, activeTab },
    computed: { 
      performanceScore: 85,
      criticalIndicatorsCount: 2
    },
    actions: { setActiveTab }
  };
}
