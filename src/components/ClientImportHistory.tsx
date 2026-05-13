
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
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

export function ClientImportHistory({ clientId, clientName }: { clientId: string, clientName: string }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [docType, setDocType] = useState('DRE');
  const [periodType, setPeriodType] = useState<'mensal' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

  useEffect(() => {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }
  }, []);

  const docTypes = [
    'Balanço Patrimonial',
    'DRE',
    'DRE Gerencial',
    'DLPA',
    'DFC',
    'Contas a Pagar',
    'Contas a Receber'
  ];

  const fetchHistory = async () => {
    if (!clientId) return;
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [clientId]);

  const cleanNumber = (val: string | any) => {
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

    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      let dataEntries: { category: string, value: number }[] = [];

      if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
        const reader = new FileReader();
        const promise = new Promise<void>((resolve, reject) => {
          reader.onload = (evt) => {
            try {
              const bstr = evt.target?.result;
              const wb = XLSX.read(bstr, { type: 'binary' });
              const ws = wb.Sheets[wb.SheetNames[0]];
              const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
              
              rawData.forEach(row => {
                const cat = row[0]?.toString();
                const valNum = cleanNumber(row[1]);
                if (cat && !isNaN(valNum)) {
                  dataEntries.push({ category: cat, value: valNum });
                }
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsBinaryString(file!);
        });
        await promise;
      } else if (extension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => (item as any).str).join(' ') + '\n';
        }
        
        const lines = fullText.split('\n');
        lines.forEach(line => {
          const match = line.match(/(.*?)\s+([-+]?\d+[.,\d]*)$/);
          if (match) {
            const cat = match[1].trim();
            const val = cleanNumber(match[2]);
            if (cat && !isNaN(val) && cat.length < 100) {
              dataEntries.push({ category: cat, value: val });
            }
          }
        });
      } else {
        throw new Error('Formato de arquivo não suportado. Use XLSX, XLS, CSV ou PDF.');
      }

      if (dataEntries.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo.');
      }

      const payload = {
        clientId,
        clientName: clientName || 'N/A',
        type: docType,
        periodType,
        month: periodType === 'mensal' ? month : null,
        year,
        mes: periodType === 'mensal' ? month : null,
        ano: year,
        data: dataEntries,
        fileName: file.name,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'financial_entries'), payload);
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
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[m - 1];
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este lançamento?")) return;
    try {
      await deleteDoc(doc(db, 'financial_entries', id));
      fetchHistory();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `financial_entries/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database size={14} className="text-secondary" /> Nova Importação de Dados
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento</label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Período</label>
              <select 
                value={periodType} 
                onChange={(e) => setPeriodType(e.target.value as 'mensal' | 'anual')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            {periodType === 'mensal' ? (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mês/Ano</label>
                <div className="flex gap-1">
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="flex-1 px-2 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{getMonthName(m).substring(0,3)}</option>
                    ))}
                  </select>
                  <select 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="flex-1 px-2 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                  >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ano</label>
                <select 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileUpload}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all group",
              isDragging ? "border-secondary bg-secondary/5" : "border-slate-200 bg-white hover:border-secondary/40",
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
              <p className="text-[10px] text-slate-400 font-medium">
                Suportamos XLSX, XLS, CSV e PDF
              </p>
            </div>
          </div>

          {uploadStatus.type !== 'idle' && (
            <div className={cn(
              "mt-4 p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300",
              uploadStatus.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
            )}>
              {uploadStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span className="text-[10px] font-bold">{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
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
                <div key={h.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-secondary/20 transition-all relative">
                  <button 
                    onClick={() => handleDelete(h.id)}
                    className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="flex justify-between items-start mb-1 pr-5">
                    <span className="text-[8px] font-black uppercase text-secondary tracking-widest">{h.type}</span>
                    <span className="text-[8px] font-bold text-slate-400">
                      {h.periodType === 'anual' ? `ANUAL / ${h.year}` : `${getMonthName(h.month).substring(0,3)}/${h.year}`}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-primary truncate mb-1">{h.fileName}</p>
                  <p className="text-[9px] text-slate-400">Em: {h.createdAt?.toDate() ? h.createdAt.toDate().toLocaleDateString('pt-BR') : 'Recent'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-[10px] font-bold text-slate-400">Nenhum registro</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
