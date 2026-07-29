import { useState } from 'react';

export function useSupportPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  return { supportTickets, loading };
}
