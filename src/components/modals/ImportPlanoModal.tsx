import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Loader2, CheckCircle2, UploadCloud, FileText, Trash2, 
  AlertTriangle, Plus, RefreshCw, ShieldAlert, Info 
} from 'lucide-react';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';
import { 
  collection, addDoc, updateDoc, deleteDoc, getDocs, 
  query, where, serverTimestamp, writeBatch, doc 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { parseExcel, parseTxt, parsePdf, parseDoc, ImportedAccount } from '../../services/importService';
import { cn } from '../../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportStrategy = 'add_new' | 'replace_duplicates' | 'replace_all';

type AccountStatus = 'new' | 'duplicate' | 'conflict';

interface ClassifiedAccount extends ImportedAccount {
  _status: AccountStatus;
  _existingId?: string;
  _existingName?: string;
}

interface ImportPlanoModalProps {
  clients: any[];
  selectedClient?: string;
  onClose: () => void;
  onSuccess: () => void;
  planType?: 'accounting' | 'managerial';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AccountStatus, { label: string; color: string; bg: string; dot: string }> = {
  new:       { label: 'Nova',      color: 'text-emerald-700', bg: 'bg-success-soft border-emerald-200', dot: 'bg-success-soft0' },
  duplicate: { label: 'Duplicada', color: 'text-amber-700',   bg: 'bg-warning-soft border-amber-200',     dot: 'bg-amber-400'   },
  conflict:  { label: 'Conflito',  color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200',   dot: 'bg-orange-500'  },
};

const STRATEGY_CONFIG: Record<ImportStrategy, { label: string; desc: string; icon: React.ReactNode; danger?: boolean }> = {
  add_new: {
    label: 'Adicionar apenas novas',
    desc: 'Ignora contas duplicadas. Nunca sobrescreve dados existentes.',
    icon: <Plus size={16} />,
  },
  replace_duplicates: {
    label: 'Substituir duplicadas',
    desc: 'Atualiza nome e tipo das contas cujo código já existe, preservando vínculos de KPI.',
    icon: <RefreshCw size={16} />,
  },
  replace_all: {
    label: 'Substituir plano completo',
    desc: 'Remove todo o plano existente e importa do zero. Ação irreversível.',
    icon: <ShieldAlert size={16} />,
    danger: true,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ImportPlanoModal({ clients, selectedClient, onClose, onSuccess, planType: initialPlanType = 'accounting' }: ImportPlanoModalProps) {
  const [targetClient, setTargetClient] = useState(selectedClient || (clients.length > 0 ? clients[0].id : ''));
  const [targetPlanType, setTargetPlanType] = useState<'accounting' | 'managerial'>(initialPlanType);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedAccount[]>([]);
  const [classifiedData, setClassifiedData] = useState<ClassifiedAccount[]>([]);
  const [existingAccounts, setExistingAccounts] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [strategy, setStrategy] = useState<ImportStrategy>('add_new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number } | null>(null);

  // Fetch existing accounts when client changes
  useEffect(() => {
    if (!targetClient) {
      setExistingAccounts([]);
      return;
    }
    setLoadingExisting(true);
    const q = query(
      collection(db, 'account_plans'), 
      where('clientId', '==', targetClient)
    );
    getDocs(q).then(snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
      const relevant = all.filter(d => 
        d.planType === targetPlanType || 
        (!d.planType && targetPlanType === 'accounting')
      );
      setExistingAccounts(relevant);
    }).catch(() => {
      setExistingAccounts([]);
    }).finally(() => setLoadingExisting(false));
  }, [targetClient, targetPlanType]);

  // Re-classify when parsedData or existingAccounts change
  useEffect(() => {
    if (parsedData.length === 0) {
      setClassifiedData([]);
      return;
    }
    const existingMap = new Map<string, any>(existingAccounts.map(a => [a.code, a]));
    const classified = parsedData.map(acc => {
      const existing = existingMap.get(acc.code);
      let status: AccountStatus = 'new';
      if (existing) {
        status = existing.name?.trim() === acc.name?.trim() ? 'duplicate' : 'conflict';
      }
      return {
        ...acc,
        _status: status,
        _existingId: existing?.id,
        _existingName: existing?.name,
      };
    });
    setClassifiedData(classified);
  }, [parsedData, existingAccounts]);

  const counts = {
    new:       classifiedData.filter(a => a._status === 'new').length,
    duplicate: classifiedData.filter(a => a._status === 'duplicate').length,
    conflict:  classifiedData.filter(a => a._status === 'conflict').length,
  };

  const hasExistingPlan = existingAccounts.length > 0;

  // Determine what will actually happen given the strategy
  const getActionSummary = () => {
    if (strategy === 'add_new') return `${counts.new} contas serão criadas · ${counts.duplicate + counts.conflict} ignoradas`;
    if (strategy === 'replace_duplicates') return `${counts.new} criadas · ${counts.duplicate + counts.conflict} atualizadas`;
    if (strategy === 'replace_all') return `${existingAccounts.length} contas existentes serão excluídas · ${classifiedData.length} importadas`;
    return '';
  };

  // ── File parsing ────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setProgress(10);
    setProcessingStatus('Lendo arquivo...');
    try {
      let data: ImportedAccount[] = [];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      setProgress(30);
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        setProcessingStatus('Extraindo dados do Excel...');
        data = await parseExcel(selectedFile, setProgress);
      } else if (ext === 'pdf') {
        setProcessingStatus('Interpretando PDF...');
        data = await parsePdf(selectedFile, setProgress);
      } else if (ext === 'txt') {
        setProcessingStatus('Processando arquivo de texto...');
        data = await parseTxt(selectedFile, setProgress);
      } else if (ext === 'doc' || ext === 'docx') {
        setProcessingStatus('Processando arquivo Word...');
        data = await parseDoc(selectedFile, setProgress);
      } else {
        throw new Error('Formato não suportado. Use Excel, CSV, PDF, TXT ou DOC.');
      }
      setProgress(80);
      setProcessingStatus('Validando estrutura...');
      if (data.length === 0) throw new Error('Nenhuma conta encontrada no arquivo. Verifique o formato.');
      // Integrity check: ensure all rows have code and name
      const invalid = data.filter(a => !a.code?.trim() || !a.name?.trim());
      if (invalid.length > 0) {
        throw new Error(`${invalid.length} linha(s) sem código ou nome foram encontradas e serão ignoradas na importação.`);
      }
      setParsedData(data);
      setProgress(100);
      setProcessingStatus('Arquivo carregado!');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo.');
      setFile(null);
      setParsedData([]);
    } finally {
      setTimeout(() => { setLoading(false); setProgress(0); setProcessingStatus(''); }, 600);
    }
  };

  // ── Import ──────────────────────────────────────────────────────────────────
  const handleConfirmImport = async () => {
    if (!targetClient) { alert('Selecione um cliente.'); return; }
    if (!auth.currentUser) { alert('Você precisa estar logado.'); return; }

    setLoading(true);
    setError('');
    setProgress(0);
    setProcessingStatus('Iniciando importação...');

    let created = 0, updated = 0, skipped = 0;

    try {
      // Strategy C: wipe existing plan first
      if (strategy === 'replace_all') {
        setProcessingStatus('Removendo plano existente...');
        const chunkSize = 450;
        const existingDocs = existingAccounts;
        for (let i = 0; i < existingDocs.length; i += chunkSize) {
          const batch: any = blockedFirestoreWrite(); // writeBatch(db);
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
            level: (acc as any).level ?? acc.code.split('.').length,
            clientId: targetClient,
            planType: targetPlanType,
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser!.uid,
          };
          if (strategy === 'replace_all' || acc._status === 'new') {
            // Always create
            blockedFirestoreWrite(); // addDoc(collection(db, 'account_plans'), {
              // ...baseData,
              // status: 'pending',
              // requiresApproval: true,
              // sourceCollection: 'account_plans',
              // createdAt: serverTimestamp(),
              // creatorEmail: auth.currentUser!.email,
            // });

            if (i === 0 && acc === chunk[0]) {
               await notificationService.createNotification({
                userId: 'admin_group',
                title: `Novo Plano de Contas: ${targetPlanType === 'accounting' ? 'Contábil' : 'Gerencial'}`,
                message: `${auth.currentUser!.email} importou um novo plano de contas (${totalAccounts} itens) para ${clients.find(c => c.id === targetClient)?.fantasia || 'Cliente'}.`,
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
            // Update existing (preserve kpiMapping etc.)
            blockedFirestoreWrite(); // updateDoc(doc(db, 'account_plans', acc._existingId!), {
              // name: acc.name,
              // type: acc.type,
              // level: baseData.level,
              // status: 'pending',
              // requiresApproval: true,
              // sourceCollection: 'account_plans',
              // updatedAt: serverTimestamp(),
              // updatedBy: auth.currentUser!.uid,
              // updaterEmail: auth.currentUser!.email,
            // });

            if (i === 0 && acc === chunk[0]) {
               await notificationService.createNotification({
                userId: 'admin_group',
                title: `Atualização de Plano de Contas: ${targetPlanType === 'accounting' ? 'Contábil' : 'Gerencial'}`,
                message: `${auth.currentUser!.email} atualizou itens do plano de contas para ${clients.find(c => c.id === targetClient)?.fantasia || 'Cliente'}.`,
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

      setProgress(100);
      setProcessingStatus('Concluído!');
      setImportResult({ created, updated, skipped });
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao importar: ' + (err.message || 'Erro desconhecido.'));
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-black text-muted-foreground">Importar Plano de Contas</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">
              Destino: {targetPlanType === 'accounting' ? 'Contábil' : 'Gerencial'} · Excel · CSV · PDF · TXT · DOC
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-muted-foreground"><X size={20} /></button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {/* Progress bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{processingStatus}</p>
                <p className="text-sm font-black text-blue-600">{progress}%</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600 rounded-full" />
              </div>
            </div>
          )}

          {/* Success state */}
          {importResult ? (
            <div className="py-10 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                  <CheckCircle2 size={40} />
                </motion.div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-muted-foreground">Importação Concluída!</h4>
                <p className="text-sm text-muted-foreground">O plano de contas foi processado com sucesso.</p>
              </div>
              <div className="flex gap-4 mt-2">
                {importResult.created > 0 && (
                  <div className="text-center px-5 py-3 bg-success-soft border border-emerald-200 rounded-2xl">
                    <p className="text-2xl font-black text-emerald-600">{importResult.created}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Criadas</p>
                  </div>
                )}
                {importResult.updated > 0 && (
                  <div className="text-center px-5 py-3 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-2xl font-black text-blue-600">{importResult.updated}</p>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Atualizadas</p>
                  </div>
                )}
                {importResult.skipped > 0 && (
                  <div className="text-center px-5 py-3 bg-slate-50 border border-border rounded-2xl">
                    <p className="text-2xl font-black text-muted-foreground">{importResult.skipped}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ignoradas</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={onSuccess}
                className="px-5 md:px-8 py-2 md:py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all mt-4"
              >
                Concluir e Voltar
              </button>
            </div>
          ) : (
            <>
              {/* Client selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Cliente Destino</label>
                <select 
                  value={targetClient}
                  onChange={e => setTargetClient(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                >
                  <option value="">Selecione o Cliente...</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.fantasia} ({c.cnpj})</option>
                  ))}
                </select>
              </div>

              {/* Plan Type Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Tipo de Plano</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button 
                    onClick={() => setTargetPlanType('accounting')}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                      targetPlanType === 'accounting' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
                    )}
                  >
                    Contábil
                  </button>
                  <button 
                    onClick={() => setTargetPlanType('managerial')}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                      targetPlanType === 'managerial' ? "bg-white text-secondary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
                    )}
                  >
                    Gerencial
                  </button>
                </div>
                {loadingExisting && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 px-1">
                    <Loader2 size={11} className="animate-spin" /> Verificando plano existente...
                  </p>
                )}
                {!loadingExisting && targetClient && (
                  <p className="text-[10px] text-muted-foreground px-1 font-medium">
                    {hasExistingPlan
                      ? `⚠️ Este cliente já possui ${existingAccounts.length} contas cadastradas.`
                      : '✅ Nenhuma conta cadastrada ainda — importação limpa.'}
                  </p>
                )}
              </div>

              {/* File upload */}
              {!file ? (
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-blue-400 transition-all group relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".xlsx,.xls,.csv,.pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={36} className="text-muted-foreground mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-bold text-muted-foreground">Clique para selecionar ou arraste o arquivo</p>
                  <p className="text-xs text-muted-foreground mt-1">Excel, CSV, PDF, TXT ou DOC</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File chip */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><FileText size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-muted-foreground">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{parsedData.length} contas identificadas</p>
                      </div>
                    </div>
                    <button onClick={() => { setFile(null); setParsedData([]); setClassifiedData([]); }} className="p-1.5 hover:bg-blue-100 rounded text-blue-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Duplicate summary chips */}
                  {classifiedData.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {counts.new > 0 && (
                        <span className="px-3 py-1 bg-success-soft border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-soft0 inline-block" />
                          {counts.new} Novas
                        </span>
                      )}
                      {counts.duplicate > 0 && (
                        <span className="px-3 py-1 bg-warning-soft border border-amber-200 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                          {counts.duplicate} Duplicadas
                        </span>
                      )}
                      {counts.conflict > 0 && (
                        <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                          {counts.conflict} Conflitos
                        </span>
                      )}
                    </div>
                  )}

                  {/* Preview table with status badges */}
                  {classifiedData.length > 0 && (
                    <div className="max-h-44 overflow-y-auto border border-border rounded-xl bg-slate-50/30">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 font-black text-muted-foreground">STATUS</th>
                            <th className="px-3 py-2 font-black text-muted-foreground">CÓDIGO</th>
                            <th className="px-3 py-2 font-black text-muted-foreground">NOME</th>
                            <th className="px-3 py-2 font-black text-muted-foreground">TIPO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {classifiedData.slice(0, 15).map((acc, i) => {
                            const cfg = STATUS_CONFIG[acc._status];
                            return (
                              <tr key={i} className="group">
                                <td className="px-3 py-2">
                                  <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black border flex items-center gap-1 w-fit', cfg.bg, cfg.color)}>
                                    <span className={cn('w-1.5 h-1.5 rounded-full inline-block', cfg.dot)} />
                                    {cfg.label}
                                  </span>
                                </td>
                                <td className="px-3 py-2 font-mono font-bold text-muted-foreground">{acc.code}</td>
                                <td className="px-3 py-2 font-bold text-muted-foreground">
                                  {acc.name}
                                  {acc._status === 'conflict' && (
                                    <span className="block text-[9px] text-orange-400 font-medium">
                                      atual: {acc._existingName}
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-muted-foreground">{acc.type}</td>
                              </tr>
                            );
                          })}
                          {classifiedData.length > 15 && (
                            <tr>
                              <td colSpan={4} className="px-3 py-2 text-center text-muted-foreground font-medium italic">
                                + {classifiedData.length - 15} contas...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Strategy selector — only show when there's a file AND existing data */}
              {classifiedData.length > 0 && hasExistingPlan && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-1.5">
                    <Info size={11} /> Estratégia de Importação
                  </label>
                  <div className="space-y-2">
                    {(Object.entries(STRATEGY_CONFIG) as [ImportStrategy, typeof STRATEGY_CONFIG[ImportStrategy]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setStrategy(key)}
                        className={cn(
                          'w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all',
                          strategy === key
                            ? cfg.danger
                              ? 'border-rose-400 bg-critical-soft ring-2 ring-rose-300/30'
                              : 'border-blue-400 bg-blue-50 ring-2 ring-blue-300/20'
                            : 'border-border bg-white hover:bg-slate-50'
                        )}
                      >
                        <span className={cn(
                          'mt-0.5 shrink-0',
                          strategy === key
                            ? cfg.danger ? 'text-rose-600' : 'text-blue-600'
                            : 'text-muted-foreground'
                        )}>
                          {cfg.icon}
                        </span>
                        <div>
                          <p className={cn('text-xs font-black', strategy === key ? (cfg.danger ? 'text-rose-700' : 'text-blue-700') : 'text-muted-foreground')}>
                            {cfg.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{cfg.desc}</p>
                        </div>
                        <span className={cn(
                          'ml-auto mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 transition-all',
                          strategy === key
                            ? cfg.danger ? 'border-rose-500 bg-critical-soft0' : 'border-blue-500 bg-blue-500'
                            : 'border-border'
                        )} />
                      </button>
                    ))}
                  </div>

                  {/* Action summary */}
                  <div className={cn(
                    'p-3 rounded-xl border text-[11px] font-bold flex items-center gap-2',
                    strategy === 'replace_all'
                      ? 'bg-critical-soft border-rose-200 text-rose-700'
                      : 'bg-slate-50 border-border text-muted-foreground'
                  )}>
                    {strategy === 'replace_all' && <AlertTriangle size={13} className="text-rose-500 shrink-0" />}
                    {getActionSummary()}
                  </div>
                </div>
              )}

              {/* No existing plan info */}
              {classifiedData.length > 0 && !hasExistingPlan && (
                <div className="p-3 rounded-xl border bg-success-soft border-emerald-200 text-[11px] font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  Todas as {classifiedData.length} contas serão criadas (sem duplicidade).
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-critical-soft border border-rose-100 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-600 font-medium">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!importResult && (
          <div className="p-6 bg-slate-50 border-t border-border flex gap-3 shrink-0">
            <button 
              onClick={onClose}
              className="flex-1 py-3 text-muted-foreground font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirmImport}
              disabled={loading || !file || classifiedData.length === 0 || !targetClient}
              className={cn(
                "flex-1 py-3 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                strategy === 'replace_all'
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                  : "bg-secondary hover:bg-secondary/90 shadow-secondary/20"
              )}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {loading ? 'Importando...' : 'Confirmar Importação'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
