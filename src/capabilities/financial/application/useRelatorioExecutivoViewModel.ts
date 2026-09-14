import { useState } from 'react';
import { useRelatorioExecutivoAdapter } from '../../../adapters/ui/useRelatorioExecutivoAdapter.ts';

export function useRelatorioExecutivoViewModel({ clientId }: any) {
  const { report, loading } = useRelatorioExecutivoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('executive');

  return {
    state: { report, loading, activeTab },
    computed: { isApproved: true },
    actions: { setActiveTab }
  };
}
