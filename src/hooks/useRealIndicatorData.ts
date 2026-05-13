import { useState, useEffect } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface RealKPIs {
  margemLiquida: number;
  ebitda: number;
  roa: number;
  liquidezCorrente: number;
  [key: string]: number;
}

export function useRealIndicatorData(clientId: string, month: number, year: number) {
  const [kpis, setKpis] = useState<RealKPIs>({
    margemLiquida: 0,
    ebitda: 0,
    roa: 0,
    liquidezCorrente: 0,
  });
  
  useEffect(() => {
    if (!clientId) return;

    async function fetchRealData() {
      try {
        const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', clientId));
        const accSnap = await getDocs(qAcc);
        const mappedAccounts = accSnap.docs
          .map(d => d.data())
          .filter(d => d.kpiMapping);

        // Try both field naming conventions (imported data uses 'year'/'month', some use 'ano'/'mes')
        const qEntriesNew = query(
          collection(db, 'financial_entries'), 
          where('clientId', '==', clientId),
          where('year', '==', year),
          where('month', '==', month)
        );
        const qEntriesOld = query(
          collection(db, 'financial_entries'), 
          where('clientId', '==', clientId),
          where('ano', '==', year),
          where('mes', '==', month)
        );

        const [snapNew, snapOld] = await Promise.all([getDocs(qEntriesNew), getDocs(qEntriesOld)]);
        
        const allEntries = [
          ...snapNew.docs.map(d => d.data().data || []),
          ...snapOld.docs.map(d => d.data().data || []),
        ].flat();

        const calculated: RealKPIs = {
          margemLiquida: 0,
          ebitda: 0,
          roa: 0,
          liquidezCorrente: 0,
        };

        mappedAccounts.forEach((acc: any) => {
          const sum = allEntries
            .filter((e: any) => e.category === acc.name)
            .reduce((s: number, e: any) => s + (Number(e.value) || 0), 0);
          
          if (!calculated[acc.kpiMapping]) calculated[acc.kpiMapping] = 0;
          calculated[acc.kpiMapping] += sum;
        });

        setKpis(calculated);
      } catch (err) {
        console.error("Error calculating real KPI data:", err);
      }
    }

    fetchRealData();
  }, [clientId, year, month]);

  return { kpis };
}
