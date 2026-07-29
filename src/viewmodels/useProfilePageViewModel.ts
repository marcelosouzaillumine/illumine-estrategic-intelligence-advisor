import { useState } from 'react';
import { useProfilePageAdapter } from '../adapters/ui/useProfilePageAdapter.ts';

export function useProfilePageViewModel({ clientId }: any) {
  const { profileData, loading } = useProfilePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('profile');

  return {
    state: { profileData, loading, activeTab },
    computed: { isProfileComplete: true },
    actions: { setActiveTab }
  };
}
