
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
import { PageHeader, SectionHeader } from '../Common';

const EIXOS: EixoGestao[] = [
  'Governança Corporativa', 'Cultura Organizacional', 'Gestão Administrativa e Financeira', 'Gestão de Inovação', 'Gestão de Marketing', 'Gestão Comercial', 'Gestão Operacional'
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
    eixo: 'Governança Corporativa',
    responsavel: '',
    periodo: 'Q1 2026',
    keyResults: []
  });
  const [trimestre, setTrimestre] = useState('Q1');
  const [ano, setAno] = useState('2026');

  // Business Logic: Auto-calculate financial KRs
  const enrichedData = useMemo(() => {
    if (!data) return [];
    return data.map(obj => {
      const enrichedKRs = (obj.keyResults || []).map(kr => {
        let actualValue = kr.atual;
        
        // Auto-read logic for financial KRs
        if (financialEntries && Array.isArray(financialEntries)) {
          if (kr.kpi.toLowerCase().includes('receita')) {
            actualValue = financialEntries.filter(e => e.type === 'DRE' && e.conta.toLowerCase().includes('bruta')).reduce((acc, curr) => acc + (curr.valor || 0), 0);
          } else if (kr.kpi.toLowerCase().includes('ebitda')) {
            actualValue = financialEntries.filter(e => e.conta.toLowerCase() === 'ebitda').reduce((acc, curr) => acc + (curr.valor || 0), 0);
          } else if (kr.kpi.toLowerCase().includes('margem')) {
            const receita = financialEntries.filter(e => e.type === 'DRE' && e.conta.toLowerCase().includes('bruta')).reduce((acc, curr) => acc + (curr.valor || 0), 0);
            const ebitda = financialEntries.filter(e => e.conta.toLowerCase() === 'ebitda').reduce((acc, curr) => acc + (curr.valor || 0), 0);
            actualValue = receita > 0 ? (ebitda / receita) * 100 : 0;
          }
        }

        const progresso = kr.meta > 0 ? Math.min(100, Math.max(0, (actualValue / kr.meta) * 100)) : 0;
        const status = (progresso >= 100 ? 'Completed' : progresso >= 40 ? 'In Progress' : progresso > 0 ? 'At Risk' : 'Not Started') as 'Completed' | 'In Progress' | 'At Risk' | 'Not Started';

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
    const payload = { ...formData, periodo: `${trimestre} ${ano}` };
    if (editingId) {
      await update(editingId, payload);
      setEditingId(null);
    } else {
      await add(payload);
      setShowForm(false);
    }
    setFormData({ titulo: '', eixo: 'Governança Corporativa', responsavel: '', periodo: 'Q1 2026', keyResults: [] });
    setTrimestre('Q1'); setAno('2026');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8 pb-32">
      <PageHeader 
        title="OKRs e Metas" 
        subtitle="Planejamento estratégico de alto impacto focado em resultados mensuráveis."
        icon={<Target size={24} className="text-secondary" />}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-sm shadow-inner shadow-black/5 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest italic">Monitoramento de Performance Ativo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowForm(!showForm); if(!showForm) setEditingId(null); }}
            className={cn(
              "btn-executive transition-all shadow-xl shadow-primary/20",
              showForm 
                ? "bg-surface-container text-muted-foreground border-border" 
                : "bg-primary text-white"
            )}
          >
            {showForm ? 'CANCELAR' : <><Plus size={16} /> ADICIONAR OBJETIVO</>}
          </button>
        </div>
      </div>


      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-premium p-10 overflow-hidden mb-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="md:col-span-2 space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Título do Objetivo</label>
                    <input 
                      required
                      value={formData.titulo}
                      onChange={e => setFormData({...formData, titulo: e.target.value})}
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-surface-container border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary/20 text-[11px] font-medium text-foreground uppercase tracking-widest italic shadow-inner"
                      placeholder="Ex: Expandir margem operacional em 15%..."
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Eixo</label>
                    <select 
                      value={formData.eixo}
                      onChange={e => setFormData({...formData, eixo: e.target.value as EixoGestao})}
                      className="w-full px-4 py-4 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-[0.2em] outline-none shadow-inner"
                    >
                      {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest block px-1 italic">Período</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={trimestre} onChange={e => setTrimestre(e.target.value)}
                        className="w-full px-4 py-4 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest text-primary outline-none shadow-inner">
                        {['Q1','Q2','Q3','Q4'].map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <select value={ano} onChange={e => setAno(e.target.value)}
                        className="w-full px-4 py-4 bg-surface-container border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest text-primary outline-none shadow-inner">
                        {['2024','2025','2026','2027','2028'].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                   <h4 className="text-[10px] font-medium text-primary uppercase tracking-[0.2em]">Resultados-Chave (Key Results)</h4>
                   <button type="button" onClick={addKR} className="text-[10px] font-medium uppercase tracking-widest text-secondary hover:text-secondary/80 flex items-center gap-2 italic">
                     <Plus size={14} /> Adicionar KR
                   </button>
                 </div>
                 
                 <div className="space-y-3">
                   {formData.keyResults?.map((kr, idx) => (
                     <div key={kr.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container/50 p-4 rounded-sm border border-border shadow-inner">
                       <div className="md:col-span-5">
                          <input 
                            value={kr.descricao}
                            onChange={e => updateKR(kr.id, 'descricao', e.target.value)}
                            className="w-full px-4 py-2 bg-card border border-border rounded-sm text-[11px] font-medium outline-none focus:ring-1 focus:ring-secondary/20 shadow-sm italic"
                            placeholder="Descrição do KR"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <input 
                            value={kr.kpi}
                            onChange={e => updateKR(kr.id, 'kpi', e.target.value)}
                            className="w-full px-4 py-2 bg-card border border-border rounded-sm text-[9px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 shadow-sm"
                            placeholder="KPI Associado"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <select 
                            value={kr.tipo}
                            onChange={e => updateKR(kr.id, 'tipo', e.target.value as any)}
                            className="w-full px-2 py-2 bg-card border border-border rounded-sm text-[10px] font-medium uppercase tracking-widest outline-none shadow-sm"
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
                            className="w-full px-4 py-2 bg-card border border-border rounded-sm text-[11px] font-medium uppercase tracking-widest outline-none focus:ring-1 focus:ring-secondary/20 shadow-sm tabular-nums tracking-tighter"
                            placeholder="Meta"
                          />
                       </div>
                       <div className="md:col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeKR(kr.id)} className="text-destructive/40 hover:text-destructive transition-colors">
                            <Trash2 size={16} />
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex justify-end pt-6 border-t border-border/50">
                 <button type="submit" className="btn-executive bg-primary shadow-xl shadow-primary/20">
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
            className="card-premium overflow-hidden flex flex-col group relative"
          >
            <div className="p-10 pb-0 space-y-6 relative z-10">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest italic">{obj.eixo}</span>
                    <h3 className="text-[14px] font-medium text-foreground leading-tight uppercase tracking-widest">{obj.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => { setFormData(obj); setEditingId(obj.id!); setShowForm(true); }} className="p-2 text-muted-foreground/40 hover:text-secondary hover:bg-surface-container rounded-sm transition-all">
                       <Edit2 size={16} />
                     </button>
                     <button onClick={() => remove(obj.id!)} className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-sm transition-all">
                       <Trash2 size={16} />
                     </button>
                  </div>
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-medium uppercase tracking-widest text-muted-foreground italic mb-2">
                   <span>Progresso Geral</span>
                   <span className="text-secondary font-medium tabular-nums">{obj.progressoGeral.toFixed(0)}%</span>
                 </div>
                 <div className="h-3 bg-surface-container rounded-sm overflow-hidden p-0.5 border border-border shadow-inner">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${obj.progressoGeral}%` }}
                    className={cn(
                      "h-full rounded-sm shadow-premium",
                      obj.progressoGeral >= 80 ? "bg-success" : 
                      obj.progressoGeral >= 40 ? "bg-warning" : 
                      "bg-destructive"
                    )}
                   />
                 </div>
               </div>
            </div>

            <div className="p-10 space-y-4 relative z-10">
               {obj.keyResults.map(kr => (
                 <div key={kr.id} className="bg-surface-container/30 p-5 rounded-sm border border-border space-y-4 relative overflow-hidden group/kr shadow-inner">
                   <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            {kr.status === 'Completed' ? <CheckCircle2 size={14} className="text-success" /> : 
                             kr.status === 'At Risk' ? <AlertCircle size={14} className="text-destructive" /> : 
                             <Clock size={14} className="text-warning" />}
                            <span className="text-[11px] font-medium text-foreground uppercase tracking-widest line-clamp-1 italic">{kr.descricao}</span>
                         </div>
                         <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-tight italic opacity-60">KPI: {kr.kpi}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] font-medium text-foreground uppercase tracking-tighter tabular-nums">
                           {kr.tipo === 'Monetário' ? formatCurrency(kr.atual) : kr.atual}
                           <span className="text-muted-foreground/40 text-[9px] mx-1">/</span>
                           {kr.tipo === 'Monetário' ? formatCurrency(kr.meta) : kr.meta}
                         </p>
                         <p className="text-[10px] font-medium text-secondary tabular-nums italic">{kr.progresso.toFixed(0)}%</p>
                      </div>
                   </div>
                   <div className="h-1 bg-surface-container rounded-sm overflow-hidden border border-border/50">
                      <div 
                        className={cn("h-full transition-all duration-1000 shadow-premium", kr.status === 'Completed' ? 'bg-success' : kr.status === 'At Risk' ? 'bg-destructive' : 'bg-warning')}
                        style={{ width: `${kr.progresso}%` }}
                      />
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-auto px-10 py-6 bg-surface-container/30 border-t border-border flex justify-between items-center relative z-10 shadow-inner">
               <div className="flex items-center gap-2 text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">
                  <Users size={14} /> {obj.responsavel || 'Sem Responsável'}
               </div>
               <div className="text-[9px] font-medium text-foreground uppercase tracking-widest bg-card px-4 py-1.5 rounded-sm border border-border shadow-sm italic">
                  {obj.periodo}
               </div>
            </div>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full py-48 card-premium text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-surface-container/10 shadow-inner" />
             <div className="p-8 bg-card rounded-sm shadow-premium border border-border relative z-10">
                <Target size={48} strokeWidth={1} className="text-muted-foreground/20" />
             </div>
             <div className="relative z-10 space-y-2">
                <h3 className="text-xl font-medium text-foreground uppercase tracking-widest">Nenhum Objetivo Definido</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] italic max-w-2xl">Comece definindo seus OKRs para o período para habilitar o monitoramento de performance.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
