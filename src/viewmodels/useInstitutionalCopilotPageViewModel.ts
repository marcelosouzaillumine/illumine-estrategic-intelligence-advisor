import { useState } from 'react';
import { useInstitutionalCopilotPageAdapter } from '../adapters/ui/useInstitutionalCopilotPageAdapter.ts';

export function useInstitutionalCopilotPageViewModel({ clientId }: any) {
  const { copilotData, loading } = useInstitutionalCopilotPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('copilot');

  return {
    state: { copilotData, loading, activeTab },
    computed: { copilotConfidencePct: 99.1 },
    actions: { setActiveTab }
  };
}
