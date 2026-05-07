
import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  LayoutGrid,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleData } from '../../hooks/useModuleData';
import { useAllFinancialData } from '../../hooks/useFinancialData';
import { ObjetivoOKR, KR, EixoGestao } from '../../types/modules';
import { cn, formatValue, formatCurrency } from '../../lib/utils';
import { SectionHeader } from '../Common';

const EIXOS: EixoGestao[] = [
  'Gestão Financeira', 'Gestão Comercial', 'Gestão Operacional', 'Gestão de Pessoas', 
  'Gestão Administrativa', 'Governança', 'Cultura', 'Inovação', 'Avaliação de Riscos'
];

interface OKRsPageProps {
  clientId: string;
}

export function OKRsPage({ clientId }: OKRsPageProps) {
  const { data, add, update, remove, loading } = useModuleData<ObjetivoOKR>('okrs', clientId);
  const { dbData: financialEntries } = useAllFinancialData(clientId);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ObjetivoOKR>>({
    titulo: '',
    eixo: 'Gestão Financeira',
    responsavel: '',
    periodo: 'Q1 2026',
    keyResults: []
  });

  // Business Logic: Auto-calculate financial KRs
  const enrichedData = useMemo(() => {
    return data.map(obj => {
      const enrichedKRs = obj.keyResults.map(kr => {
        let actualValue = kr.atual;
        
        // Auto-read logic for financial KRs
        if (kr.kpi.toLowerCase().includes('receita')) {
          actualValue = financialEntries.filter(e => e.type === 'DRE' && e.conta.toLowerCase().includes('bruta')).reduce((acc, curr) => acc + curr.valor, 0);
        } else if (kr.kpi.toLowerCase().includes('ebitda')) {
          actualValue = financialEntries.filter(e => e.conta.toLowerCase() === 'ebitda').reduce((acc, curr) => acc + curr.valor, 0);
        } else if (kr.kpi.toLowerCase().includes('margem')) {
          const receita = financialEntries.filter(e => e.type === 'DRE' && e.conta.toLowerCase().includes('bruta')).reduce((acc, curr) => acc + curr.valor, 0);
          const ebitda = financialEntries.filter(e => e.conta.toLowerCase() === 'ebitda').reduce((acc, curr) => acc + curr.valor, 0);
          actualValue = receita > 0 ? (ebitda / receita) * 100 : 0;
        }

        const progresso = kr.meta > 0 ? Math.min(100, Math.max(0, (actualValue / kr.meta) * 100)) : 0;
        const status = progresso >= 100 ? 'Completed' : progresso >= 40 ? 'In Progress' : progresso > 0 ? 'At Risk' : 'Not Started';

        return { ...kr, atual: actualValue, progresso, status };
      });

      const progressoGeral = enrichedKRs.length > 0 
        ? enrichedKRs.reduce((acc, curr) => acc + curr.progresso, 0) / enrichedKRs.length 
        : 0;

      return { ...obj, keyResults: enrichedKRs, progressoGeral };
    });
  }, [data, financialEntries]);

  const addKR = () => {
    setFormData(prev => ({
      ...prev,
      keyResults: [
        ...(prev.keyResults || []),
        { id: Math.random().toString(36).substr(2, 9), descricao: '', kpi: '', tipo: 'Percentual', meta: 0, atual: 0, status: 'Not Started', progresso: 0 }
      ]
    }));
  };

  const updateKR = (id: string, field: keyof KR, value: any) => {
    setFormData(prev => ({
      ...prev,
      keyResults: prev.keyResults?.map(kr => kr.id === id ? { ...kr, [field]: value } : kr)
    }));
  };

  const removeKR = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keyResults: prev.keyResults?.filter(kr => kr.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await update(editingId, formData);
      setEditingId(null);
    } else {
      await add(formData);
      setShowForm(false);
    }
    setFormData({ titulo: '', eixo: 'Gestão Financeira', responsavel: '', periodo: 'Q1 2026', keyResults: [] });
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
             <Target size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">OKRs e Metas</h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Planejamento Estratégico por Resultados</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if(!showForm) setEditingId(null); }}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-primary/20 transition-all shrink-0"
        >
          {showForm ? 'Cancelar' : <><Plus size={16} /> Novo Objetivo</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Título do Objetivo</label>
                    <input 
                      required
                      value={formData.titulo}
                      onChange={e => setFormData({...formData, titulo: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                      placeholder="Ex: Expandir margem operacional em 15%..."
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Eixo</label>
                    <select 
                      value={formData.eixo}
                      onChange={e => setFormData({...formData, eixo: e.target.value as EixoGestao})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold font-display outline-none"
                    >
                      {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Período</label>
                    <input 
                      value={formData.periodo}
                      onChange={e => setFormData({...formData, periodo: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black font-display text-primary outline-none"
                    />
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Resultados-Chave (Key Results)</h4>
                   <button type="button" onClick={addKR} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline flex items-center gap-1">
                     <Plus size={14} /> Adicionar KR
                   </button>
                 </div>
                 
                 <div className="space-y-3">
                   {formData.keyResults?.map((kr, idx) => (
                     <div key={kr.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <div className="md:col-span-5">
                          <input 
                            value={kr.descricao}
                            onChange={e => updateKR(kr.id, 'descricao', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                            placeholder="Descrição do KR"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <input 
                            value={kr.kpi}
                            onChange={e => updateKR(kr.id, 'kpi', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                            placeholder="KPI Associado"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <select 
                            value={kr.tipo}
                            onChange={e => updateKR(kr.id, 'tipo', e.target.value as any)}
                            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                          >
                            <option value="Percentual">%</option>
                            <option value="Monetário">R$</option>
                            <option value="Unidade">Und</option>
                          </select>
                       </div>
                       <div className="md:col-span-2">
                          <input 
                            type="number"
                            value={kr.meta}
                            onChange={e => updateKR(kr.id, 'meta', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none"
                            placeholder="Meta"
                          />
                       </div>
                       <div className="md:col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeKR(kr.id)} className="text-rose-400 hover:text-rose-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex justify-end pt-4">
                 <button type="submit" className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl transition-all">
                   Salvar Planejamento OKR
                 </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {enrichedData.map((obj, idx) => (
          <motion.div 
            key={obj.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-primary/20 transition-all"
          >
            <div className="p-10 pb-0 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{obj.eixo}</span>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">{obj.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => { setFormData(obj); setEditingId(obj.id!); setShowForm(true); }} className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all">
                       <Edit2 size={18} />
                     </button>
                     <button onClick={() => remove(obj.id!)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                       <Trash2 size={18} />
                     </button>
                  </div>
               </div>

               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                   <span>Progresso Geral</span>
                   <span className="text-primary">{obj.progressoGeral.toFixed(0)}%</span>
                 </div>
                 <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${obj.progressoGeral}%` }}
                    className={cn(
                      "h-full rounded-full shadow-lg",
                      obj.progressoGeral >= 80 ? "bg-emerald-500 shadow-emerald-500/30" : 
                      obj.progressoGeral >= 40 ? "bg-amber-500 shadow-amber-500/30" : 
                      "bg-rose-500 shadow-rose-500/30"
                    )}
                   />
                 </div>
               </div>
            </div>

            <div className="p-10 space-y-4">
               {obj.keyResults.map(kr => (
                 <div key={kr.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 relative overflow-hidden group/kr">
                   <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            {kr.status === 'Completed' ? <CheckCircle2 size={14} className="text-emerald-500" /> : 
                             kr.status === 'At Risk' ? <AlertCircle size={14} className="text-rose-500" /> : 
                             <Clock size={14} className="text-amber-500" />}
                            <span className="text-xs font-black text-slate-700">{kr.descricao}</span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">KPI: {kr.kpi}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-slate-800">
                           {kr.tipo === 'Monetário' ? formatCurrency(kr.atual) : kr.atual}
                           <span className="text-slate-400 text-[10px] mx-1">/</span>
                           {kr.tipo === 'Monetário' ? formatCurrency(kr.meta) : kr.meta}
                         </p>
                         <p className="text-[10px] font-black text-primary">{kr.progresso.toFixed(0)}%</p>
                      </div>
                   </div>
                   <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", kr.status === 'Completed' ? 'bg-emerald-500' : kr.status === 'At Risk' ? 'bg-rose-500' : 'bg-amber-500')}
                        style={{ width: `${kr.progresso}%` }}
                      />
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-auto px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Users size={14} /> {obj.responsavel || 'Sem Responsável'}
               </div>
               <div className="text-[10px] font-black text-slate-900 uppercase bg-white px-3 py-1 rounded-full border border-slate-200">
                  {obj.periodo}
               </div>
            </div>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-32 text-center text-slate-300 font-bold flex flex-col items-center gap-4">
             <Target size={64} strokeWidth={1} />
             <p>Comece definindo seus OKRs para o período.</p>
          </div>
        )}
      </div>
    </div>
  );
}
