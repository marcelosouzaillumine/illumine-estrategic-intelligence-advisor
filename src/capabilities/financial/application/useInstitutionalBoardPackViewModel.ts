import { useState } from 'react';
import { useInstitutionalBoardPackAdapter } from '../../../adapters/ui/useInstitutionalBoardPackAdapter';

export function useInstitutionalBoardPackViewModel({ clientId }: any) {
  const { boardPacks, loading } = useInstitutionalBoardPackAdapter(clientId);
  const [activeTab, setActiveTab] = useState('boardpacks');

  return {
    state: {
      boardPacks,
      loading,
      activeTab
    },
    computed: {
      packsCount: boardPacks.length
    },
    actions: {
      setActiveTab
    }
  };
}
