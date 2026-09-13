import { useState } from 'react';
import { useInstitutionalKnowledgeGraphPageAdapter } from '../../../adapters/ui/useInstitutionalKnowledgeGraphPageAdapter.ts';

export function useInstitutionalKnowledgeGraphPageViewModel({ clientId }: any) {
  const { graphData, loading } = useInstitutionalKnowledgeGraphPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('knowledgegraph');

  return {
    state: { graphData, loading, activeTab },
    computed: { totalNodesCount: 1420 },
    actions: { setActiveTab }
  };
}
