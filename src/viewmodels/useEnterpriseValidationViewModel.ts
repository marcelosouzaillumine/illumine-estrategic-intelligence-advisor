import { useState } from 'react';
import { useEnterpriseValidationAdapter } from '../adapters/ui/useEnterpriseValidationAdapter';

export function useEnterpriseValidationViewModel({ clientId }: any) {
  const { validations, loading } = useEnterpriseValidationAdapter(clientId);
  const [activeTab, setActiveTab] = useState('validation');

  return {
    state: {
      validations,
      loading,
      activeTab
    },
    computed: {
      integrityScore: 99.2
    },
    actions: {
      setActiveTab
    }
  };
}
