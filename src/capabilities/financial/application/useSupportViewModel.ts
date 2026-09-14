import { useState } from 'react';
import { useSupportAdapter } from '../../../adapters/ui/useSupportAdapter';

export function useSupportViewModel({ clientId }: any) {
  const { tickets, loading } = useSupportAdapter(clientId);
  const [activeTab, setActiveTab] = useState('tickets');

  return {
    state: {
      tickets,
      loading,
      activeTab
    },
    computed: {
      ticketsCount: tickets.length
    },
    actions: {
      setActiveTab
    }
  };
}
