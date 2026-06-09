
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export function CleanupTool() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any[]>([]);
  const [targetCnpj] = useState('03377237000184'); // CNPJ limpo do Empório do Marmore
  const [clientId, setClientId] = useState<string | null>(null);

  const findClient = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'clients'), where('cnpj', '==', '03.377.237/0001-84'));
      const snap = await getDocs(q);
      if (snap.empty) {
        // Tenta sem pontuação
        const q2 = query(collection(db, 'clients'), where('cnpj', '==', '03377237000184'));
        const snap2 = await getDocs(q2);
        if (snap2.empty) {
          throw new Error('Empresa Empório não encontrada pelo CNPJ.');
        }
        setClientId(snap2.docs[0].id);
      } else {
        setClientId(snap.docs[0].id);
      }
    } catch (e: any) {
      setStatus(prev => [...prev, { type: 'error', message: e.message }]);
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!clientId) return;
    setLoading(true);
    setStatus([]);
    
    try {
      const q = query(
        collection(db, 'financial_entries'), 
        where('clientId', '==', clientId),
        where('type', '==', 'DRE'),
        where('year', 'in', Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i))
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setStatus(prev => [...prev, { type: 'info', message: `Nenhum registro da DRE encontrado para 2025 e 2026.` }]);
      } else {
        const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'financial_entries', d.id)));
        await Promise.all(deletePromises);
        setStatus(prev => [...prev, { type: 'success', message: `${snap.size} registros DRE de 2025-2026 removidos com sucesso.` }]);
      }
    } catch (e: any) {
      setStatus(prev => [...prev, { type: 'error', message: `Erro: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findClient();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-border shadow-xl">
        <h1 className="text-2xl font-bold text-muted-foreground mb-2">Limpeza de DRE (2025-2026)</h1>
        <p className="text-muted-foreground mb-6">Esta ferramenta irá apagar permanentemente os registros de DRE da empresa Empório referentes aos anos de 2025 e 2026.</p>
        
        {clientId ? (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
            <p className="text-sm font-bold text-blue-700">Empresa Identificada: Empório do Marmore</p>
            <p className="text-[10px] text-blue-600 uppercase tracking-widest mt-1">ID: {clientId}</p>
          </div>
        ) : !loading && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-6">
            <p className="text-sm font-bold text-rose-700">Erro: Empresa não encontrada no banco.</p>
          </div>
        )}

        <button
          onClick={clearData}
          disabled={loading || !clientId}
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-700 disabled:opacity-50 transition-all shadow-lg shadow-rose-900/20"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
          Zerar DRE (2025 e 2026)
        </button>
      </div>

      <div className="space-y-4">
        {status.map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${
            s.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
            s.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-700' :
            'bg-slate-50 border-border text-muted-foreground'
          }`}>
            {s.type === 'success' ? <CheckCircle size={18} /> : 
             s.type === 'error' ? <AlertTriangle size={18} /> : 
             <Loader2 size={18} className={loading ? "animate-spin" : ""} />}
            <p className="text-xs font-bold">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
