import { useState, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export function useCleanupToolAdapter() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const findClient = useCallback(async (targetCnpj: string) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'clients'), where('cnpj', '==', '03.377.237/0001-84'));
      const snap = await getDocs(q);
      if (snap.empty) {
        // Tenta sem pontuação
        const q2 = query(collection(db, 'clients'), where('cnpj', '==', targetCnpj));
        const snap2 = await getDocs(q2);
        if (snap2.empty) {
          throw new Error('Empresa Empório não encontrada pelo CNPJ.');
        }
        setClientId(snap2.docs[0].id);
      } else {
        setClientId(snap.docs[0].id);
      }
    } catch (e: any) {
      setStatus(prev => [...prev, { type: 'error', message: e.message }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setStatus([]);
    
    try {
      const q = query(
        collection(db, 'financial_entries'), 
        where('clientId', '==', clientId),
        where('type', '==', 'DRE'),
        where('year', 'in', Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i))
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setStatus(prev => [...prev, { type: 'info', message: `Nenhum registro da DRE encontrado para 2025 e 2026.` }]);
      } else {
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'financial_entries', d.id)));
        await Promise.all(deletePromises);
        setStatus(prev => [...prev, { type: 'success', message: `${snap.size} registros DRE de 2025-2026 removidos com sucesso.` }]);
      }
    } catch (e: any) {
      setStatus(prev => [...prev, { type: 'error', message: `Erro: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  return {
    loading,
    status,
    clientId,
    findClient,
    clearData
  };
}
