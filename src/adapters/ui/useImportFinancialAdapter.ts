import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { FinancialEntry } from '../../services/importService';

export function useImportFinancialAdapter(clientId: string, year: number, clientName: string) {

  const handleImportData = async (
    selectedType: string,
    parsedData: FinancialEntry[],
    classifiedData: any[],
    fileName: string
  ) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado");

    // 1. Marcar dados existentes como arquivados (Soft Delete / Versionamento)
    let typesToDelete: string[] = [];
    if (selectedType === 'Balanço Patrimonial' || selectedType === 'BP') {
      typesToDelete = ['Balanço Patrimonial', 'BP'];
    } else if (selectedType === 'DRE' || selectedType === 'DRE Gerencial') {
      typesToDelete = ['DRE', 'DRE Gerencial', 'DRE Contábil'];
    } else {
      typesToDelete = [selectedType];
    }
    
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', 'in', typesToDelete),
      where('year', '==', year)
    );
    const snap = await getDocs(q);
    const docsToArchive = snap.docs.filter(d => d.data().status !== 'archived');

    if (docsToArchive.length > 0) {
      await Promise.all(docsToArchive.map(d => updateDoc(doc(db, 'financial_entries', d.id), { 
        status: 'archived',
        archivedAt: serverTimestamp(),
        archivedBy: auth.currentUser!.uid
      })));
    }

    const payload = {
      clientId,
      clientName,
      tenantId: clientId,
      workspaceId: clientId,
      companyId: clientId,
      fiscalYear: year,
      statementVersion: '1.0',
      type: selectedType,
      year,
      data: classifiedData,
      fileName,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser!.uid,
      creatorEmail: auth.currentUser!.email,
      audit: {
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser!.uid,
        action: 'import',
        source: 'file_upload'
      },
      sourceCollection: 'financial_entries',
      status: 'pending',
      requiresApproval: true
    };

    await addDoc(collection(db, 'financial_entries'), payload);

    // Notify Admins
    await notificationService.createNotification({
      userId: 'admin_group',
      title: 'Novo Documento para Aprovação',
      message: `O cliente ${clientName} enviou um documento (${selectedType}) que requer sua revisão.`,
      type: 'approval_request',
      link: 'aprovacoes',
      metadata: {
        clientId,
        docType: selectedType,
        fileName
      }
    });

    return classifiedData.length;
  };

  return {
    handleImportData
  };
}
