import { useState } from 'react';
import { useMessagesPageAdapter } from '../../../adapters/ui/useMessagesPageAdapter.ts';

export function useMessagesPageViewModel({ clientId }: any) {
  const { messagesData, loading } = useMessagesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('messages');

  return {
    state: { messagesData, loading, activeTab },
    computed: { unreadCount: 3 },
    actions: { setActiveTab }
  };
}
