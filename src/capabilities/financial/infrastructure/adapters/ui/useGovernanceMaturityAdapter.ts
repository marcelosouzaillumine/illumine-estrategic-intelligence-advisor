import { useState, useEffect } from 'react';
import { db } from '../../../../../lib/firebase';
import { query, collection, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';

export function useGovernanceMaturityAdapter(clientId: string) {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);
  const [hasDiagnosis, setHasDiagnosis] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const today = new Date();
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', today.getFullYear()),
      where('mes', '==', today.getMonth() + 1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      setIndicators(docs);
    });

    return () => unsubscribe();
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    const q = query(
      collection(db, 'governance_diagnostics'),
      where('clientId', '==', clientId),
      orderBy('date', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        setResponses(latest.responses || {});
        setAiDiagnosis(latest.diagnosis);
        setHasDiagnosis(true);
      }
    });

    return () => unsubscribe();
  }, [clientId]);

  const saveDiagnosis = async (data: any) => {
    await addDoc(collection(db, 'governance_diagnostics'), {
      ...data,
      clientId,
      date: serverTimestamp()
    });
  };

  return {
    indicators,
    responses,
    aiDiagnosis,
    hasDiagnosis,
    saveDiagnosis
  };
}
