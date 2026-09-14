import { useState } from 'react';

export function useMessagesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  return {
    messages,
    loading
  };
}
