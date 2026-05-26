import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Loader2, CheckCircle2, UploadCloud, FileText, Trash2, 
  AlertTriangle, Plus, ShieldAlert, Info 
} from 'lucide-react';
import { 
  collection, addDoc, getDocs, query, where, serverTimestamp, writeBatch, doc 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { parseTransactionsExcel, parseTransactionsPdf, ImportedTransaction } from '../../services/importService';
import { cn, formatDate } from '../../lib/utils';
import { StagingValidationEngine } from '../../core/runtime/integrations/StagingValidationEngine';
import { ImportReviewQueue } from '../../core/runtime/integrations/ImportReviewQueue';
import { ImportPublicationEngine } from '../../core/runtime/integrations/ImportPublicationEngine';
import { ImportedDataset, StagingValidationWarning } from '../../core/runtime/integrations/IntegrationGovernanceTypes';

type ImportStrategy = 'add_new' | 'replace_all';

interface ImportTransactionsModalProps {
  collectionName: 'payables' | 'receivables';
  selectedClient?: string;
  clients: any[];
  onClose: () => void;
  onSuccess: () => void;
  isMaster?: boolean;
}

const STRATEGY_CONFIG: Record<ImportStrategy, { label: string; desc: string; icon: React.ReactNode; danger?: boolean }> = {
  add_new: {
    label: 'Adicionar à base existente',
    desc: 'Adiciona os novos lançamentos sem excluir o que já está cadastrado.',
    icon: <Plus size={16} />,
  },
  replace_all: {
    label: 'Substituir toda a base',
    desc: 'Remove todos os títulos existentes deste cliente e importa do zero. Ação irreversível.',
    icon: <ShieldAlert size={16} />,
    danger: true,
  },
};

export function ImportTransactionsModal({ collectionName, selectedClient, clients, onClose, onSuccess, isMaster }: ImportTransactionsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedTransaction[]>([]);
  const [existingCount, setExistingCount] = useState<number>(0);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [strategy, setStrategy] = useState<ImportStrategy>('add_new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [importResult, setImportResult] = useState<{ created: number; deleted: number } | null>(null);
  
  // Staging Validation State
  const [validationWarnings, setValidationWarnings] = useState<StagingValidationWarning[]>([]);
  const [validationPassed, setValidationPassed] = useState(false);
  const [datasetPayload, setDatasetPayload] = useState<ImportedDataset | null>(null);

  const title = collectionName === 'payables' ? 'Contas a Pagar' : 'Contas a Receber';

  useEffect(() => {
    if (!selectedClient) return;
    setLoadingExisting(true);
    const q = query(collection(db, collectionName), where('clientId', '==', selectedClient));
    getDocs(q).then(snap => {
      setExistingCount(snap.size);
    }).catch(() => {
      setExistingCount(0);
    }).finally(() => setLoadingExisting(false));
  }, [selectedClient, collectionName]);

  const hasExistingData = existingCount > 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setProgress(10);
    setProcessingStatus('Lendo arquivo...');
    try {
      let data: ImportedTransaction[] = [];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      setProgress(30);
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        setProcessingStatus('Extraindo dados do Excel...');
        data = await parseTransactionsExcel(selectedFile, setProgress);
      } else if (ext === 'pdf') {
        setProcessingStatus('Extraindo dados do PDF...');
        data = await parseTransactionsPdf(selectedFile, setProgress);
      } else {
        throw new Error('Formato não suportado. Use Excel, CSV ou PDF.');
      }
      setProgress(80);
      setProcessingStatus('Validando estrutura transacional...');
      if (data.length === 0) throw new Error('Nenhum título válido encontrado no arquivo. Verifique o formato.');
      
      const batchId = `batch_${Date.now()}_${crypto.randomUUID()}`;
      
      const dataset: ImportedDataset = {
        importId: batchId,
        datasetType: collectionName === 'payables' ? 'TRANSACTIONS_PAYABLES' : 'TRANSACTIONS_RECEIVABLES',
        connectorId: ext === 'pdf' ? 'MANUAL_PDF' : 'MANUAL_XLSX',
        tenantId: 'default_tenant', // Placeholder for actual tenant
        workspaceId: 'default_workspace',
        rawPayloadSize: selectedFile.size,
        extractedRecords: data.length,
        trustLevel: 'LOW',
        status: 'PENDING_REVIEW',
        lineage: {
          tenantId: 'default_tenant',
          workspaceId: 'default_workspace',
          connectorId: ext === 'pdf' ? 'MANUAL_PDF' : 'MANUAL_XLSX',
          importId: batchId,
          datasetHash: batchId,
          sourceHash: selectedFile.name,
          mappingVersion: '1.0',
          timestamp: new Date().toISOString()
        },
        violations: [],
        parsedData: { transactions: data },
        submittedBy: auth.currentUser?.uid || 'unknown',
        submittedAt: new Date().toISOString(),
      };

      StagingValidationEngine.validateDataset(dataset);

      setValidationWarnings(dataset.blockingWarnings || []);
      setValidationPassed(dataset.stagingValidationPassed || false);
      setDatasetPayload(dataset);

      setParsedData(data);
      setProgress(100);
      setProcessingStatus('Arquivo carregado e validado!');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo.');
      setFile(null);
      setParsedData([]);
      setValidationWarnings([]);
      setDatasetPayload(null);
    } finally {
      setTimeout(() => { setLoading(false); setProgress(0); setProcessingStatus(''); }, 600);
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedClient) { alert('Selecione um cliente na tela anterior.'); return; }
    if (!auth.currentUser) { alert('Você precisa estar logado.'); return; }
    if (!validationPassed || !datasetPayload) { alert('O dataset não passou na validação ou não está carregado.'); return; }

    setLoading(true);
    setError('');
    setProgress(0);
    setProcessingStatus('Salvando em Staging...');

    const batchId = datasetPayload.importId;
    let created = 0, deleted = 0;

    try {
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

      // 4. Save fiduciarily enqueued entries in staging collection in Firestore (never write directly to payables/receivables)
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

          // Notify Admins (only once per batch start)
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

      setProgress(100);
      setProcessingStatus('Concluído!');
      setImportResult({ created, deleted });
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      console.error('Import Error:', err);
      setError(`Erro ao importar para ${collectionName} (UID: ${auth.currentUser?.uid || 'N/A'}): ` + (err.message || 'Erro desconhecido.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-black text-slate-900">Importar {title}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">Excel · CSV · PDF</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
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

          {importResult ? (
            <div className="py-10 flex flex-col items-center text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                  <CheckCircle2 size={40} />
                </motion.div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Importação Concluída!</h4>
                <p className="text-sm text-slate-500">Os títulos foram processados com sucesso.</p>
                <p className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-50 px-2 py-1 rounded">ID do Cliente: {selectedClient}</p>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="text-center px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <p className="text-2xl font-black text-emerald-600">{importResult.created}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Criados</p>
                </div>
                {importResult.deleted > 0 && (
                  <div className="text-center px-5 py-3 bg-rose-50 border border-rose-200 rounded-2xl">
                    <p className="text-2xl font-black text-rose-600">{importResult.deleted}</p>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Excluídos</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {loadingExisting ? (
                <p className="text-[10px] text-slate-400 flex items-center gap-1.5 px-1">
                  <Loader2 size={11} className="animate-spin" /> Verificando base existente...
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 px-1 font-medium">
                  {hasExistingData
                    ? `⚠️ Este cliente já possui ${existingCount} títulos em ${title}.`
                    : '✅ Nenhum título cadastrado ainda — importação limpa.'}
                </p>
              )}

              {!file ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-all group relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept=".xlsx,.xls,.csv,.pdf"
                    onChange={handleFileChange}
                  />
                  <UploadCloud size={36} className="text-slate-300 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">Clique para selecionar ou arraste o arquivo</p>
                  <p className="text-xs text-slate-400 mt-1">Excel, CSV e PDF. Títulos com data e valor na mesma linha.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><FileText size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{parsedData.length} títulos identificados</p>
                      </div>
                    </div>
                    <button onClick={() => { setFile(null); setParsedData([]); }} className="p-1.5 hover:bg-blue-100 rounded text-blue-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="max-h-44 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/30">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 font-black text-slate-400">ENTIDADE</th>
                          <th className="px-3 py-2 font-black text-slate-400">VENCIMENTO</th>
                          <th className="px-3 py-2 font-black text-slate-400">VALOR</th>
                          <th className="px-3 py-2 font-black text-slate-400">CATEGORIA</th>
                          <th className="px-3 py-2 font-black text-slate-400">CC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {parsedData.slice(0, 15).map((acc, i) => (
                          <tr key={i} className="group">
                            <td className="px-3 py-2 font-bold text-slate-700">{acc.entidade}</td>
                            <td className="px-3 py-2 text-slate-500">{formatDate(acc.vencimento)}</td>
                            <td className="px-3 py-2 text-slate-500 font-mono whitespace-nowrap">
                              <div className="font-bold">R$ {acc.valor}</div>
                              {acc.valorAberto !== undefined && acc.valorAberto !== acc.valor && (
                                <div className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">Aberto: R$ {acc.valorAberto}</div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-400">{acc.categoria}</td>
                            <td className="px-3 py-2 text-slate-400">{acc.centroCusto}</td>
                          </tr>
                        ))}
                        {parsedData.length > 15 && (
                          <tr>
                            <td colSpan={5} className="px-3 py-2 text-center text-slate-400 font-medium italic">
                              + {parsedData.length - 15} títulos...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {parsedData.length > 0 && hasExistingData && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
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
                              ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-300/30'
                              : 'border-blue-400 bg-blue-50 ring-2 ring-blue-300/20'
                            : 'border-slate-100 bg-white hover:bg-slate-50'
                        )}
                      >
                        <span className={cn(
                          'mt-0.5 shrink-0',
                          strategy === key
                            ? cfg.danger ? 'text-rose-600' : 'text-blue-600'
                            : 'text-slate-400'
                        )}>
                          {cfg.icon}
                        </span>
                        <div>
                          <p className={cn('text-xs font-black', strategy === key ? (cfg.danger ? 'text-rose-700' : 'text-blue-700') : 'text-slate-700')}>
                            {cfg.label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{cfg.desc}</p>
                        </div>
                        <span className={cn(
                          'ml-auto mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 transition-all',
                          strategy === key
                            ? cfg.danger ? 'border-rose-500 bg-rose-500' : 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        )} />
                      </button>
                    ))}
                  </div>

                  <div className={cn(
                    'p-3 rounded-xl border text-[11px] font-bold flex items-center gap-2',
                    strategy === 'replace_all'
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  )}>
                    {strategy === 'replace_all' && <AlertTriangle size={13} className="text-rose-500 shrink-0" />}
                    {strategy === 'replace_all' 
                      ? `${existingCount} títulos serão apagados e ${parsedData.length} serão criados.`
                      : `${parsedData.length} novos títulos serão adicionados à base existente.`}
                  </div>
                </div>
              )}

              {datasetPayload && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="font-bold text-slate-700 uppercase tracking-wide">Status da Validação</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                      validationPassed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    )}>
                      {validationPassed ? "VALIDADO" : "BLOQUEADO"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Grau de Confiança</p>
                      <p className="font-bold text-slate-700">{datasetPayload.trustLevel}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Linhagem (Lineage)</p>
                      <p className="font-mono text-[10px] text-slate-500 truncate" title={datasetPayload.lineage.datasetHash}>
                        {datasetPayload.lineage.connectorId} | {datasetPayload.lineage.datasetHash.substring(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validationWarnings.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                    <p className="text-xs text-rose-700 font-bold uppercase">Staging Warnings ({validationWarnings.length})</p>
                  </div>
                  <ul className="text-[11px] text-rose-600 font-medium pl-6 list-disc">
                    {validationWarnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                  {!validationPassed && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-widest">
                      O dataset foi bloqueado pela Governança de Staging e não pode ser promovido.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-600 font-medium">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {!importResult && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
            <button 
              onClick={onClose}
              className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirmImport}
              disabled={loading || !file || parsedData.length === 0 || !selectedClient || !validationPassed}
              className={cn(
                "flex-1 py-3 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                strategy === 'replace_all'
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                  : "bg-secondary hover:bg-secondary/90 shadow-secondary/20"
              )}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {loading ? 'Processando...' : 'Promover'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
