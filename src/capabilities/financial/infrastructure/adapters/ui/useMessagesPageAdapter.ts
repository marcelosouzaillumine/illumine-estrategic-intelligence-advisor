import { useState } from 'react';

export function useMessagesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [messagesData, setMessagesData] = useState<any[]>([]);

  return { messagesData, loading };
}
