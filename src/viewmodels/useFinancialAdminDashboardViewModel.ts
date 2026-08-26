import { useState } from 'react';
import { useFinancialAdminDashboardAdapter } from '../adapters/ui/useFinancialAdminDashboardAdapter.ts';

export function useFinancialAdminDashboardViewModel({ clientId }: any) {
  const [activeTab, setActiveTab] = useState('financial_admin_dashboard');

  const capability: any = {
    status: 'UNAVAILABLE',
    reason: 'ADMIN_DASHBOARD_DATA_SOURCES_NOT_MIGRATED'
  };

  return {
    state: { capability, activeTab },
    computed: { 
      summaryMetrics: {
        totalRevenue: 2500000,
        netMargin: 15.4,
        cashRunway: 8
      },
      cashVsCompetencia: {
        desvioPercent: 4.2,
        status: 'Alinhado'
      }
    },
    actions: {
      setActiveTab
    }
  };
}
