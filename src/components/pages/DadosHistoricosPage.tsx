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
  Info 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { User } from 'firebase/auth';
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
import { db, login, handleFirestoreError, OperationType } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { PageHeader } from '../Common';

export function DadosHistoricosPage({ clients, user }: { clients: any[], user: User | null }) {
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || '');
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
    if (!user || !selectedClient) return;
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', selectedClient),
        orderBy('createdAt', 'desc'),
        limit(20)
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
  }, [selectedClient, user]);

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
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      file = e.dataTransfer.files[0];
    }

    if (!file || !user || !selectedClient) return;

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
        clientId: selectedClient,
        clientName: clients.find(c => c.id === selectedClient)?.fantasia || 'N/A',
        type: docType,
        periodType,
        month: periodType === 'mensal' ? month : null,
        year,
        mes: periodType === 'mensal' ? month : null,
        ano: year,
        data: dataEntries,
        fileName: file.name,
        createdAt: serverTimestamp(),
        createdBy: user.uid
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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-100 rounded-3xl p-20 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Database size={48} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-display text-primary mb-2">Acesso Restrito</h3>
        <p className="text-slate-500 max-w-md mb-8 font-sans">Por favor, faça login com sua conta Google para gerenciar o banco de dados histórico dos clientes.</p>
        <button 
          onClick={login}
          className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <PageHeader 
        title="Dados Históricos" 
        description="Importe dados financeiros de balanços, DREs e fluxos de caixa para gerar as planilhas e indicadores."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Database size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-display">Nova Importação</h3>
                  <p className="text-[10px] uppercase font-black text-white/50 tracking-widest">Selecione os parâmetros e o arquivo</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cliente</label>
                  <select 
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  >
                    {clients.map(c => <option key={c.id} value={c.id}>{c.fantasia}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Documento</label>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  >
                    {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ano</label>
                  <select 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Período</label>
                  <select 
                    value={periodType} 
                    onChange={(e) => setPeriodType(e.target.value as 'mensal' | 'anual')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                {periodType === 'mensal' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mês do Período</label>
                    <select 
                      value={month} 
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>{getMonthName(m)}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileUpload}
                className={cn(
                  "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all group",
                  isDragging ? "border-secondary bg-secondary/5" : "border-slate-200 bg-slate-50 hover:border-secondary/40 hover:bg-white",
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
                    "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                    isDragging ? "bg-secondary text-white" : "bg-white text-secondary shadow-sm"
                  )}>
                    {loading ? <Loader2 size={32} className="animate-spin" /> : <UploadCloud size={32} />}
                  </div>
                  <h4 className="text-xl font-display text-primary mb-2">
                    {loading ? 'Processando Documento...' : 'Arraste seu arquivo aqui'}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                    Ou clique para selecionar de seu computador. <br/> Suportamos formatos **.XLSX, .XLS, .CSV e .PDF**
                  </p>
                </div>
              </div>

              {uploadStatus.type !== 'idle' && (
                <div className={cn(
                  "p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
                  uploadStatus.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                )}>
                  {uploadStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  <span className="text-xs font-bold">{uploadStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 font-sans flex items-center gap-2">
              <Clock size={16} className="text-secondary" />
              Ultimas Importações
            </h3>
            
            {historyLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-secondary" />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((h) => (
                  <div key={h.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-secondary/20 transition-all relative">
                    <button 
                      onClick={() => handleDelete(h.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <span className="text-[9px] font-black uppercase text-secondary tracking-widest">{h.type}</span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {h.periodType === 'anual' ? `ANUAL / ${h.year}` : `${getMonthName(h.month).substring(0,3)}/${h.year}`}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary truncate mb-1">{h.fileName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Importado em: {h.createdAt?.toDate().toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText size={40} className="mx-auto text-slate-200 mb-3" />
                <p className="text-xs font-bold text-slate-400">Nenhum registro encontrado</p>
              </div>
            )}
          </div>

          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-display mb-4">Dica de Importação</h4>
              <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">
                Mantenha a primeira coluna para o Nome da Conta e a segunda para o Valor Numérico. O sistema identifica automaticamente as contas do plano de contas.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary cursor-help">
                <Info size={14} /> Saiba mais
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-10 rotate-12">
              <Database size={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
