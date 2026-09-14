import { useState, useEffect, useCallback } from 'react';
import { FirestoreMethodologicalAnalysisAdapter } from '../../../../adapters/persistence/FirestoreMethodologicalAnalysisAdapter';

import { IntelligenceEngine, CURRENT_METHODOLOGY_VERSION } from '../../../../services/intelligenceEngine';

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
      const existingDoc = await FirestoreMethodologicalAnalysisAdapter.getAnalysis(clientId, year, month);
      
      if (isCancelled.current) return;

      if (existingDoc) {
        // Documento já existe, carrega a versão histórica sem alterar
        setAnalysis({ id: existingDoc.id, ...existingDoc.docData });
      } else {
        // Primeira vez processando, utiliza a metodologia atual
        const newAnalysisData = IntelligenceEngine.processFinancialData(dbDre, dbBp, CURRENT_METHODOLOGY_VERSION);
        
        const payload = {
          clientId,
          year,
          month,
          ...newAnalysisData,
        };

        const newId = await FirestoreMethodologicalAnalysisAdapter.createAnalysis(payload);
        
        if (!isCancelled.current) {
          setAnalysis({ id: newId, ...payload });
        }
      }
    } catch (err: any) {
      if (!isCancelled.current) {
        console.error("Erro ao buscar ou criar análise metodológica:", err);
        setError((err instanceof Error ? err.message : String(err)) || 'Erro ao processar análise');
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
      
      await FirestoreMethodologicalAnalysisAdapter.updateAnalysisReprocessed(analysis.id, reprocessedData);
      
      setAnalysis((prev: any) => ({
        ...prev,
        reprocessed: {
          ...reprocessedData,
          reprocessedAt: new Date().toISOString()
        }
      }));
    } catch (err: any) {
      console.error("Erro ao reprocessar análise:", err);
      setError((err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, reprocessAnalysis, currentVersion: CURRENT_METHODOLOGY_VERSION };
}
