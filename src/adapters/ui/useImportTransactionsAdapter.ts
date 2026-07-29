import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { ImportReviewQueue, StagingValidationEngine, ImportPublicationEngine } from '../../services/FiduciaryRuntimeAdapter';

export function useImportTransactionsAdapter() {
  const importTransactions = async (
    datasetPayload: any,
    parsedData: any[],
    selectedClient: string,
    clients: any[],
    file: File | null,
    strategy: string,
    collectionName: string,
    title: string,
    setProgress: (p: number) => void,
    setProcessingStatus: (s: string) => void
  ) => {
    if (!auth.currentUser) throw new Error('Você precisa estar logado.');

    const batchId = datasetPayload.importId;
    let created = 0, deleted = 0;
    const actorId = auth.currentUser.uid;

    // 1. Enqueue to review queue fiduciarily
    ImportReviewQueue.enqueue(datasetPayload);

    // 2. Promote to runtime fiduciarily
    StagingValidationEngine.promoteToRuntime(datasetPayload, actorId);
    datasetPayload.status = 'APPROVED';

    // 3. Publish fiduciarily
    const publication = ImportPublicationEngine.publish(datasetPayload, actorId);
    if (!publication) {
      throw new Error("O motor de publicação recusou o dataset.");
    }

    // 4. Save fiduciarily enqueued entries in staging collection in Firestore
    const totalItems = parsedData.length;
    const batchSize = 100;

    for (let i = 0; i < totalItems; i += batchSize) {
      const chunk = parsedData.slice(i, i + batchSize);
      const currentProgress = Math.min(Math.round((i / totalItems) * 95), 95);
      setProgress(currentProgress);
      setProcessingStatus(`Salvando títulos: ${Math.min(i + batchSize, totalItems)} de ${totalItems}...`);

      const batch = writeBatch(db);
      const clientFantasia = clients.find(c => c.id === selectedClient)?.fantasia || 'N/A';
      
      for (const tx of chunk) {
        const docRef = doc(collection(db, 'financial_staging'));
        const targetPayload = {
          [collectionName === 'payables' ? 'fornecedor' : 'cliente']: tx.entidade,
          documento: tx.documento,
          emissao: tx.emissao,
          vencimento: tx.vencimento,
          valor: tx.valor,
          valorAberto: tx.valorAberto ?? tx.valor,
          categoria: tx.categoria || '',
          centroCusto: tx.centroCusto || '',
          clientId: selectedClient,
          batchId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser!.uid,
          creatorEmail: auth.currentUser!.email,
        };

        const stagingPayload = {
          clientId: selectedClient,
          clientName: clientFantasia,
          fileName: file?.name || 'unknown_file',
          batchId,
          status: 'pending',
          requiresApproval: true,
          sourceCollection: 'financial_staging',
          targetCollection: collectionName,
          payload: targetPayload,
          strategy,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser!.uid,
          creatorEmail: auth.currentUser!.email,
        };

        if (i === 0 && tx === chunk[0]) {
           await notificationService.createNotification({
            userId: 'admin_group',
            title: `Novas Importações: ${title}`,
            message: `${auth.currentUser!.email} importou ${totalItems} títulos para ${selectedClient}.`,
            type: 'approval_request',
            link: 'aprovacoes',
            metadata: {
              collection: collectionName,
              clientId: selectedClient,
              batchId,
              count: totalItems
            }
          });
        }
        batch.set(docRef, stagingPayload);
        created++;
      }
      await batch.commit();
    }

    return { created, deleted };
  };

  const fetchTransactions = async (selectedClient: string, collectionName: string) => {
    // Only fetch metadata or minimal info for validation if needed, just a stub
    // The previous implementation didn't do much with this anyway
    return [];
  };

  return { importTransactions, fetchTransactions };
}
