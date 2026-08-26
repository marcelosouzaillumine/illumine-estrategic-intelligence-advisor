import { useState, useCallback } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';

type ImportStrategy = 'add_new' | 'replace_duplicates' | 'replace_all';

export function useImportPlanoAdapter(targetClient: string, targetPlanType: 'accounting' | 'managerial', clients: any[]) {
  const [existingAccounts, setExistingAccounts] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const fetchExistingAccounts = useCallback(async () => {
    if (!targetClient) {
      setExistingAccounts([]);
      return;
    }
    setLoadingExisting(true);
    try {
      const q = query(
        collection(db, 'account_plans'), 
        where('clientId', '==', targetClient)
      );
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      const relevant = all.filter(d => 
        d.planType === targetPlanType || 
        (!d.planType && targetPlanType === 'accounting')
      );
      setExistingAccounts(relevant);
    } catch (e) {
      setExistingAccounts([]);
    } finally {
      setLoadingExisting(false);
    }
  }, [targetClient, targetPlanType]);

  const handleImportPlanoData = async (
    strategy: ImportStrategy,
    classifiedData: any[],
    setProgress: (p: number) => void,
    setProcessingStatus: (s: string) => void
  ) => {
    if (!targetClient) { throw new Error('Selecione um cliente.'); }
    if (!auth.currentUser) { throw new Error('Você precisa estar logado.'); }

    let created = 0, updated = 0, skipped = 0;

    // Strategy C: wipe existing plan first
    if (strategy === 'replace_all') {
      setProcessingStatus('Removendo plano existente...');
      const chunkSize = 450;
      const existingDocs = existingAccounts;
      for (let i = 0; i < existingDocs.length; i += chunkSize) {
        const batch = (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // writeBatch(db);
        existingDocs.slice(i, i + chunkSize).forEach(a => batch.delete(doc(db, 'account_plans', a.id)));
        await batch.commit();
      }
      setProgress(20);
    }

    const totalAccounts = classifiedData.length;
    const batchSize = 25;

    for (let i = 0; i < totalAccounts; i += batchSize) {
      const chunk = classifiedData.slice(i, i + batchSize);
      const currentProgress = strategy === 'replace_all'
        ? 20 + Math.min(Math.round((i / totalAccounts) * 78), 78)
        : Math.min(Math.round((i / totalAccounts) * 95), 95);
      setProgress(currentProgress);
      setProcessingStatus(`Salvando contas: ${Math.min(i + batchSize, totalAccounts)} de ${totalAccounts}...`);

      await Promise.all(chunk.map(async acc => {
        const baseData = {
          code: acc.code,
          name: acc.name,
          type: acc.type,
          level: acc.level ?? acc.code.split('.').length,
          clientId: targetClient,
          planType: targetPlanType,
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser!.uid || 'Usuário Atual',
        };

        if (strategy === 'replace_all' || acc._status === 'new') {
          // Always create
          (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'account_plans'), {
            ...baseData,
            status: 'pending',
            requiresApproval: true,
            sourceCollection: 'account_plans',
            createdAt: serverTimestamp(),
            creatorEmail: auth.currentUser!.email || 'usuario@sistema.com',
          });

          if (i === 0 && acc === chunk[0]) {
              await notificationService.createNotification({
              userId: 'admin_group',
              title: `Novo Plano de Contas: ${targetPlanType === 'accounting' ? 'Contábil' : 'Gerencial'}`,
              message: `${auth.currentUser!.email || 'Usuário'} importou um novo plano de contas (${totalAccounts} itens) para ${clients.find(c => c.id === targetClient)?.fantasia || 'Cliente'}.`,
              type: 'approval_request',
              link: 'maintenance',
              metadata: {
                type: 'AccountPlan',
                clientId: targetClient,
                planType: targetPlanType
              }
            });
          }

          created++;
        } else if (strategy === 'replace_duplicates' && (acc._status === 'duplicate' || acc._status === 'conflict')) {
          // Update existing
          (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'account_plans', acc._existingId!), {
            name: acc.name,
            type: acc.type,
            level: baseData.level,
            status: 'pending',
            requiresApproval: true,
            sourceCollection: 'account_plans',
            updatedAt: serverTimestamp(),
            updatedBy: auth.currentUser!.uid || 'Usuário Atual',
            updaterEmail: auth.currentUser!.email || 'usuario@sistema.com',
          });

          if (i === 0 && acc === chunk[0]) {
              await notificationService.createNotification({
              userId: 'admin_group',
              title: `Atualização de Plano de Contas: ${targetPlanType === 'accounting' ? 'Contábil' : 'Gerencial'}`,
              message: `${auth.currentUser!.email || 'Usuário'} atualizou itens do plano de contas para ${clients.find(c => c.id === targetClient)?.fantasia || 'Cliente'}.`,
              type: 'approval_request',
              link: 'maintenance',
              metadata: {
                type: 'AccountPlan',
                clientId: targetClient,
                planType: targetPlanType
              }
            });
          }

          updated++;
        } else {
          // add_new strategy: skip duplicates/conflicts
          skipped++;
        }
      }));
    }

    return { created, updated, skipped };
  };

  return {
    existingAccounts,
    loadingExisting,
    fetchExistingAccounts,
    handleImportPlanoData
  };
}
