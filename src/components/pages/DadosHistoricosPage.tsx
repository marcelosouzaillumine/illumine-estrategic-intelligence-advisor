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
  writeBatch
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

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, selectedClient, isApprovalMode]);

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

        // Timeout de 45 segundos para o upload
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout de Conexão (45s)")), 45000)
        );

        try {
          const snapshot = await Promise.race([uploadTask, timeoutPromise]) as any;
          setProgress(40);
          fileUrl = await getDownloadURL(snapshot.ref);
          setProgress(50);
        } catch (raceErr: any) {
          console.error("[DEBUG] Erro no upload ou timeout:", raceErr);
          // Fallback: Prosseguir sem o arquivo físico se falhar ou der timeout
          fileUrl = `fallback_error_${Date.now()}`;
          console.warn("[DEBUG] Prosseguindo com fallback de URL");
          setProgress(50);
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

  const getMonthName = (m: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[m - 1] || '';
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <Database size={48} className="text-slate-200 mb-6" />
        <h3 className="text-xl font-display text-primary mb-2">Acesso Restrito</h3>
        <p className="text-slate-500 max-w-md mb-8">Faça login com Google para gerenciar os dados.</p>
        <button onClick={login} className="px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
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
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
            <Loader2 size={40} className="animate-spin text-blue-600 mx-auto" />
            <div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Processando Documento</h4>
              <p className="text-sm text-slate-500">Sincronizando com a Nuvem...</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase tracking-widest">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Status Notification */}
      {uploadStatus.type !== 'idle' && (
        <div className="fixed top-24 right-8 z-[150] w-full max-w-sm animate-in slide-in-from-right duration-500">
          <div className={cn(
            "p-5 rounded-2xl flex items-start gap-4 shadow-2xl border backdrop-blur-md",
            uploadStatus.type === 'success' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          )}>
            <div className="p-2 bg-white/20 rounded-lg">
              {uploadStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-tight">{uploadStatus.message}</p>
            </div>
            <button onClick={() => setUploadStatus({ type: 'idle' })} className="p-1 hover:bg-white/10 rounded-lg">
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
        <div className="animate-in fade-in duration-700 space-y-8">
          <PageHeader 
            title="Monitoramento de Aprovações" 
            subtitle="Validação e liberação estratégica de documentos financeiros pendentes."
            icon={ShieldCheck}
            badge="Master Admin"
          />
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-secondary" />
                <h3 className="text-lg font-display">Fila de Aprovação ({history.length})</h3>
              </div>
              <button onClick={fetchHistory} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                <RotateCw size={16} className={cn(historyLoading && "animate-spin")} />
              </button>
            </div>

            <div className="p-8">
              {historyLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>
              ) : history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((h) => (
                    <div key={h.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[9px] font-black uppercase text-secondary tracking-widest block mb-1">{h.type || h.sourceCollection}</span>
                          <p className="text-sm font-bold text-primary">{h.clientName || 'Cliente'}</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                          {h.periodType === 'anual' ? h.year : (h.month ? `${getMonthName(h.month).substring(0,3)}/${h.year}` : h.year)}
                        </span>
                      </div>
                      <div className="flex-1 text-xs text-slate-500 mb-6 truncate">{h.fileName || 'Documento s/ nome'}</div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if (h.sourceCollection === 'document_uploads') setCurationDoc(h);
                            else handleApprove(h.id, h.sourceCollection, !!h.isBatch, h.itemIds);
                          }}
                          className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase"
                        >
                          {h.sourceCollection === 'document_uploads' ? 'Curadoria IA' : h.isBatch ? `Aprovar Lote (${h.itemCount})` : 'Aprovar'}
                        </button>
                        {!h.isBatch && h.sourceCollection !== 'document_uploads' && (
                           <button 
                            onClick={() => handleReject(h.id, h.sourceCollection)}
                            className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"
                           >
                            <Trash2 size={14} />
                           </button>
                        )}
                        {h.isBatch && (
                           <button 
                            onClick={() => handleReject(h.id, h.sourceCollection, true, h.itemIds)}
                            className="px-3 py-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all text-[10px] font-black uppercase"
                           >
                            Rejeitar Lote
                           </button>
                        )}
                      </div>
                      {h.fileUrl && h.fileUrl.startsWith('http') ? (
                        <a href={h.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-[9px] text-center font-black text-slate-400 hover:text-secondary uppercase">Ver Original</a>
                      ) : (
                        <span className="mt-4 text-[9px] text-center font-bold text-red-300 uppercase">Arquivo Indisponível</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20"><CheckCircle2 size={48} className="mx-auto text-emerald-200 mb-4" /><p className="text-xs text-slate-400">Tudo em dia!</p></div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-700 space-y-12">
          <PageHeader 
            title="Acompanhamento e Envio de Dados" 
            subtitle="Centralize e monitore o fluxo de informações estratégicas da sua operação."
            icon={Database}
            color="bg-slate-900"
            badge={role === 'master' ? "Master Admin" : undefined}
            actions={role === 'master' ? (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'aprovacoes' }))}
                className="flex items-center gap-3 px-6 py-3 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-2xl transition-all border border-white/10"
              >
                <ShieldCheck size={18} />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Visão Master</p>
                  <p className="text-xs font-bold">Ir para Aprovações</p>
                </div>
              </button>
            ) : undefined}
          />

          <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
              <div className="flex items-center px-4 py-2 border-r border-slate-100">
                <FileText size={14} className="text-secondary mr-2.5" />
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center px-4 py-2 border-r border-slate-100">
                <Calendar size={14} className="text-secondary mr-2.5" />
                <select 
                  value={year} 
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                >
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              {periodType === 'mensal' && (
                <div className="flex items-center px-4 py-2 animate-in fade-in zoom-in duration-300">
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-secondary transition-colors"
                  >
                    {Object.entries(FULL_MONTH_LABELS).map(([m, label]) => (
                      <option key={m} value={Number(m)}>{label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-2.5 border border-slate-200 shadow-sm">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                periodType === 'mensal' ? "text-secondary" : "text-slate-400"
              )}>Mensal</span>
              <button 
                onClick={() => setPeriodType(periodType === 'mensal' ? 'anual' : 'mensal')}
                className={cn(
                  "w-10 h-5 rounded-full p-1 transition-all duration-500 relative",
                  periodType === 'anual' ? "bg-secondary" : "bg-slate-200"
                )}
              >
                <motion.div 
                  animate={{ x: periodType === 'anual' ? 20 : 0 }}
                  className="w-3 h-3 bg-white rounded-full shadow-md"
                />
              </button>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                periodType === 'anual' ? "text-secondary" : "text-slate-400"
              )}>Anual</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileUpload}
                className={cn(
                  "relative group h-[350px] rounded-[40px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-12 text-center",
                  isDragging ? "bg-secondary/5 border-secondary" : "bg-white border-slate-200 hover:border-secondary/50"
                )}
              >
                <input type="file" onChange={(e) => e.target.files && handleFileUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6"><UploadCloud size={32} /></div>
                <h4 className="text-lg font-display text-primary mb-2">Arraste seu arquivo aqui</h4>
                <p className="text-xs text-slate-400">PDF, XLSX, XLS ou CSV</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100">
                <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} className="text-secondary" /> Histórico Recente</h3>
                {historyLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-secondary" size={32} /></div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.slice(0, 10).map(h => (
                      <div key={h.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg text-slate-400"><FileText size={20} /></div>
                          <div>
                            <p className="text-sm font-bold text-primary">{h.fileName}</p>
                            <p className="text-[10px] text-slate-400">{h.createdAt ? (typeof h.createdAt.toDate === 'function' ? h.createdAt.toDate().toLocaleDateString() : 'Recent') : 'Recent'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("text-[8px] font-black uppercase px-2 py-1 rounded-full", h.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                            {h.status === 'approved' ? 'Aprovado' : 'Pendente'}
                          </span>
                          <button onClick={() => handleDelete(h.id, h.sourceCollection)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-300"><FileText size={40} className="mx-auto mb-2" /><p className="text-xs">Nenhum registro</p></div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
                <Info size={32} className="text-secondary mb-4 relative z-10" />
                <h4 className="text-lg font-display mb-2 relative z-10">Rastreabilidade & Integridade</h4>
                <p className="text-xs text-white/50 leading-relaxed relative z-10">
                  Todos os documentos enviados passam por um processo de curadoria estratégica para garantir que os KPIs reflitam a realidade fiel do seu negócio.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Instruções de Envio</h4>
                <ul className="space-y-3">
                  {[
                    'Selecione o tipo de documento no filtro superior',
                    'Defina a competência (Mensal ou Anual)',
                    'Arraste o arquivo para a área de upload',
                    'Aguarde a validação do Master Admin'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-[11px] text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                      {text}
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


