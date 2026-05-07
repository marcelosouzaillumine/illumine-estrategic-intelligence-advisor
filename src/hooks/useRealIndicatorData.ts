import { useState, useEffect } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useRealIndicatorData(clientId: string, year: number, month: number) {
  const [realData, setRealData] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (!clientId) return;

    async function fetchRealData() {
      try {
        const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', clientId));
        const accSnap = await getDocs(qAcc);
        const mappedAccounts = accSnap.docs
          .map(d => d.data())
          .filter(d => d.kpiMapping);

        const qEntries = query(
          collection(db, 'financial_entries'), 
          where('clientId', '==', clientId),
          where('ano', '==', year),
          where('mes', '==', month)
        );
        const entriesSnap = await getDocs(qEntries);
        const entriesData = entriesSnap.docs.map(d => d.data().data || []);
        const flattened = entriesData.flat();

        const calculated: Record<string, number> = {};
        mappedAccounts.forEach((acc: any) => {
          const sum = flattened
            .filter((e: any) => e.category === acc.name)
            .reduce((s, e) => s + (Number(e.value) || 0), 0);
          
          if (!calculated[acc.kpiMapping]) calculated[acc.kpiMapping] = 0;
          calculated[acc.kpiMapping] += sum;
        });

        setRealData(calculated);
      } catch (err) {
        console.error("Error calculating real data:", err);
      }
    }

    fetchRealData();
  }, [clientId, year, month]);

  return realData;
}
