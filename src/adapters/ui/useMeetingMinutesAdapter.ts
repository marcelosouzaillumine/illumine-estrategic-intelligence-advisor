import { useState } from 'react';

export function useMeetingMinutesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState<any[]>([]);

  return {
    minutes,
    loading
  };
}
