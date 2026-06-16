
import React, { useState, useEffect } from 'react';
import { Loader2, Save, CheckCircle2, Trash2, Plus, TrendingUp, TrendingDown, Zap, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { DATA } from '../../data';
import { DashboardSkeleton } from '../ui/skeletons';


function SectionHeader({ icon: Icon, title, subtitle, tone }: any) {
  const tones: any = {
    emerald: "bg-success-soft text-emerald-600 border-emerald-100",
    rose: "bg-critical-soft text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-muted-foreground border-border",
  };
  
  return (
    <div className="flex items-center gap-5">
      <div className={cn("p-4 rounded-2xl border", tones[tone])}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
    <h3 className="text-xl font-display font-extrabold text-executive-secondary tracking-tight leading-none mb-1">{title}</h3>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{subtitle}</p>
      </div>
    </div>
  );
}

export function PremissasClientePage({ clients, selectedClient }: { clients: any[], selectedClient: string }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [assumptions, setAssumptions] = useState<any>({
    receitas: [],
    custos: [],
    crescimento: 0
  });

  useEffect(() => {
    if (!selectedClient) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Assumptions
        const qAssumptions = query(
          collection(db, 'client_assumptions'),
          where('clientId', '==', selectedClient)
        );
        const snapAssumptions = await getDocs(qAssumptions);
        if (!snapAssumptions.empty) {
          const data = snapAssumptions.docs[0].data();
          setAssumptions(data);
        } else {
          setAssumptions({
            receitas: [],
            custos: [],
            crescimento: 0
          });
        }

        // Fetch All Accounts for client to avoid composite index issues with planType
        const qAccounts = query(
          collection(db, 'account_plans'),
          where('clientId', '==', selectedClient),
          orderBy('code', 'asc')
        );
        const snapAccounts = await getDocs(qAccounts);
        const allAccounts = snapAccounts.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

        // Prioritize Managerial Plan
        const managerial = allAccounts.filter(a => a.planType === 'managerial');
        const accounting = allAccounts.filter(a => a.planType === 'accounting');
        
        let accountsData = managerial.length > 0 ? managerial : (accounting.length > 0 ? accounting : allAccounts);
        
        setAccounts(accountsData.length > 0 ? accountsData : DATA.accountPlanPadrão);
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedClient]);

  const handleSave = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      const q = query(
        collection(db, 'client_assumptions'),
        where('clientId', '==', selectedClient)
      );
      const snap = await getDocs(q);
      
      const payload = {
        ...assumptions,
        clientId: selectedClient,
        updatedAt: serverTimestamp()
      };

      if (!snap.empty) {
        await updateDoc(doc(db, 'client_assumptions', snap.docs[0].id), payload);
      } else {
        await addDoc(collection(db, 'client_assumptions'), payload);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'client_assumptions');
    } finally {
      setSaving(false);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState<{ category: 'receitas' | 'custos', index: number } | null>(null);

  const updateEntry = (category: 'receitas' | 'custos', index: number, field: string, value: any) => {
    const newData = [...assumptions[category]];
    newData[index] = { ...newData[index], [field]: value };
    setAssumptions({ ...assumptions, [category]: newData });
  };

  const addEntry = (category: 'receitas' | 'custos') => {
    setAssumptions({
      ...assumptions,
      [category]: [...assumptions[category], { 
        tipo: 'Novo Item', 
        descasamento: 0, 
        accountId: '',
        parcelas: 1,
        intervalo: 30
      }]
    });
  };

  const removeEntry = (category: 'receitas' | 'custos', index: number) => {
    const newData = [...assumptions[category]];
    newData.splice(index, 1);
    setAssumptions({ ...assumptions, [category]: newData });
    setConfirmDelete(null);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-12 pb-20">
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-critical-soft rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} className="text-rose-500" />
            </div>
      <h3 className="text-xl font-black text-executive-secondary mb-2">Confirmar Exclusão</h3>
      <p className="text-sm text-executive-secondary font-medium mb-8">
              Deseja realmente remover esta premissa? Esta ação pode impactar os cálculos de projeção.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="px-4 md:px-6 py-2 md:py-3 bg-slate-100 text-muted-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => removeEntry(confirmDelete.category, confirmDelete.index)}
                className="px-4 md:px-6 py-2 md:py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/25"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
     <h2 className="text-2xl font-display font-black text-executive-secondary tracking-tight">Premissas do Cliente</h2>
     <p className="text-sm font-medium text-executive-secondary mt-1">Configure os descasamentos de prazos e taxas de crescimento para projeções financeiras personalizadas.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50",
            saveSuccess 
              ? "bg-success-soft0 text-white shadow-emerald-500/25" 
              : "bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700"
          )}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Premissas'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Receitas */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <SectionHeader 
              icon={TrendingUp} 
              title="Descasamento de Recebimento" 
              subtitle="Por tipo de receita (Dias de atraso médio)" 
              tone="emerald"
            />
            <button 
              onClick={() => addEntry('receitas')}
              className="flex items-center gap-2 px-4 py-2 bg-success-soft text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95"
            >
              <Plus size={14} />
              Adicionar
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tipo de Receita</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Delay (Dias)</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parcelas</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intervalo</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assumptions.receitas.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 md:px-6 py-2.5 md:py-4">
                      <select 
                        value={item.accountId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const acc = accounts.find(a => (a.id || a.code) === val);
                          const newData = [...assumptions.receitas];
                          newData[idx] = { 
                            ...newData[idx], 
                            accountId: val, 
                            tipo: acc ? acc.name : newData[idx].tipo 
                          };
                          setAssumptions({ ...assumptions, receitas: newData });
                        }}
            className="w-full text-sm font-bold text-executive-secondary bg-slate-50 px-3 py-2 rounded-xl border border-border outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      >
                        <option value="">Selecione uma conta de receita...</option>
                        {accounts.filter(a => a.type?.toLowerCase().includes('receita')).map(acc => (
                          <option key={acc.id || acc.code} value={acc.id || acc.code}>
                            {"\u00A0".repeat(((acc.level || 1) - 1) * 3)}{acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                      {!item.accountId && (
                        <p className="mt-1 text-[9px] text-rose-400 font-bold uppercase px-1">Vínculo obrigatório para automação</p>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="number" 
                          value={item.descasamento}
                          onChange={(e) => updateEntry('receitas', idx, 'descasamento', parseInt(e.target.value) || 0)}
                          className="w-14 text-center text-sm font-black text-emerald-600 bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">d</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <input 
                        type="number" 
                        min="1"
                        value={item.parcelas || 1}
                        onChange={(e) => updateEntry('receitas', idx, 'parcelas', parseInt(e.target.value) || 1)}
            className="w-12 text-center text-sm font-black text-executive-secondary bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <div className={cn("flex items-center justify-center gap-2", (item.parcelas || 1) <= 1 && "opacity-20 pointer-events-none")}>
                        <input 
                          type="number" 
                          min="0"
                          value={item.intervalo || 30}
                          onChange={(e) => updateEntry('receitas', idx, 'intervalo', parseInt(e.target.value) || 0)}
             className="w-14 text-center text-sm font-black text-executive-secondary bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">d</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                      <button 
                        onClick={() => setConfirmDelete({ category: 'receitas', index: idx })}
                        className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={() => addEntry('receitas')}
              className="w-full py-4 bg-slate-50/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2 border-t border-border"
            >
              <Plus size={14} />
              Adicionar Tipo de Receita
            </button>
          </div>

          <div className="flex items-center justify-between">
            <SectionHeader 
              icon={TrendingDown} 
              title="Descasamento de Pagamento" 
              subtitle="Custos e Despesas (Dias de prazo médio)" 
              tone="rose"
            />
            <button 
              onClick={() => addEntry('custos')}
              className="flex items-center gap-2 px-4 py-2 bg-critical-soft text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
            >
              <Plus size={14} />
              Adicionar
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tipo de Custo/Despesa</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Prazo (Dias)</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parcelas</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intervalo</th>
                  <th className="px-4 md:px-6 py-2.5 md:py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assumptions.custos.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 md:px-6 py-2.5 md:py-4">
                      <select 
                        value={item.accountId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const acc = accounts.find(a => (a.id || a.code) === val);
                          const newData = [...assumptions.custos];
                          newData[idx] = { 
                            ...newData[idx], 
                            accountId: val, 
                            tipo: acc ? acc.name : newData[idx].tipo 
                          };
                          setAssumptions({ ...assumptions, custos: newData });
                        }}
            className="w-full text-sm font-bold text-executive-secondary bg-slate-50 px-3 py-2 rounded-xl border border-border outline-none focus:ring-2 focus:ring-rose-500/10 transition-all"
                      >
                        <option value="">Selecione uma conta de custo/despesa...</option>
                        {accounts.filter(a => {
                          const type = a.type?.toLowerCase() || '';
                          return type.includes('despesa') || type.includes('custo');
                        }).map(acc => (
                          <option key={acc.id || acc.code} value={acc.id || acc.code}>
                            {"\u00A0".repeat(((acc.level || 1) - 1) * 3)}{acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                      {!item.accountId && (
                        <p className="mt-1 text-[9px] text-rose-400 font-bold uppercase px-1">Vínculo obrigatório para automação</p>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="number" 
                          value={item.descasamento}
                          onChange={(e) => updateEntry('custos', idx, 'descasamento', parseInt(e.target.value) || 0)}
                          className="w-14 text-center text-sm font-black text-rose-600 bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-rose-500"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">d</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <input 
                        type="number" 
                        min="1"
                        value={item.parcelas || 1}
                        onChange={(e) => updateEntry('custos', idx, 'parcelas', parseInt(e.target.value) || 1)}
            className="w-12 text-center text-sm font-black text-executive-secondary bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-rose-500"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-center">
                      <div className={cn("flex items-center justify-center gap-2", (item.parcelas || 1) <= 1 && "opacity-20 pointer-events-none")}>
                        <input 
                          type="number" 
                          min="0"
                          value={item.intervalo || 30}
                          onChange={(e) => updateEntry('custos', idx, 'intervalo', parseInt(e.target.value) || 0)}
             className="w-14 text-center text-sm font-black text-executive-secondary bg-slate-50 py-1 rounded-lg border border-border outline-none focus:border-rose-500"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">d</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                      <button 
                        onClick={() => setConfirmDelete({ category: 'custos', index: idx })}
                        className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={() => addEntry('custos')}
              className="w-full py-4 bg-slate-50/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2 border-t border-border"
            >
              <Plus size={14} />
              Adicionar Tipo de Despesa
            </button>
          </div>
        </div>

        {/* Growth & Summary */}
        <div className="space-y-8">
          <SectionHeader 
            icon={Zap} 
            title="Crescimento" 
            subtitle="Projeção para o período" 
            tone="blue"
          />

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Taxa de Crescimento Projetada</label>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    value={assumptions.crescimento}
                    onChange={(e) => setAssumptions({ ...assumptions, crescimento: parseFloat(e.target.value) || 0 })}
                    className="w-full text-4xl font-black text-blue-600 bg-slate-50 px-4 md:px-6 py-2.5 md:py-4 rounded-2xl border border-border outline-none focus:border-blue-500 transition-all text-right pr-12"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground font-medium leading-relaxed italic">
              Esta taxa será aplicada sobre a receita operacional bruta nas projeções de modelagem financeira e DRE projetada.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h4 className="text-lg font-black tracking-tight mb-4">Resumo das Premissas</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Canais de Receita</span>
                  <span className="text-sm font-bold">{assumptions.receitas.length} categorias</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs text-white/50">Prazos de Pagamento</span>
                  <span className="text-sm font-bold">{assumptions.custos.length} categorias</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-white/50">Estimativa Anual</span>
                  <span className="text-sm font-black text-blue-400">+{assumptions.crescimento}%</span>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-xs text-white/40 italic">
                <Info size={14} />
                <span>Impacta diretamente o Fluxo de Caixa Projetado.</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-white/5 opacity-20">
              <Calculator size={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
