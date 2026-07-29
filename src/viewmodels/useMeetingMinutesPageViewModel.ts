import { useState } from 'react';
import { useMeetingMinutesPageAdapter } from '../adapters/ui/useMeetingMinutesPageAdapter.ts';

export function useMeetingMinutesPageViewModel({ clientId }: any) {
  const { minutesData, loading } = useMeetingMinutesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('minutes');

  return {
    state: { minutesData, loading, activeTab },
    computed: { totalApprovedMinutes: 18 },
    actions: { setActiveTab }
  };
}
