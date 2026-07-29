import { useState } from 'react';
import { useMessagesAdapter } from '../adapters/ui/useMessagesAdapter.ts';

export function useMessagesViewModel({ clientId }: any) {
  const { messages, loading } = useMessagesAdapter(clientId);
  const [activeTab, setActiveTab] = useState('inbox');

  return {
    state: {
      messages,
      loading,
      activeTab
    },
    computed: {
      unreadCount: messages.filter((m: any) => !m.read).length
    },
    actions: {
      setActiveTab
    }
  };
}
