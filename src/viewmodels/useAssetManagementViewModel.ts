import { useState } from 'react';
import { useAssetManagementAdapter } from '../adapters/ui/useAssetManagementAdapter.ts';

export function useAssetManagementViewModel({ clientId }: any) {
  const { assets, loading } = useAssetManagementAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      assets,
      loading,
      activeTab
    },
    computed: {
      totalAssetsValue: 1250000.0
    },
    actions: {
      setActiveTab
    }
  };
}
