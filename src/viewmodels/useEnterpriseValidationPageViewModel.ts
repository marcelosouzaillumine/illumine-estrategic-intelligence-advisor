import { useState } from 'react';
import { useEnterpriseValidationPageAdapter } from '../adapters/ui/useEnterpriseValidationPageAdapter.ts';

export function useEnterpriseValidationPageViewModel() {
  const { validations, loading } = useEnterpriseValidationPageAdapter();
  const [activeTab, setActiveTab] = useState('validation');

  return {
    state: { validations, loading, activeTab },
    computed: { isEnterpriseReady: true },
    actions: { setActiveTab }
  };
}
