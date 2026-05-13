import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Save, Loader2, AlertCircle, Database } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface ManualFinancialModalProps {
  type: 'Balanço Patrimonial' | 'DRE' | 'BP' | 'DFC' | 'DLPA';
  clientId: string;
  year: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface Row {
  id: string;
  category: string;
  value: number;
  type: 'ativo' | 'passivo' | 'patrimônio líquido' | 'pl' | 'receitas' | 'despesas';
}

export function ManualFinancialModal({ type, clientId, year, onClose, onSuccess }: ManualFinancialModalProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load existing data if any
    const loadData = async () => {
      if (!clientId) return;
      setLoading(true);
      try {
        const t = type === 'BP' ? 'Balanço Patrimonial' : type;
        const q = query(
          collection(db, 'financial_entries'),
          where('clientId', '==', clientId),
          where('type', '==', t),
          where('year', '==', year)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          const existingData = (docData.data || []).map((item: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            category: item.category || item.conta || '',
            value: item.value || item.valor || item.val || 0,
            type: (item.type || item.tipo || (type === 'DRE' ? 'receitas' : 'ativo')).toLowerCase()
          }));
          setRows(existingData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [clientId, year, type]);

  const addRow = () => {
    setRows([...rows, { 
      id: Math.random().toString(36).substr(2, 9), 
      category: '', 
      value: 0, 
      type: type === 'DRE' ? 'receitas' : 'ativo' 
    }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof Row, val: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleSave = async () => {
    if (!auth.currentUser || !clientId) return;
    setSaving(true);
    try {
      const t = type === 'BP' ? 'Balanço Patrimonial' : type;
      
      // 1. Delete existing
      const q = query(
        collection(db, 'financial_entries'),
        where('clientId', '==', clientId),
        where('type', '==', t),
        where('year', '==', year)
      );
      const snap = await getDocs(q);
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'financial_entries', d.id))));

      // 2. Add new
      const dataToSave = rows.map(r => ({
        category: r.category,
        value: Number(r.value),
        type: r.type
      }));

      await addDoc(collection(db, 'financial_entries'), {
        clientId,
        type: t,
        year,
        data: dataToSave,
        periodType: 'anual',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        isManual: true
      });

      onSuccess();
    } catch (err) {
      console.error('Error saving data:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900">Inserção Manual - {type}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-bold">
              Ano {year}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm font-bold text-slate-400">Carregando dados existentes...</p>
             </div>
          ) : (
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase">Conta / Categoria</th>
                    <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase w-40">Tipo</th>
                    <th className="text-right py-3 px-4 text-[10px] font-bold text-slate-400 uppercase w-40">Valor (R$)</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="py-2 px-2">
                        <input 
                          type="text" 
                          value={row.category} 
                          onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                          placeholder="Ex: Caixa e Equivalentes"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={row.type}
                          onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                          {type === 'DRE' ? (
                            <>
                              <option value="receitas">Receitas</option>
                              <option value="despesas">Despesas</option>
                            </>
                          ) : (
                            <>
                              <option value="ativo">Ativo</option>
                              <option value="passivo">Passivo</option>
                              <option value="patrimônio líquido">Patrimônio Líquido</option>
                            </>
                          )}
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number" 
                          value={row.value} 
                          onChange={(e) => updateRow(row.id, 'value', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm text-right font-mono focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button onClick={() => removeRow(row.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {rows.length === 0 && (
                <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-400">Nenhuma conta inserida ainda.</p>
                </div>
              )}

              <button 
                onClick={addRow}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Plus size={18} /> Adicionar Linha
              </button>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-2xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || rows.length === 0}
            className="flex-1 py-3.5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
            {saving ? 'Salvando...' : 'Salvar Dados'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
