import { useState, useEffect } from 'react';
import { parseFinancialDocumentIntelligent } from '../../services/importService';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { auditService } from '../../services/auditService';
import { useAccountPlan } from '../../hooks/useAccountPlan';

export function useDocumentCurationModalAdapter(client: any, docItem: any, onSuccess: () => void, isOpen: boolean) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedDocs, setExtractedDocs] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  const [customInstructions, setCustomInstructions] = useState(client?.customAIPrompt || '');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [editingEntry, setEditingEntry] = useState<{ docIdx: number; entryIdx: number } | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [isDuplicate, setIsDuplicate] = useState(false);
  
  const { accounts: standardAccounts } = useAccountPlan(client?.id || '', 'managerial');

  useEffect(() => {
    if (isOpen) {
      setExtractedDocs([]);
      setError('');
      setMappings({});
      setIsDuplicate(false);
      setCustomInstructions(client?.customAIPrompt || '');
    }
  }, [isOpen, client]);

  const checkDuplicate = async (docs: any[]) => {
    if (!client?.id) return false;
    try {
      for (const d of docs) {
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', client.id),
          where('type', '==', d.type),
          where('year', '==', d.year),
          where('month', '==', d.month),
          where('status', 'in', ['approved', 'processed'])
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return true;
        }
      }
    } catch (e) {
      console.error("Erro ao checar duplicidade:", e);
    }
    return false;
  };

  const handleProcessAI = async () => {
    if (!docItem.fileUrl || !docItem.fileUrl.startsWith('http')) {
      setError("Este documento não possui um arquivo válido vinculado (upload falhou). Você precisará fazer o upload novamente.");
      return;
    }

    setIsProcessing(true);
    setError('');
    setProgress(10);
    setExtractedDocs([]);

    try {
      if (client?.id && customInstructions !== client.customAIPrompt) {
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, { customAIPrompt: customInstructions });
      }

      const response = await fetch(docItem.fileUrl);
      const blob = await response.blob();
      const file = new File([blob], docItem.fileName, { type: 'application/pdf' });

      setProgress(30);

      const aiDocs = await parseFinancialDocumentIntelligent(
        file, 
        (pct) => setProgress(30 + Math.round((pct / 100) * 70)),
        customInstructions
      );

      if (aiDocs && aiDocs.length > 0) {
        setExtractedDocs(aiDocs);
        
        const hasDuplicate = await checkDuplicate(aiDocs);
        setIsDuplicate(hasDuplicate);
        
        const newMappings: Record<string, string> = {};
        aiDocs.forEach(d => {
          d.entries.forEach((e: any) => {
            const match = standardAccounts.find(sa => sa.name.toLowerCase() === e.category.toLowerCase());
            if (match) newMappings[e.category] = match.id;
          });
        });
        setMappings(newMappings);

      } else {
        setError('A Inteligência Artificial não encontrou dados válidos neste documento.');
      }
    } catch (err: any) {
      console.error("Curation Error:", err);
      let errorMessage = err.message || 'Erro ao processar com Inteligência Artificial.';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Erro de CORS ou Arquivo inacessível. Certifique-se de configurar as regras de CORS no Firebase Storage (consulte cors.json no diretório raiz).';
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleApprove = async () => {
    if (extractedDocs.length === 0) return;
    setIsSaving(true);
    setError('');

    try {
      await auditService.logAction({
        documentId: docItem.id,
        clientId: docItem.clientId,
        userId: docItem.createdBy,
        userEmail: docItem.creatorEmail,
        action: 'curation_approved',
        details: {
          extractedDocsCount: extractedDocs.length,
          mappingsApplied: mappings
        }
      });

      for (const aiDoc of extractedDocs) {
        const payload = {
          clientId: docItem.clientId,
          clientName: docItem.clientName,
          type: aiDoc.type,
          periodType: aiDoc.month === 12 ? 'anual' : 'mensal',
          month: aiDoc.month,
          year: aiDoc.year,
          mes: aiDoc.month,
          ano: aiDoc.year,
          cnpj: aiDoc.cnpj || null,
          confidenceScore: aiDoc.confidenceScore || 100,
          periodoOriginal: aiDoc.periodoDocumento || null,
          data: aiDoc.entries.map((e: any) => ({
            ...e,
            categoryOriginal: e.category,
            category: mappings[e.category] ? standardAccounts.find(sa => sa.id === mappings[e.category])?.name || e.category : e.category,
            standardAccountId: mappings[e.category] || null
          })),
          fileName: docItem.fileName,
          fileUrl: docItem.fileUrl,
          createdAt: serverTimestamp(),
          createdBy: docItem.createdBy,
          creatorEmail: docItem.creatorEmail,
          status: 'approved',
          requiresApproval: false,
          sourceCollection: 'financial_entries'
        };
        await addDoc(collection(db, 'financial_entries'), payload);
      }

      const docRef = doc(db, 'document_uploads', docItem.id);
      await updateDoc(docRef, { status: 'processed', processedAt: serverTimestamp() });

      await notificationService.createNotification({
        userId: docItem.createdBy,
        title: 'Documento Aprovado',
        message: `O documento ${docItem.fileName} foi curado e aprovado com sucesso.`,
        type: 'approval_request',
        link: 'dados-historicos',
        metadata: { clientId: docItem.clientId, fileName: docItem.fileName }
      });

      onSuccess();
    } catch (err: any) {
      console.error("Approval Error:", err);
      setError(err.message || 'Erro ao salvar os documentos aprovados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEntry = (docIdx: number, entryIdx: number, value: number) => {
    setEditingEntry({ docIdx, entryIdx });
    setEditValue(value);
  };

  const saveEditEntry = async () => {
    if (!editingEntry) return;
    const { docIdx, entryIdx } = editingEntry;
    
    const newDocs = [...extractedDocs];
    const oldValue = newDocs[docIdx].entries[entryIdx].value;
    const category = newDocs[docIdx].entries[entryIdx].category;
    newDocs[docIdx].entries[entryIdx].value = editValue;
    
    setExtractedDocs(newDocs);
    setEditingEntry(null);

    await auditService.logAction({
      documentId: docItem.id,
      clientId: docItem.clientId,
      userId: docItem.createdBy,
      userEmail: docItem.creatorEmail,
      action: 'value_edited',
      details: {
        category,
        oldValue,
        newValue: editValue,
        docType: newDocs[docIdx].type
      }
    });
  };

  const handleMapAccount = async (category: string, accountId: string) => {
    setMappings(prev => ({ ...prev, [category]: accountId }));
    await auditService.logAction({
      documentId: docItem.id,
      clientId: docItem.clientId,
      userId: docItem.createdBy,
      userEmail: docItem.creatorEmail,
      action: 'account_mapped',
      details: {
        originalCategory: category,
        standardAccountId: accountId
      }
    });
  };

  return {
    isProcessing,
    isSaving,
    progress,
    extractedDocs,
    error,
    customInstructions,
    setCustomInstructions,
    mappings,
    editingEntry,
    editValue,
    setEditValue,
    isDuplicate,
    standardAccounts,
    handleProcessAI,
    handleApprove,
    handleEditEntry,
    saveEditEntry,
    handleMapAccount,
    setEditingEntry,
    setExtractedDocs,
  };
}
