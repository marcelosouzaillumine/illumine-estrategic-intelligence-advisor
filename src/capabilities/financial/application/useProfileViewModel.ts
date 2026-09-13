import { useState } from 'react';
import { useProfileAdapter } from '../../../adapters/ui/useProfileAdapter.ts';

export function useProfileViewModel() {
  const { profile, loading } = useProfileAdapter();
  const [activeTab, setActiveTab] = useState('user');

  return {
    state: { profile, loading, activeTab },
    computed: { isVerified: true },
    actions: { setActiveTab }
  };
}
