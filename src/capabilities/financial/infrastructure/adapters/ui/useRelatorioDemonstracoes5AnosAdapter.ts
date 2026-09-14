import { useState } from 'react';

export function useRelatorioDemonstracoes5AnosAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [report5YearsData, setReport5YearsData] = useState<any>({});
  return { report5YearsData, loading };
}
