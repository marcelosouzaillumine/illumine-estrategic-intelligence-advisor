import { useState } from 'react';
import { useRelatorioExecutivoPageAdapter } from '../../../adapters/ui/useRelatorioExecutivoPageAdapter.ts';

export function useRelatorioExecutivoPageViewModel({ clientId }: any) {
  const { executiveReportData, loading } = useRelatorioExecutivoPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('relatorioexecutivo');

  return {
    state: { executiveReportData, loading, activeTab },
    computed: { isReportApproved: true },
    actions: { setActiveTab }
  };
}
