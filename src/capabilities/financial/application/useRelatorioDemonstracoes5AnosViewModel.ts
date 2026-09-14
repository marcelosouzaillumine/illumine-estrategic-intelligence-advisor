import { useState } from 'react';
import { useRelatorioDemonstracoes5AnosAdapter } from '../../../adapters/ui/useRelatorioDemonstracoes5AnosAdapter.ts';

export function useRelatorioDemonstracoes5AnosViewModel({ clientId }: any) {
  const { report5YearsData, loading } = useRelatorioDemonstracoes5AnosAdapter(clientId);
  const [activeTab, setActiveTab] = useState('demonstracoes5anos');

  return {
    state: { report5YearsData, loading, activeTab },
    computed: { historicalYearsCount: 5 },
    actions: { setActiveTab }
  };
}
