
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
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useClientImportAdapter } from '../adapters/ui/useClientImportAdapter';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';
import { DOCUMENT_TYPES } from '../constants/documents';
import { notificationService } from '../services/notificationService';
import { parseFinancialPdf } from '../services/importService';
import { useExecutiveFormatter } from "../core/localization";

export function ClientImportHistory({ clientId, clientName }: { clientId: string, clientName: string }) {
    const formatter = useExecutiveFormatter();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [docType, setDocType] = useState('DRE');
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const { fetchHistory: adapterFetchHistory, uploadFileAndData, deleteEntry } = useClientImportAdapter(clientId, clientName);

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }
  }, []);

  const docTypes = DOCUMENT_TYPES;

  const fetchHistory = async () => {
      const formatter = useExecutiveFormatter();
    if (!clientId) return;
    setHistoryLoading(true);
    try {
      const data = await adapterFetchHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    fetchHistory();
  }, [clientId]);

  const cleanNumber = (val: string | any) => {
      const formatter = useExecutiveFormatter();
    if (!val) return 0;
    const str = val.toString().trim();
    let cleaned = str.replace(/[R$\s]/g, '');
    
    if (cleaned.includes(',') && cleaned.includes('.')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.includes(',')) {
      cleaned = cleaned.replace(',', '.');
    }
    
    return parseFloat(cleaned) || 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
      const formatter = useExecutiveFormatter();
    e.preventDefault();
    setIsDragging(false);
    
    let file: File | undefined;
    if ('files' in e.target && (e.target as any).files) {
      file = (e.target as any).files[0];
    } else if ('dataTransfer' in e && (e as any).dataTransfer.files) {
      file = (e as any).dataTransfer.files[0];
    }

    if (!file || !clientId) return;

    setLoading(true);
    setUploadStatus({ type: 'idle' });

    try {
      await uploadFileAndData(file, docType, periodType, month, year);
      setUploadStatus({ type: 'success', message: `Arquivo "${file.name}" importado com sucesso!` });
      fetchHistory();
    } catch (err: any) {
      console.error(err);
      setUploadStatus({ type: 'error', message: err.message || 'Erro ao processar arquivo.' });
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (m: number) => {
      const formatter = useExecutiveFormatter();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[m - 1];
  };

  const handleDelete = async (id: string) => {
      const formatter = useExecutiveFormatter();
    if (!confirm("Deseja realmente excluir este lançamento?")) return;
    try {
      await deleteEntry(id);
      fetchHistory();
    } catch (e) {
      // Error handling is managed by the adapter
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-border">
          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database size={14} className="text-secondary" /> Nova Importação de Dados
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Documento</label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-bold outline-none"
              >
                {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Período</label>
              <select 
                value={periodType} 
                onChange={(e) => setPeriodType(e.target.value as 'mensal' | 'anual')}
                className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-bold outline-none"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            {periodType === 'mensal' ? (
              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Mês/Ano</label>
                <div className="flex gap-1">
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="flex-1 px-2 py-2 bg-white border border-border rounded-xl text-[10px] font-bold outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{getMonthName(m).substring(0,3)}</option>
                    ))}
                  </select>
                  <select 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="flex-1 px-2 py-2 bg-white border border-border rounded-xl text-[10px] font-bold outline-none"
                  >
                    {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Ano</label>
                <select 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-bold outline-none"
                >
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
          </div>

          <div 
            onDragOver={(e) => {
                          const formatter = useExecutiveFormatter(); e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all group",
              isDragging ? "border-secondary bg-secondary/5" : "border-border bg-white hover:border-secondary/40",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                isDragging ? "bg-secondary text-white" : "bg-slate-50 text-secondary"
              )}>
                {loading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
              </div>
              <h4 className="text-sm font-bold text-primary mb-1">
                {loading ? 'Processando...' : 'Arraste ou clique para importar'}
              </h4>
              <p className="text-[10px] text-muted-foreground font-medium">
                Suportamos XLSX, XLS, CSV e PDF
              </p>
            </div>
          </div>

          {uploadStatus.type !== 'idle' && (
            <div className={cn(
              "mt-4 p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300",
              uploadStatus.type === 'success' ? "bg-success-soft text-emerald-700 border border-emerald-100" : "bg-critical-soft text-rose-700 border border-rose-100"
            )}>
              {uploadStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span className="text-[10px] font-bold">{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm min-h-[300px]">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Clock size={14} className="text-secondary" /> Últimas Importações
          </h3>
          
          {historyLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-secondary" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-50 border border-border group hover:border-secondary/20 transition-all relative">
                  <button 
                    onClick={() => handleDelete(h.id)}
                    className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="flex justify-between items-start mb-1 pr-5">
                    <span className="text-[8px] font-black uppercase text-secondary tracking-widest">{h.type}</span>
                    <span className="text-[8px] font-bold text-muted-foreground">
                      {h.periodType === 'anual' ? `ANUAL / ${h.year}` : `${getMonthName(h.month).substring(0,3)}/${h.year}`}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-primary mb-1">{h.fileName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[9px] text-muted-foreground">Em: {h.createdAt?.toDate() ? formatter.date(h.createdAt.toDate()) : 'Recent'}</p>
                    {h.fileUrl && (
                      <a 
                        href={h.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] font-black text-secondary uppercase hover:underline"
                      >
                        Ver Original
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-border">
              <FileText size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-[10px] font-bold text-muted-foreground">Nenhum registro</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
