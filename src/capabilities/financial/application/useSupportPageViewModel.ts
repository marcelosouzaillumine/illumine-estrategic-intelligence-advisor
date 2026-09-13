import { useState } from 'react';
import { useSupportPageAdapter } from '../../../adapters/ui/useSupportPageAdapter.ts';

export function useSupportPageViewModel({ clientId }: any) {
  const { supportTickets, loading } = useSupportPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('support');

  return {
    state: { supportTickets, loading, activeTab },
    computed: { openTicketsCount: 0 },
    actions: { setActiveTab }
  };
}
