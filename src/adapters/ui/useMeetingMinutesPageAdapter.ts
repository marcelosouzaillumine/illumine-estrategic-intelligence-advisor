import { useState } from 'react';

export function useMeetingMinutesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [minutesData, setMinutesData] = useState<any[]>([]);

  return { minutesData, loading };
}
