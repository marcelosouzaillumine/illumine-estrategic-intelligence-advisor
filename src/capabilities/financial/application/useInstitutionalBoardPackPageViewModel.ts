import { useState } from 'react';
import { useInstitutionalBoardPackPageAdapter } from '../../../adapters/ui/useInstitutionalBoardPackPageAdapter.ts';

export function useInstitutionalBoardPackPageViewModel({ clientId }: any) {
  const { boardPackData, loading } = useInstitutionalBoardPackPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('boardpack');

  return {
    state: { boardPackData, loading, activeTab },
    computed: { isBoardPackApproved: true },
    actions: { setActiveTab }
  };
}
