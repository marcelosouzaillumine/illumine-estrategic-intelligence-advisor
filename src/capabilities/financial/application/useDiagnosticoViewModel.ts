import { useState } from 'react';
import { useDiagnosticoAdapter } from '../../../adapters/ui/useDiagnosticoAdapter.ts';

export function useDiagnosticoViewModel({ clientId }: any) {
  const { data, loading } = useDiagnosticoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('radar');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      completionScore: 88.0
    },
    actions: {
      setActiveTab
    }
  };
}
