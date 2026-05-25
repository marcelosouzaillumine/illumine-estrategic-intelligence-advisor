import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IntelligenceEngine, CURRENT_METHODOLOGY_VERSION } from '../services/intelligenceEngine';

export function useMethodologicalAnalysis(clientId: string, year: number, month: number, dbDre: any[], dbBp: any[]) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateAnalysis = useCallback(async (isCancelled: { current: boolean }) => {
    if (!clientId || (dbDre.length === 0 && dbBp.length === 0)) {
      if (!isCancelled.current) setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'methodological_analyses'),
        where('clientId', '==', clientId),
        where('year', '==', year),
        where('month', '==', month)
      );
      
      const snap = await getDocs(q);
      
      if (isCancelled.current) return;

      if (!snap.empty) {
        // Documento já existe, carrega a versão histórica sem alterar
        const docData = snap.docs[0].data();
        setAnalysis({ id: snap.docs[0].id, ...docData });
      } else {
        // Primeira vez processando, utiliza a metodologia atual
        const newAnalysisData = IntelligenceEngine.processFinancialData(dbDre, dbBp, CURRENT_METHODOLOGY_VERSION);
        
        const payload = {
          clientId,
          year,
          month,
          ...newAnalysisData,
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'methodological_analyses'), payload);
        
        if (!isCancelled.current) {
          setAnalysis({ id: docRef.id, ...payload });
        }
      }
    } catch (err: any) {
      if (!isCancelled.current) {
        console.error("Erro ao buscar ou criar análise metodológica:", err);
        setError(err.message || 'Erro ao processar análise');
      }
    } finally {
      if (!isCancelled.current) {
        setLoading(false);
      }
    }
  }, [clientId, year, month, dbDre, dbBp]);

  useEffect(() => {
    const isCancelled = { current: false };
    fetchOrCreateAnalysis(isCancelled);
    return () => { isCancelled.current = true; };
  }, [fetchOrCreateAnalysis]);

  const reprocessAnalysis = async () => {
    if (!analysis || !analysis.id) return;
    setLoading(true);
    try {
      const reprocessedData = IntelligenceEngine.processFinancialData(dbDre, dbBp, CURRENT_METHODOLOGY_VERSION);
      
      await updateDoc(doc(db, 'methodological_analyses', analysis.id), {
        reprocessed: {
          ...reprocessedData,
          reprocessedAt: new Date().toISOString()
        }
      });
      
      setAnalysis((prev: any) => ({
        ...prev,
        reprocessed: {
          ...reprocessedData,
          reprocessedAt: new Date().toISOString()
        }
      }));
    } catch (err: any) {
      console.error("Erro ao reprocessar análise:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, reprocessAnalysis, currentVersion: CURRENT_METHODOLOGY_VERSION };
}
