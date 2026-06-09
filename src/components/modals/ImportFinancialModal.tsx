import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { 
  X, Loader2, CheckCircle2, UploadCloud, FileText, Trash2, 
  AlertTriangle, Info, Database
} from 'lucide-react';
import { 
  collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { notificationService } from '../../services/notificationService';
import { 
  parseFinancialExcel, parseFinancialPdf, parseFinancialTxt, 
  FinancialEntry, inferType 
} from '../../services/importService';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../lib/utils';
import { DOCUMENT_TYPES } from '../../constants/documents';
import { buildBPHierarchy } from '../../lib/bpEngine';

interface ImportFinancialModalProps {
  type: 'Balanço Patrimonial' | 'DRE' | 'BP' | 'DFC' | 'DLPA';
  clientId: string;
  year: number;
  clients: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportFinancialModal({ type, clientId, year, clients, onClose, onSuccess }: ImportFinancialModalProps) {
  const { translateLabel, t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>(type === 'BP' ? 'Balanço Patrimonial' : type);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<FinancialEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [importResult, setImportResult] = useState<number | null>(null);

  const clientName = clients.find(c => c.id === clientId)?.fantasia || 'Cliente';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setProgress(10);
    setStatus(t("modals.import_financial.reading_file"));

    try {
      let data: FinancialEntry[] = [];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        setStatus(t("modals.import_financial.processing_excel"));
        data = await parseFinancialExcel(selectedFile, setProgress);
      } else if (ext === 'pdf') {
        setStatus(t("modals.import_financial.reading_pdf"));
        data = await parseFinancialPdf(selectedFile, setProgress);
      } else if (ext === 'txt') {
        setStatus(t("modals.import_financial.reading_txt"));
        data = await parseFinancialTxt(selectedFile, setProgress);
      } else {
        throw new Error(t("modals.import_financial.unsupported_format"));
      }

      if (data.length === 0) throw new Error(t("modals.import_financial.no_data"));
      
      setParsedData(data);
      setProgress(100);
      setStatus(t("modals.import_financial.success_loaded"));
    } catch (err: any) {
      setError(err.message || t("modals.import_financial.error_processing"));
      setFile(null);
      setParsedData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setError('');
    setProgress(10);
    setStatus(t("modals.import_financial.preparing_db"));

    try {
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
        setStatus(`Arquivando ${docsToArchive.length} registros antigos (Versionamento)...`);
        await Promise.all(docsToArchive.map(d => updateDoc(doc(db, 'financial_entries', d.id), { 
          status: 'archived',
          archivedAt: serverTimestamp(),
          archivedBy: auth.currentUser!.uid
        })));
      }

      setProgress(40);
      setStatus(t("modals.import_financial.saving_data"));

      // 2. Classificar e Salvar
      let lastType = 'Ativo';
      const classified = parsedData.map(entry => {
        const inferred = inferType('', entry.category);
        if (['Ativo', 'Passivo', 'Patrimônio Líquido', 'Receitas', 'Despesas'].includes(inferred)) {
          lastType = inferred;
        }
        return {
          ...entry,
          type: lastType.toLowerCase(),
          explainability: {
            origin: 'import_file',
            transformation: 'raw_import',
            dePara: inferred,
            timestamp: new Date().toISOString(),
            version: 1,
            engine: 'ImportService'
          }
        };
      });

      let hasWarnings = false;

      // Validação Estrutural Rigorosa para BP
      if (selectedType === 'Balanço Patrimonial' || selectedType === 'BP') {
        const { summary } = buildBPHierarchy(classified);
        
        if (!summary.isBalanced) {
          console.warn(`Desbalanceamento detectado (R$ ${summary.divergence}).`);
          hasWarnings = true;
        }
        if (summary.hasOrphans) {
          console.warn(`Existem contas sem classificação ou grupo pai correspondente (Órfãs).`);
          hasWarnings = true;
        }
        if (summary.hasDuplicates) {
          console.warn(`Contas duplicadas encontradas.`);
          hasWarnings = true;
        }
      }

      // Validação Sintético/Analítico
      const unclassified = classified.filter(c => c.type === 'unknown' || !c.type);
      if (unclassified.length > 0) {
        console.warn(`Validação Estrutural Falhou: ${unclassified.length} conta(s) não puderam ser distinguidas.`);
        hasWarnings = true;
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
        data: classified,
        fileName: file!.name,
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
          fileName: file.name
        }
      });

      setImportResult(classified.length);
      setProgress(100);
      
      if (hasWarnings) {
        setStatus(t("modals.import_financial.success_warnings"));
        setTimeout(() => onSuccess(), 3500);
      } else {
        setStatus(t("modals.import_financial.success"));
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      setError(err.message || t("modals.import_financial.error_saving"));
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-muted-foreground">{t("modals.import_financial.title")} {selectedType}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest font-bold">
              {clientName} · {year}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">{t("modals.import_financial.doc_type")}</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            >
              {DOCUMENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{status}</p>
                <p className="text-sm font-black text-blue-600">{progress}%</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600 rounded-full" />
              </div>
            </div>
          )}

          {importResult ? (
            <div className="py-10 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-bold text-muted-foreground">{t("modals.import_financial.success_title")}</h4>
              <p className="text-sm text-muted-foreground">{importResult} contas importadas para o ano {year}.</p>
            </div>
          ) : !file ? (
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-blue-400 transition-all group relative bg-slate-50/30">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept=".xlsx,.xls,.csv,.pdf,.txt"
                onChange={handleFileChange}
              />
              <UploadCloud size={48} className="text-muted-foreground mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-bold text-muted-foreground">{t("modals.import_financial.drag_drop")}</p>
              <p className="text-xs text-muted-foreground mt-2">{t("modals.import_financial.supported_formats")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><FileText size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">{file.name}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase">{parsedData.length} itens encontrados</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setParsedData([]); }} className="p-2 hover:bg-blue-100 rounded-lg text-blue-400">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Preview Table */}
              <div className="border border-border rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-2 border-b border-border flex justify-between items-center">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("modals.import_financial.data_preview")}</span>
                  <span className="text-[10px] font-bold text-muted-foreground italic">{t("modals.import_financial.showing_items")}</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-4 py-2 font-bold text-muted-foreground">CONTA / CATEGORIA</th>
                      <th className="px-4 py-2 font-bold text-muted-foreground text-right">VALOR (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {parsedData.slice(0, 15).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 font-bold text-muted-foreground">{row.category}</td>
                        <td className="px-4 py-2 text-right font-mono text-muted-foreground">{formatCurrency(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-tight">{t("modals.import_financial.warning_replace")}</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Ao confirmar, todos os dados de <strong>{selectedType}</strong> existentes para <strong>{year}</strong> deste cliente serão <strong>apagados</strong> e substituídos pelo conteúdo deste arquivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
              <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600 font-bold">{error}</p>
            </div>
          ) || (
             !file && (
                <div className="bg-slate-50 p-4 rounded-2xl flex gap-3 items-center">
                  <Info size={16} className="text-blue-500" />
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {t("modals.import_financial.tip")} <strong>{t("modals.import_financial.account_name")}</strong> {t("modals.import_financial.and")} <strong>{t("modals.import_financial.balance")}</strong>.
                  </p>
                </div>
             )
          )}
        </div>

        {/* Footer */}
        {!importResult && (
          <div className="p-6 bg-slate-50 border-t border-border flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 text-muted-foreground font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleImport}
              disabled={loading || !file || parsedData.length === 0}
              className="flex-1 py-3.5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
              {loading ? t("modals.import_financial.importing") : t("modals.import_financial.confirm")}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

