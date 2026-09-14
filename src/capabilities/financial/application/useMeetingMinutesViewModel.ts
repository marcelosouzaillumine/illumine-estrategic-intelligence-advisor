import { useState } from 'react';
import { useMeetingMinutesAdapter } from '../../../adapters/ui/useMeetingMinutesAdapter.ts';

export function useMeetingMinutesViewModel({ clientId }: any) {
  const { minutes, loading } = useMeetingMinutesAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      minutes,
      loading,
      activeTab
    },
    computed: {
      totalMinutes: minutes.length
    },
    actions: {
      setActiveTab
    }
  };
}
