import React, { useState, useEffect } from 'react';
import { 
  Database, 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X, 
  FileText, 
  Info,
  ShieldCheck,
  History,
  RotateCw,
  Trash2,
  Calendar,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  orderBy, 
  limit,
  updateDoc,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage, login, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { DOCUMENT_TYPES } from '../../constants/documents';
import { notificationService } from '../../services/notificationService';
import { PageHeader, MarkdownText } from '../Common/index';
import { FULL_MONTH_LABELS } from '../../constants';
import { parseFinancialDocumentIntelligent } from '../../services/importService';
import { DocumentCurationModal } from '../modals/DocumentCurationModal';
import { DocConfirmationModal, MandatoryClientModal } from '../modals/GovernanceModals';
import { useGovernance } from '../../lib/governanceContext';

export function DadosHistoricosPage({ 
  clients = [], 
  user = null,
  selectedClient = '',
  setSelectedClient = () => {},
  isApprovalMode = false,
  hideHeader = false
}: { 
  clients?: any[], 
  user?: any,
  selectedClient?: string,
  setSelectedClient?: (id: string) => void,
  isApprovalMode?: boolean,
  hideHeader?: boolean
}) {
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'idle', message?: string }>({ type: 'idle' });
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  // Bulk selection states
  const [selectedHistoryItems, setSelectedHistoryItems] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  
  // Selection States
  const [docType, setDocType] = useState('DRE');
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('mensal');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMandatoryModal, setShowMandatoryModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [curationDoc, setCurationDoc] = useState<any>(null);

  const governance = useGovernance();
  const role = governance?.role || 'cliente';

  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (role !== 'master' || !user) return;
    const collectionsToMonitor = ['financial_entries', 'payables', 'receivables', 'budgets', 'account_plans', 'document_uploads'];
    const unsubscribes = collectionsToMonitor.map(colName => {
      const q = query(collection(db, colName), where('status', '==', 'pending'));
      return onSnapshot(q, (snapshot) => {
        setPendingCounts(prev => ({ ...prev, [colName]: snapshot.size }));
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [role, user]);

  const totalPending = Object.values(pendingCounts).reduce((acc, curr) => acc + curr, 0);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, selectedClient, isApprovalMode]);

  useEffect(() => {
    setSelectedHistoryItems([]);
    setSelectedApprovals([]);
  }, [isApprovalMode, selectedClient]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
  }, []);

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const collectionsToFetch = ['financial_entries', 'payables', 'receivables', 'budgets', 'account_plans', 'document_uploads'];
      let allItems: any[] = [];

      const promises = collectionsToFetch.map(async (colName) => {
        try {
          let q;
          if (isApprovalMode) {
            let conditions: any[] = [];
            
            if (colName === 'document_uploads') {
              // Master Admin can see pending and approved (but not yet processed) documents
              // This allows them to see their own auto-approved uploads for curation
              if (role === 'master') {
                conditions.push(where('status', 'in', ['pending', 'approved']));
              } else {
                conditions.push(where('status', '==', 'pending'));
              }
            } else {
              conditions.push(where('status', '==', 'pending'));
            }

            if (selectedClient) {
              conditions.push(where('clientId', '==', selectedClient));
            }
            
            q = query(collection(db, colName), ...conditions, limit(100));
          } else {
            if (!selectedClient) return [];
            q = query(collection(db, colName), where('clientId', '==', selectedClient), limit(50));
          }
          const snap = await getDocs(q);
          return snap.docs.map(doc => ({ 
            id: doc.id, 
            sourceCollection: colName, 
            ...(doc.data() as any) 
          }));
        } catch (err) {
          console.error(`Error fetching from ${colName}:`, err);
          return [];
        }
      });
      const results = await Promise.all(promises);
      const flatResults = results.flat();
      const processedItems: any[] = [];
      const batchMap = new Map<string, any>();

      flatResults.forEach(item => {
        // Only group in approval mode and if it has a batchId
        if (isApprovalMode && item.batchId) {
          if (!batchMap.has(item.batchId)) {
            const batchEntry = { 
              ...item, 
              isBatch: true, 
              itemCount: 0,
              itemIds: [],
              // Use the first item's creation time for sorting
              sortDate: item.createdAt 
            };
            batchMap.set(item.batchId, batchEntry);
            processedItems.push(batchEntry);
          }
          const batchEntry = batchMap.get(item.batchId);
          batchEntry.itemCount++;
          batchEntry.itemIds.push(item.id);
        } else {
          processedItems.push({ ...item, sortDate: item.createdAt });
        }
      });

      allItems = processedItems.sort((a, b) => {
        const getVal = (obj: any) => {
          if (!obj?.sortDate) return 0;
          if (typeof obj.sortDate.toMillis === 'function') return obj.sortDate.toMillis();
          if (obj.sortDate.seconds) return obj.sortDate.seconds * 1000;
          return 0;
        };
        return getVal(b) - getVal(a);
      });

      setHistory(allItems);
    } catch (e) {
      console.error("Critical error fetching history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const cleanNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    let file: File | undefined;
    if ('target' in e && (e.target as HTMLInputElement).files) {
      file = (e.target as HTMLInputElement).files?.[0];
    } else if ('dataTransfer' in e) {
      file = (e as React.DragEvent).dataTransfer.files[0];
    }

    if (!file) return;
    if (!selectedClient) {
      setShowMandatoryModal(true);
      return;
    }
    setPendingFile(file);
    setShowConfirmModal(true);
  };

  const processUpload = async (file: File) => {
    if (!user || !selectedClient) return;

    setLoading(true);
    setUploadStatus({ type: 'idle' });
    setProgress(0);

    try {
      let fileUrl = '';
      try {
        setProgress(15);
        console.log(`[DEBUG] Iniciando upload: ${file.name} (${file.size} bytes)`);
        if (!storage) {
          console.error("[DEBUG] Storage não inicializado!");
          throw new Error("Sistema de armazenamento indisponível.");
        }
        const storagePath = `imports/${selectedClient}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        console.log(`[DEBUG] Caminho do storage: ${storagePath}`);
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);
        console.log("[DEBUG] uploadTask criado com sucesso");

        uploadTask.on('state_changed', 
          (snapshot) => {
            const bytesPer = snapshot.totalBytes > 0 ? (snapshot.bytesTransferred / snapshot.totalBytes) : 0;
            const p = Math.round(bytesPer * 30);
            console.log(`[DEBUG] Progresso Storage: ${Math.round(bytesPer * 100)}% (Snapshot: ${snapshot.bytesTransferred}/${snapshot.totalBytes})`);
            setProgress(15 + p);
          },
          (error) => {
            console.error("[DEBUG] Erro no callback do uploadTask:", error);
          }
        );

        // Timeout de 30 segundos para o upload
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout de Conexão ou Bloqueio do Servidor (30s)")), 30000)
        );

        try {
          const snapshot = await Promise.race([uploadTask, timeoutPromise]) as any;
          setProgress(40);
          fileUrl = await getDownloadURL(snapshot.ref);
          setProgress(50);
        } catch (raceErr: any) {
          console.error("[DEBUG] Erro no upload ou timeout:", raceErr);
          if (uploadTask && typeof uploadTask.cancel === 'function') {
            uploadTask.cancel();
          }
          throw new Error(`Falha de conexão com a Nuvem: ${raceErr.message}`);
        }
      } catch (err: any) {
        console.error("[DEBUG] Erro crítico no bloco de upload:", err);
        setUploadStatus({ type: 'error', message: `Erro ao processar arquivo: ${err.message}` });
        setLoading(false);
        return;
      }

      const fileName = file.name.toLowerCase();
      const clientData = (clients || []).find(c => c.id === selectedClient);

      if (fileName.endsWith('.pdf')) {
        const payload = {
          clientId: selectedClient,
          clientName: clientData?.fantasia || clientData?.razaoSocial || 'N/A',
          fileName: file.name,
          fileUrl,
          fileType: 'pdf',
          status: role === 'master' ? 'approved' : 'pending',
          requiresApproval: role === 'master' ? false : true,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          creatorEmail: user.email,
          sourceCollection: 'document_uploads',
          ...(role === 'master' ? { approvedAt: serverTimestamp() } : {})
        };
        await addDoc(collection(db, 'document_uploads'), payload);
        setProgress(90);
        setUploadStatus({ type: 'success', message: 'PDF enviado para curadoria estratégica!' });
      } else {
        const reader = new FileReader();
        const dataEntries: any[] = await new Promise((resolve, reject) => {
          reader.onload = (evt) => {
            try {
              const bstr = evt.target?.result;
              const wb = XLSX.read(bstr, { type: 'binary' });
              const ws = wb.Sheets[wb.SheetNames[0]];
              const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
              const entries: any[] = [];
              rawData.forEach(row => {
                const cat = row[0]?.toString();
                const val = cleanNumber(row[1]);
                if (cat && !isNaN(val)) entries.push({ category: cat, value: val });
              });
              resolve(entries);
            } catch (err) { reject(err); }
          };
          reader.readAsBinaryString(file);
        });

        if (dataEntries.length === 0) throw new Error('Nenhum dado válido encontrado.');

        const payload = {
          clientId: selectedClient,
          clientName: clientData?.fantasia || clientData?.razaoSocial || 'N/A',
          type: docType,
          periodType,
          month: periodType === 'mensal' ? month : null,
          year,
          data: dataEntries,
          fileName: file.name,
          fileUrl, 
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          creatorEmail: user.email,
          status: role === 'master' ? 'approved' : 'pending',
          requiresApproval: role === 'master' ? false : true,
          sourceCollection: 'financial_entries',
          ...(role === 'master' ? { approvedAt: serverTimestamp() } : {})
        };
        await addDoc(collection(db, 'financial_entries'), payload);
        setProgress(90);
        setUploadStatus({ type: 'success', message: 'Dados importados e aguardando aprovação.' });
      }

      await fetchHistory();
      setProgress(100);
      setTimeout(() => {
        setShowConfirmModal(false);
        setPendingFile(null);
      }, 1500);
    } catch (err: any) {
      console.error("Process upload error:", err);
      setUploadStatus({ type: 'error', message: err.message || 'Erro ao processar arquivo.' });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleApprove = async (id: string, collectionName: string, isBatch: boolean = false, ids: string[] = []) => {
    try {
      if (isBatch && ids.length > 0) {
        // Approval for entire batch
        const chunks = [];
        for (let i = 0; i < ids.length; i += 450) {
          chunks.push(ids.slice(i, i + 450));
        }

        for (const chunk of chunks) {
          const batch = writeBatch(db);
          chunk.forEach(itemId => {
            batch.update(doc(db, collectionName, itemId), {
              status: 'approved',
              approvedAt: serverTimestamp(),
              requiresApproval: false
            });
          });
          await batch.commit();
        }
      } else {
        // Single approval
        await updateDoc(doc(db, collectionName, id), { 
          status: 'approved', 
          approvedAt: serverTimestamp(),
          requiresApproval: false
        });
      }
      fetchHistory();
    } catch (e) {
      console.error("Error approving:", e);
    }
  };

  const handleReject = async (id: string, collectionName: string, isBatch: boolean = false, ids: string[] = []) => {
    if (!confirm(isBatch ? `Rejeitar todo o lote com ${ids.length} itens?` : "Rejeitar este lançamento?")) return;
    try {
      if (isBatch && ids.length > 0) {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 450) {
          chunks.push(ids.slice(i, i + 450));
        }

        for (const chunk of chunks) {
          const batch = writeBatch(db);
          chunk.forEach(itemId => {
            batch.update(doc(db, collectionName, itemId), {
              status: 'rejected',
              rejectedAt: serverTimestamp(),
              requiresApproval: false
            });
          });
          await batch.commit();
        }
      } else {
        await updateDoc(doc(db, collectionName, id), { 
          status: 'rejected', 
          rejectedAt: serverTimestamp(),
          requiresApproval: false
        });
      }
      fetchHistory();
    } catch (e) {
      console.error("Error rejecting:", e);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm("Excluir este lançamento?")) return;
    try {
      await deleteDoc(doc(db, colName, id));
      fetchHistory();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${colName}/${id}`);
    }
  };

  // --- Bulk History Select & Actions ---
  const handleSelectAllHistory = () => {
    const visibleIds = history.slice(0, 10).map(h => h.id);
    const allSelected = visibleIds.every(id => selectedHistoryItems.includes(id));
    if (allSelected) {
      setSelectedHistoryItems(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedHistoryItems(prev => {
        const newSelection = [...prev];
        visibleIds.forEach(id => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const handleHistorySelectToggle = (id: string) => {
    setSelectedHistoryItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteHistory = async () => {
    if (selectedHistoryItems.length === 0) return;
    if (!confirm(`Excluir os ${selectedHistoryItems.length} lançamentos selecionados?`)) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedHistoryItems.length; i += 450) {
        chunks.push(selectedHistoryItems.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            batch.delete(doc(db, item.sourceCollection, id));
          }
        });
        await batch.commit();
      }

      setSelectedHistoryItems([]);
      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos excluídos com sucesso!' });
    } catch (e) {
      console.error("Error bulk deleting:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao excluir lançamentos selecionados.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Bulk Approval Select & Actions ---
  const handleSelectAllApprovals = () => {
    const allIds = history.map(h => h.id);
    const allSelected = allIds.every(id => selectedApprovals.includes(id));
    if (allSelected) {
      setSelectedApprovals([]);
    } else {
      setSelectedApprovals(allIds);
    }
  };

  const handleApprovalSelectToggle = (id: string) => {
    setSelectedApprovals(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedApprovals.length === 0) return;
    if (!confirm(`Aprovar os ${selectedApprovals.length} lançamentos selecionados?`)) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedApprovals.length; i += 450) {
        chunks.push(selectedApprovals.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            if (item.sourceCollection === 'document_uploads') {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'approved',
                approvedAt: serverTimestamp(),
                requiresApproval: false
              });
            } else if (item.isBatch && item.itemIds) {
              item.itemIds.forEach((itemId: string) => {
                batch.update(doc(db, item.sourceCollection, itemId), {
                  status: 'approved',
                  approvedAt: serverTimestamp(),
                  requiresApproval: false
                });
              });
            } else {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'approved',
                approvedAt: serverTimestamp(),
                requiresApproval: false
              });
            }
          }
        });
        await batch.commit();
      }

      setSelectedApprovals([]);
      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos aprovados com sucesso!' });
    } catch (e) {
      console.error("Error bulk approving:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao aprovar lançamentos selecionados.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRejectApprovals = async () => {
    if (selectedApprovals.length === 0) return;
    if (!confirm(`Rejeitar os ${selectedApprovals.length} lançamentos selecionados?`)) return;
    setLoading(true);
    try {
      const chunks = [];
      for (let i = 0; i < selectedApprovals.length; i += 450) {
        chunks.push(selectedApprovals.slice(i, i + 450));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          const item = history.find(h => h.id === id);
          if (item) {
            if (item.isBatch && item.itemIds) {
              item.itemIds.forEach((itemId: string) => {
                batch.update(doc(db, item.sourceCollection, itemId), {
                  status: 'rejected',
                  rejectedAt: serverTimestamp(),
                  requiresApproval: false
                });
              });
            } else {
              batch.update(doc(db, item.sourceCollection, id), {
                status: 'rejected',
                rejectedAt: serverTimestamp(),
                requiresApproval: false
              });
            }
          }
        });
        await batch.commit();
      }

      setSelectedApprovals([]);
      fetchHistory();
      setUploadStatus({ type: 'success', message: 'Lançamentos rejeitados com sucesso!' });
    } catch (e) {
      console.error("Error bulk rejecting:", e);
      setUploadStatus({ type: 'error', message: 'Erro ao rejeitar lançamentos selecionados.' });
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (m: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[m - 1] || '';
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-card border border-border rounded-card p-20 text-center">
        <Database size={48} className="text-muted-foreground/30 mb-6 animate-pulse" />
        <h3 className="text-xl font-display text-primary mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground font-medium max-w-md mb-8">Faça login com Google para gerenciar os dados.</p>
        <button onClick={login} className="px-5 md:px-8 py-2 md:py-3 bg-primary text-primary-foreground rounded-button font-bold uppercase tracking-widest hover:bg-primary/95 transition-all shadow-sm cursor-pointer">
          Entrar com Google
        </button>
      </div>
    );
  }

  const currentClient = (clients || []).find(c => c.id === selectedClient);

  return (
    <div className={cn("space-y-8 relative min-h-screen", hideHeader ? "" : "p-8")}>
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-card border border-border/80 rounded-card p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
            <Loader2 size={40} className="animate-spin text-secondary mx-auto" />
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Processando Documento</h4>
              <p className="text-body-sm text-muted-foreground font-medium">Sincronizando com a Nuvem...</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-secondary uppercase tracking-widest">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Status Notification */}
      {uploadStatus.type !== 'idle' && (
        <div className="fixed top-24 right-8 z-[150] w-full max-w-sm animate-in slide-in-from-right duration-500">
          <div className={cn(
            "p-5 rounded-card flex items-start gap-4 shadow-2xl border backdrop-blur-md text-white font-medium",
            uploadStatus.type === 'success' 
              ? "bg-success/90 border-success/20" 
              : "bg-destructive/90 border-destructive/20"
          )}>
            <div className="p-2 bg-white/10 rounded-lg">
              {uploadStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-semibold leading-tight">{uploadStatus.message}</p>
            </div>
            <button onClick={() => setUploadStatus({ type: 'idle' })} className="p-1 hover:bg-white/10 rounded-lg text-white/80 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <DocumentCurationModal 
        isOpen={!!curationDoc}
        onClose={() => setCurationDoc(null)}
        document={curationDoc}
        client={(clients || []).find(c => c.id === curationDoc?.clientId)}
        onSuccess={() => {
          setCurationDoc(null);
          fetchHistory();
        }}
      />
      
      <MandatoryClientModal isOpen={showMandatoryModal} onSelect={() => setShowMandatoryModal(false)} />
      
      {pendingFile && (
        <DocConfirmationModal
          isOpen={showConfirmModal}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingFile(null);
          }}
          onConfirm={() => {
            if (pendingFile) {
              setShowConfirmModal(false);
              processUpload(pendingFile);
            }
          }}
          data={{
            razaoSocial: currentClient?.razaoSocial || currentClient?.razao || 'N/A',
            fantasia: currentClient?.fantasia || 'N/A',
            cnpj: currentClient?.cnpj || 'N/A',
            tipoDocumento: docType,
            competencia: periodType === 'mensal' ? `${month}/${year}` : `${year}`,
            nomeArquivo: pendingFile.name
          }}
        />
      )}

      {isApprovalMode ? (
        <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
          <PageHeader 
            title="Monitoramento de Aprovações" 
            subtitle="Validação e liberação estratégica de documentos financeiros pendentes."
            icon={ShieldCheck}
            color="executive"
            actions={
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'dados_historicos' }))}
                className="flex items-center gap-2 px-4 py-2.5 bg-secondary/15 hover:bg-secondary/25 text-secondary rounded-button transition-all border border-secondary/20 shadow-sm cursor-pointer"
              >
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Painel de Envio</span>
              </button>
            }
          />
          
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 text-white flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-secondary animate-pulse" />
                <h3 className="text-lg font-display font-medium text-white">Fila de Aprovação ({history.length})</h3>
              </div>
              <button 
                onClick={fetchHistory} 
                className="p-2 bg-white/5 text-white/70 hover:text-white rounded-button hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
              >
                <RotateCw size={16} className={cn(historyLoading && "animate-spin")} />
              </button>
            </div>

            <div className="p-8">
              {historyLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>
              ) : history.length > 0 ? (
                <div className="space-y-6">
                  {/* Bulk actions bar for Approvals */}
                  <div className="flex items-center justify-between gap-4 p-4 bg-surface-container/30 border border-border/80 rounded-2xl">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={history.length > 0 && selectedApprovals.length === history.length}
                        onChange={handleSelectAllApprovals}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-foreground">Selecionar Tudo ({history.length})</span>
                    </label>

                    {selectedApprovals.length > 0 && (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleBulkApprove}
                          className="px-4 py-2 bg-success hover:bg-success/95 text-white rounded-button text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-success/20 active:scale-[0.98] cursor-pointer"
                        >
                          Aprovar Selecionados ({selectedApprovals.length})
                        </button>
                        <button 
                          onClick={handleBulkRejectApprovals}
                          className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-button hover:bg-destructive hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                        >
                          Rejeitar Selecionados ({selectedApprovals.length})
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((h) => (
                      <div key={h.id} className="p-6 rounded-2xl bg-surface-container/30 border border-border/80 hover:border-secondary/20 hover:bg-surface-container/50 transition-all duration-300 flex flex-col justify-between h-full group shadow-xs">
                        <div>
                          <div className="flex justify-between items-start mb-4 gap-2">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <input 
                                type="checkbox" 
                                checked={selectedApprovals.includes(h.id)}
                                onChange={() => handleApprovalSelectToggle(h.id)}
                                className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-black uppercase text-secondary tracking-widest block mb-1 truncate">{h.type || h.sourceCollection}</span>
                                <p className="text-sm font-bold text-foreground truncate">{h.clientName || 'Cliente'}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 bg-surface-container/85 px-2.5 py-1 rounded-full border border-border shrink-0">
                              {h.periodType === 'anual' ? h.year : (h.month ? `${getMonthName(h.month).substring(0,3)}/${h.year}` : h.year)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground font-sans mt-2 mb-6 line-clamp-2 break-all">{h.fileName || 'Documento sem nome'}</div>
                        </div>
                        
                        <div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                if (h.sourceCollection === 'document_uploads') setCurationDoc(h);
                                else handleApprove(h.id, h.sourceCollection, !!h.isBatch, h.itemIds);
                              }}
                              className="flex-1 py-2.5 bg-success hover:bg-success/95 text-white rounded-button text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-success/20 active:scale-[0.98] cursor-pointer"
                            >
                              {h.sourceCollection === 'document_uploads' ? 'Curadoria IA' : h.isBatch ? `Aprovar Lote (${h.itemCount})` : 'Aprovar'}
                            </button>
                            {!h.isBatch && h.sourceCollection !== 'document_uploads' && (
                               <button 
                                onClick={() => handleReject(h.id, h.sourceCollection)}
                                className="p-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-button hover:bg-destructive hover:text-white transition-all duration-300 cursor-pointer"
                               >
                                <Trash2 size={14} />
                               </button>
                            )}
                            {h.isBatch && (
                               <button 
                                onClick={() => handleReject(h.id, h.sourceCollection, true, h.itemIds)}
                                className="px-4 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-button hover:bg-destructive hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                               >
                                Rejeitar Lote
                               </button>
                            )}
                        </div>
                        {h.fileUrl && h.fileUrl.startsWith('http') ? (
                          <a href={h.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-[9px] text-center font-black text-slate-400 hover:text-secondary uppercase tracking-widest transition-colors duration-200">Ver Original</a>
                        ) : (
                          <span className="mt-4 block text-[9px] text-center font-bold text-destructive/50 uppercase tracking-widest">Arquivo Indisponível</span>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <CheckCircle2 size={48} className="mx-auto text-success/20 mb-4" />
                  <p className="text-xs text-muted-foreground font-medium">Fila de aprovações vazia. Tudo em dia!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
          <PageHeader 
            title="Acompanhamento e Envio de Dados" 
            subtitle="Centralize e monitore o fluxo de informações estratégicas da sua operação."
            icon={Database}
            color="executive"
          />

          {/* Master Admin Controls Card */}
          {role === 'master' && (
            <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-border/85 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md -mt-4 mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-bold uppercase tracking-widest text-primary">
                      Master Admin
                    </span>
                    <h3 className="text-body-sm font-bold text-white uppercase tracking-wider">
                      Fila de Aprovação Ativa
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium font-sans">
                    Há <strong className="text-white font-bold">{totalPending}</strong> documento(s) aguardando validação estratégica no sistema.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'aprovacoes' }))}
                className="relative z-10 flex items-center gap-3 px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] rounded-button font-bold text-[10px] uppercase tracking-widest transition-all duration-300 border border-white/10 shrink-0 cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>Ir para Aprovações ({totalPending})</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-start gap-4 flex-wrap bg-surface-container/60 p-4 rounded-card border border-border/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-background border border-border rounded-button p-1 shadow-sm">
                <div className="flex items-center px-4 py-2">
                  <FileText size={14} className="text-secondary mr-2.5 shrink-0" />
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-foreground hover:text-secondary transition-colors"
                  >
                    {DOCUMENT_TYPES.map(t => <option key={t} value={t} className="bg-card text-foreground">{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-background/85 rounded-button px-4 py-2 border border-border shadow-xs h-[42px]">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                  periodType === 'mensal' ? "text-secondary" : "text-muted-foreground"
                )}>Mensal</span>
                <button 
                  onClick={() => setPeriodType(periodType === 'mensal' ? 'anual' : 'mensal')}
                  className={cn(
                    "w-10 h-5 rounded-full p-1 transition-all duration-500 relative cursor-pointer",
                    periodType === 'anual' ? "bg-secondary" : "bg-border"
                  )}
                >
                  <motion.div 
                    animate={{ x: periodType === 'anual' ? 20 : 0 }}
                    className="w-3 h-3 bg-white rounded-full shadow-md"
                  />
                </button>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                  periodType === 'anual' ? "text-secondary" : "text-muted-foreground"
                )}>Anual</span>
              </div>

              <div className="flex items-center bg-background border border-border rounded-button p-1 shadow-sm h-[42px]">
                <div className={cn("flex items-center px-4 py-2", periodType === 'mensal' && "border-r border-border")}>
                  <Calendar size={14} className="text-secondary mr-2.5 shrink-0" />
                  <select 
                    value={year} 
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-foreground hover:text-secondary transition-colors"
                  >
                    {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                      <option key={y} value={y} className="bg-card text-foreground">{y}</option>
                    ))}
                  </select>
                </div>
                {periodType === 'mensal' && (
                  <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                    <select 
                      value={month} 
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer text-foreground hover:text-secondary transition-colors"
                    >
                      {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                        <option key={m} value={Number(m)} className="bg-card text-foreground">{label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-card p-8 shadow-xs relative overflow-hidden group">
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileUpload}
                  className={cn(
                    "relative h-[300px] rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer",
                    isDragging 
                      ? "bg-secondary/5 border-secondary" 
                      : "bg-surface-container/20 border-border/80 hover:border-secondary/40 hover:bg-surface-container/30"
                  )}
                >
                  <input type="file" onChange={(e) => e.target.files && handleFileUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-5 shadow-inner transition-transform duration-300 group-hover:scale-110">
                    <UploadCloud size={28} />
                  </div>
                  <h4 className="text-body-lg font-bold text-foreground mb-1.5">Arraste seu arquivo aqui</h4>
                  <p className="text-body-sm text-muted-foreground mb-4">PDF, XLSX, XLS ou CSV</p>
                  <button className="px-4 py-2 bg-background border border-border rounded-button text-[10px] font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-white transition-all shadow-xs pointer-events-none">
                    Selecionar Arquivo
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border rounded-card p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h3 className="text-body-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} className="text-secondary" /> 
                    Histórico Recente
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase bg-surface-container/60 px-3 py-1 rounded-full border border-border/50">
                      Últimos envios
                    </span>
                  </div>
                </div>

                {history.length > 0 && !historyLoading && (
                  <div className="flex items-center justify-between gap-4 p-4 bg-surface-container/30 border border-border/80 rounded-2xl mb-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={history.slice(0, 10).length > 0 && history.slice(0, 10).every(h => selectedHistoryItems.includes(h.id))}
                        onChange={handleSelectAllHistory}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-foreground">Selecionar Tudo ({Math.min(history.length, 10)})</span>
                    </label>

                    {selectedHistoryItems.length > 0 && (
                      <button 
                        onClick={handleBulkDeleteHistory}
                        className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-button hover:bg-destructive hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Excluir Selecionados ({selectedHistoryItems.length})
                      </button>
                    )}
                  </div>
                )}
                
                {historyLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-secondary" size={32} /></div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.slice(0, 10).map(h => (
                      <div key={h.id} className="p-4 rounded-xl bg-surface-container/30 border border-border/60 flex justify-between items-center group hover:bg-surface-container/50 hover:border-secondary/20 transition-all duration-300 shadow-xs gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <input 
                            type="checkbox" 
                            checked={selectedHistoryItems.includes(h.id)}
                            onChange={() => handleHistorySelectToggle(h.id)}
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
                          />
                          <div className="p-2.5 bg-background border border-border/50 rounded-lg text-secondary group-hover:border-secondary/20 transition-colors shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-body-sm font-bold text-foreground break-words">{h.fileName}</p>
                            <p className="text-[9px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">
                              {h.createdAt ? (typeof h.createdAt.toDate === 'function' ? h.createdAt.toDate().toLocaleDateString('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'}) : 'Recente') : 'Recente'}
                              {h.creatorEmail && ` • por ${h.creatorEmail}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2.5 py-1 rounded-full border", 
                            h.status === 'approved' 
                              ? "bg-success/10 text-success border-success/20" 
                              : h.status === 'rejected'
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-warning/10 text-warning border-warning/20"
                          )}>
                            {h.status === 'approved' ? 'Aprovado' : h.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                          </span>
                          <button 
                            onClick={() => handleDelete(h.id, h.sourceCollection)} 
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-surface-container/10">
                    <FileText size={36} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground font-medium">Nenhum registro de envio localizado.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-border/80 p-8 rounded-card text-white relative overflow-hidden group min-h-[220px] flex flex-col justify-between shadow-md">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/15 rounded-full blur-3xl group-hover:bg-secondary/25 transition-all duration-500 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center mb-6 shadow-inner shrink-0">
                    <Info size={22} className="text-secondary" />
                  </div>
                  <h4 className="text-h3 font-display font-medium text-white mb-2">Rastreabilidade & Integridade</h4>
                  <p className="text-body-sm text-slate-400 font-medium leading-relaxed font-sans">
                    Todos os documentos enviados passam por um processo de curadoria estratégica para garantir que os KPIs reflitam a realidade fiel do seu negócio.
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-card p-8 shadow-xs">
                <h4 className="text-body-sm font-semibold text-primary uppercase tracking-widest mb-6">Instruções de Envio</h4>
                <ul className="space-y-4">
                  {[
                    'Selecione o tipo de documento no menu de filtro.',
                    'Defina o período competente (Mensal ou Anual).',
                    'Arraste o arquivo ou utilize o seletor de arquivos.',
                    'Aguarde a validação e curadoria dos analistas.'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-body-sm text-muted-foreground font-medium leading-relaxed">
                      <div className="w-6 h-6 rounded-full bg-surface-container/60 border border-border/80 text-secondary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </div>
                      <span className="pt-0.5">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


