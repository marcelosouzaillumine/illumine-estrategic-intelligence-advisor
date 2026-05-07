import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, CheckCircle2, UploadCloud, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { parseExcel, parseTxt, parsePdf, ImportedAccount } from '../../services/importService';

interface ImportPlanoModalProps {
  clients: any[];
  selectedClient?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportPlanoModal({ clients, selectedClient, onClose, onSuccess }: ImportPlanoModalProps) {
  const [targetClient, setTargetClient] = useState(selectedClient || (clients.length > 0 ? clients[0].id : ''));
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
      } else {
        throw new Error('Formato de arquivo não suportado. Use Excel, PDF ou TXT.');
      }

      setProgress(80);
      setProcessingStatus('Validando estrutura...');

      if (data.length === 0) {
        throw new Error('Nenhuma conta encontrada no arquivo. Verifique o formato.');
      }

      setParsedData(data);
      setProgress(100);
      setProcessingStatus('Arquivo carregado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo.');
      setFile(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setProcessingStatus('');
      }, 500);
    }
  };

  const handleConfirmImport = async () => {
    if (!targetClient) {
      alert('Selecione um cliente para importar o plano.');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);
    setProcessingStatus('Iniciando importação...');
    
    try {
      const batchSize = 25; 
      const totalAccounts = parsedData.length;
      
      for (let i = 0; i < totalAccounts; i += batchSize) {
        const chunk = parsedData.slice(i, i + batchSize);
        const currentProgress = Math.min(Math.round((i / totalAccounts) * 100), 95);
        setProgress(currentProgress);
        setProcessingStatus(`Salvando contas: ${i} de ${totalAccounts}...`);

        await Promise.all(chunk.map(acc => 
          addDoc(collection(db, 'account_plans'), {
            ...acc,
            clientId: targetClient,
            level: acc.code.split('.').length,
            status: 'Ativa',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid
          })
        ));
      }
      
      setProgress(100);
      setProcessingStatus('Importação concluída com sucesso!');
      setIsSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao salvar plano de contas: ' + (err.message || 'Erro desconhecido.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Importar Plano de Contas</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Excel, PDF ou TXT</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6">
          {loading && (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{processingStatus}</p>
                <p className="text-sm font-black text-blue-600">{progress}%</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <CheckCircle2 size={40} />
                </motion.div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Importação Concluída!</h4>
                <p className="text-sm text-slate-500">O plano de contas foi processado e salvo com sucesso.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Cliente Destino</label>
            <select 
              value={targetClient}
              onChange={e => setTargetClient(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              <option value="">Selecione o Cliente...</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.fantasia} ({c.cnpj})</option>
              ))}
            </select>
          </div>

          {!file ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 transition-all group relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept=".xlsx,.xls,.csv,.pdf,.txt"
                onChange={handleFileChange}
              />
              <UploadCloud size={40} className="text-slate-300 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm font-bold text-slate-600">Clique para selecionar ou arraste o arquivo</p>
              <p className="text-xs text-slate-400 mt-2">Suporta Excel, CSV, PDF e TXT</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{parsedData.length} contas identificadas</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFile(null); setParsedData([]); }}
                  className="p-1.5 hover:bg-blue-100 rounded text-blue-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {parsedData.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/30">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 font-black text-slate-400">CÓDIGO</th>
                        <th className="px-4 py-2 font-black text-slate-400">NOME</th>
                        <th className="px-4 py-2 font-black text-slate-400">TIPO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {parsedData.slice(0, 10).map((acc, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 font-mono font-bold text-slate-500">{acc.code}</td>
                          <td className="px-4 py-2 font-bold text-slate-700">{acc.name}</td>
                          <td className="px-4 py-2 text-slate-400">{acc.type}</td>
                        </tr>
                      ))}
                      {parsedData.length > 10 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-center text-slate-400 font-medium italic">
                            + {parsedData.length - 10} contas...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
            </>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirmImport}
            disabled={loading || !file || parsedData.length === 0}
            className="flex-1 py-3 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Confirmar Importação
          </button>
        </div>
      </motion.div>
    </div>
  );
}
