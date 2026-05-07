
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldAlert,
  BarChart,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleData } from '../../hooks/useModuleData';
import { DiagnosticoItem, EixoGestao, ClassificacaoSWOT, TipoRisco, Gravidade, Urgencia, Tendencia, ImpactoFinanceiro } from '../../types/modules';
import { cn } from '../../lib/utils';
import { SectionHeader } from '../Common';

const EIXOS: EixoGestao[] = [
  'Gestão Financeira', 'Gestão Comercial', 'Gestão Operacional', 'Gestão de Pessoas', 
  'Gestão Administrativa', 'Governança', 'Cultura', 'Inovação', 'Avaliação de Riscos'
];

interface DiagnosticoPageProps {
  clientId: string;
}

export function DiagnosticoPage({ clientId }: DiagnosticoPageProps) {
  const { data, add, update, remove, loading } = useModuleData<DiagnosticoItem>('diagnostico', clientId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<DiagnosticoItem>>({
    descricao: '',
    eixo: 'Gestão Financeira',
    swot: 'Fraqueza',
    tipoRisco: 'Operacional',
    gravidade: 3,
    urgencia: 3,
    tendencia: 3,
    impactoFinanceiro: 3,
    efeitoFinanceiro: 'EBITDA',
    custoInvestimento: 'Médio',
    retornoInvestimento: 'Médio'
  });

  const calculateFIV = (g: number, u: number, t: number, i: number) => {
    return g * u * t * i;
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.fivScore - a.fivScore);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fiv = calculateFIV(formData.gravidade!, formData.urgencia!, formData.tendencia!, formData.impactoFinanceiro!);
    const payload = { ...formData, fivScore: fiv };

    if (editingId) {
      await update(editingId, payload);
      setEditingId(null);
    } else {
      await add(payload);
      setShowAddForm(false);
    }
    
    // Reset form
    setFormData({
      descricao: '',
      eixo: 'Gestão Financeira',
      swot: 'Fraqueza',
      tipoRisco: 'Operacional',
      gravidade: 3,
      urgencia: 3,
      tendencia: 3,
      impactoFinanceiro: 3,
      efeitoFinanceiro: 'EBITDA',
      custoInvestimento: 'Médio',
      retornoInvestimento: 'Médio'
    });
  };

  const startEdit = (item: DiagnosticoItem) => {
    setFormData(item);
    setEditingId(item.id!);
    setShowAddForm(true);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Diagnóstico Empresarial</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Matriz GUT + FIV Score</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) setEditingId(null);
          }}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-primary/20 transition-all"
        >
          {showAddForm ? 'Cancelar' : <><Plus size={16} /> Novo Diagnóstico</>}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Descrição do Problema/Oportunidade</label>
                      <input 
                        required
                        value={formData.descricao}
                        onChange={e => setFormData({...formData, descricao: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                        placeholder="Ex: Alta rotatividade no setor operacional"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Eixo de Gestão</label>
                        <select 
                          value={formData.eixo}
                          onChange={e => setFormData({...formData, eixo: e.target.value as EixoGestao})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                        >
                          {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Classificação SWOT</label>
                        <select 
                          value={formData.swot}
                          onChange={e => setFormData({...formData, swot: e.target.value as ClassificacaoSWOT})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                        >
                          <option value="Força">Força</option>
                          <option value="Fraqueza">Fraqueza</option>
                          <option value="Oportunidade">Oportunidade</option>
                          <option value="Ameaça">Ameaça</option>
                        </select>
                      </div>
                    </div>
                 </div>

                 <div className="space-y-6 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Parâmetros de Pontuação (1-5)</h4>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'Gravidade', field: 'gravidade' },
                        { label: 'Urgência', field: 'urgencia' },
                        { label: 'Tendência', field: 'tendencia' },
                        { label: 'Impacto Fin.', field: 'impactoFinanceiro' },
                      ].map(p => (
                        <div key={p.field}>
                          <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">{p.label}</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setFormData({...formData, [p.field]: v})}
                                className={cn(
                                  "w-full h-10 rounded-lg text-xs font-black transition-all",
                                  (formData as any)[p.field] === v ? "bg-primary text-white" : "bg-white text-slate-400 border border-slate-200 hover:border-primary/50"
                                )}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Efeito Financeiro</label>
                  <select 
                    value={formData.efeitoFinanceiro}
                    onChange={e => setFormData({...formData, efeitoFinanceiro: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="Receita">Receita</option>
                    <option value="EBITDA">EBITDA</option>
                    <option value="Receita + EBITDA">Receita + EBITDA</option>
                    <option value="Caixa">Caixa</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Custo Invest.</label>
                  <select 
                    value={formData.custoInvestimento}
                    onChange={e => setFormData({...formData, custoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="Baixo">Baixo</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Retorno Invest.</label>
                  <select 
                    value={formData.retornoInvestimento}
                    onChange={e => setFormData({...formData, retornoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="Alto em 90 dias">Alto em 90 dias</option>
                    <option value="Alto em 180 dias">Alto em 180 dias</option>
                    <option value="Alto em 12 meses">Alto em 12 meses</option>
                    <option value="Médio">Médio</option>
                    <option value="Baixo">Baixo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="submit"
                  className="px-12 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {editingId ? 'Salvar Alterações' : 'Confirmar Diagnóstico'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIV Ranking List */}
      <div className="space-y-4">
        {sortedData.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={item.id}
            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex items-center gap-8"
          >
            <div className="flex flex-col items-center justify-center bg-slate-50 w-24 h-24 rounded-2xl border border-slate-100 shrink-0">
               <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Score FIV</span>
               <span className={cn(
                 "text-3xl font-black font-display",
                 item.fivScore >= 400 ? "text-rose-600" : item.fivScore >= 200 ? "text-amber-500" : "text-emerald-500"
               )}>
                 {item.fivScore}
               </span>
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                  item.swot === 'Fraqueza' || item.swot === 'Ameaça' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {item.swot}
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded">
                  {item.eixo}
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-800 truncate pr-4">{item.descricao}</h4>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-secondary" /> {item.tipoRisco}</div>
                <div className="flex items-center gap-1.5"><Activity size={14} className="text-primary" /> {item.efeitoFinanceiro}</div>
                <div className="flex items-center gap-1.5"><TrendingUp size={14} className="text-amber-500" /> ROI: {item.retornoInvestimento}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => startEdit(item)} className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                 <Edit2 size={18} />
               </button>
               <button onClick={() => remove(item.id!)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                 <Trash2 size={18} />
               </button>
            </div>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-4 text-slate-300">
            <AlertTriangle size={64} strokeWidth={1} />
            <p className="font-bold">Nenhum item de diagnóstico registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
