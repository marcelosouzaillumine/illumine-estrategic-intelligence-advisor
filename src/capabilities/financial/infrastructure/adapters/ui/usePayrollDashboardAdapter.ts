import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

export interface PayrollEmployee {
  id: string;
  nome: string;
  funcao: string;
  area: string;
  tipoContrato: string;
  status: string;
  admissao: string;
  custoAnual: number;
  custoMensal: number;
  salarioBase: number;
  encargos: number;
  decimoTerceiroFerias: number;
  verbasIndenizatorias: number;
  custoRescisaoEstimado: number;
}

export function usePayrollDashboardAdapter(clientId: string) {
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<any>(null);

  useEffect(() => {
    if (!clientId) return;

    setLoading(true);
    
    const unsubClient = onSnapshot(doc(db, 'clients', clientId), (snap) => {
      if (snap.exists()) {
        setClientInfo(snap.data());
      }
    });

    const q = query(collection(db, 'employees'), where('clientId', '==', clientId));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PayrollEmployee));
      setEmployees(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => {
      unsub();
      unsubClient();
    };
  }, [clientId]);

  return {
    employees,
    loading,
    clientInfo
  };
}
