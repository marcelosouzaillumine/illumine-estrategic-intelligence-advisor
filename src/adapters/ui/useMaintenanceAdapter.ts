import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, deleteDoc, doc, writeBatch, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { useGovernance } from '../../lib/governanceContext';
import { notificationService } from '../../services/notificationService';
export function useMaintenanceAdapter() {
  const [pendingDocs, setPendingDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const { role } = useGovernance();

  useEffect(() => {
    if (role !== 'master' && role !== 'admin') return;
    
    setLoadingDocs(true);
    const q = query(
      collection(db, 'financial_staging'),
      where('status', '==', 'pending')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingDocs(false);
    });
    
    return () => unsubscribe();
  }, [role]);

  const handleApprove = async (docId: string, entry: any, addLog: (msg: string) => void) => {
    try {
      const batch = (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // writeBatch(db);
      const targetDoc = doc(collection(db, entry.targetCollection || 'financial_entries'));
      batch.set(targetDoc, {
        ...(entry.payload || {}),
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: auth.currentUser?.uid,
        requiresApproval: false
      });
      batch.update(doc(db, 'financial_staging', docId), { status: 'migrated' });
      await batch.commit();
      
      await notificationService.createNotification({
        userId: entry.createdBy,
        title: 'Documento Aprovado',
        message: `Seu documento "${entry.fileName}" foi aprovado e já está disponível nos indicadores.`,
        type: 'success',
        link: 'dashboard'
      });
      
      addLog(`Documento ${entry.fileName} aprovado.`);
    } catch (error: any) {
      addLog(`Erro ao aprovar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleReject = async (docId: string, entry: any, addLog: (msg: string) => void) => {
    try {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'financial_staging', docId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: auth.currentUser?.uid
      });

      await notificationService.createNotification({
        userId: entry.createdBy,
        title: 'Documento Rejeitado',
        message: `Seu documento "${entry.fileName}" não pôde ser aprovado. Verifique os dados e tente novamente.`,
        type: 'error',
        link: 'dados-historicos'
      });

      addLog(`Documento ${entry.fileName} rejeitado.`);
    } catch (e: any) {
      addLog(`Erro ao rejeitar: ${e.message}`);
    }
  };

  const purgeMockupData = async (clientId: string, fantasia: string, addLog: (msg: string) => void, setStatus: (fn: any) => void) => {
    if (!window.confirm(`Deseja realmente realizar a limpeza cirúrgica de dados de MOCKUP para ${fantasia}? Esta ação removerá indicadores marcados como Histórico/Projetado e lançamentos financeiros simulados.`)) {
      return;
    }

    setStatus((prev: any) => ({ ...prev, [clientId]: 'loading' }));
    addLog(`Iniciando limpeza cirúrgica para ${fantasia}...`);

    try {
      let totalDeleted = 0;

      const indQuery = query(
        collection(db, 'indicators'),
        where('clientId', '==', clientId),
        where('cat', 'in', ['Histórico', 'Projetado'])
      );
      const indSnap = await getDocs(indQuery);
      
      const batch = (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // writeBatch(db);
      indSnap.docs.forEach(d => {
        batch.delete(d.ref);
        totalDeleted++;
      });
      await batch.commit();
      addLog(`Removidos ${indSnap.docs.length} indicadores (Histórico/Projetado).`);

      setStatus((prev: any) => ({ ...prev, [clientId]: 'success' }));
      addLog(`Limpeza concluída para ${fantasia}. Total de documentos removidos: ${totalDeleted}`);
    } catch (error: any) {
      console.error('Purge error:', error);
      setStatus((prev: any) => ({ ...prev, [clientId]: 'error' }));
      addLog(`ERRO em ${fantasia}: ${error.message}`);
    }
  };

  return {
    pendingDocs,
    loadingDocs,
    role,
    handleApprove,
    handleReject,
    purgeMockupData
  };
}
