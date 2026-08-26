import { useState } from 'react';
import { CapabilityState } from '../core/experience/contracts/CapabilityState';

export function useFinancialPositionViewModel({ clientId }: any) {
  const [activeTab, setActiveTab] = useState('position');

  const capability: CapabilityState = {
    status: 'UNAVAILABLE',
    reason: 'FINANCIAL_POSITION_DATA_SOURCE_NOT_MIGRATED'
  };

  return {
    state: {
      capability,
      activeTab
    },
    computed: {},
    actions: {
      setActiveTab
    }
  };
}
