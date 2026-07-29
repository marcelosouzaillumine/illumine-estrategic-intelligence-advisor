import { useState } from 'react';
import { useControladoriaAdapter } from '../adapters/ui/useControladoriaAdapter.ts';

export function useControladoriaViewModel({ clientId }: any) {
  const { auditData, loading } = useControladoriaAdapter(clientId);
  const [activeTab, setActiveTab] = useState('compliance');

  return {
    state: { auditData, loading, activeTab },
    computed: { complianceIndexPct: 98.9 },
    actions: { setActiveTab }
  };
}
