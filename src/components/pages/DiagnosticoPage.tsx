
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, Plus, Trash2, Edit2,
  TrendingUp, Activity, ShieldAlert, Target,
  Link2, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleData } from '../../hooks/useModuleData';
import { DiagnosticoItem, ObjetivoOKR, EixoGestao, ClassificacaoSWOT, TipoRisco, Gravidade, Urgencia, Tendencia, ImpactoFinanceiro } from '../../types/modules';
import { cn } from '../../lib/utils';
import { SectionHeader, PageHeader } from '../Common';
import { SACERDOTAL_PRINCIPLES } from '../../lib/sacerdotalIntelligence';

import { SacerdotalInsightPanel } from '../SacerdotalInsightPanel';

const EIXOS: EixoGestao[] = [
  'Governança', 'Cultura', 'Gestão', 'Inovação', 'Marketing', 'Comercial', 'Operação'
];

interface DiagnosticoPageProps {
  clientId: string;
}

export function DiagnosticoPage({ clientId }: DiagnosticoPageProps) {
  const { data, add, update, remove, loading } = useModuleData<DiagnosticoItem>('diagnostico', clientId);
  const { data: okrsData, add: addOkr, update: updateOkr } = useModuleData<ObjetivoOKR>('okrs', clientId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // OKR link modal
  const [linkingItem, setLinkingItem] = useState<DiagnosticoItem | null>(null);
  const [linkTab, setLinkTab] = useState<'vincular' | 'criar'>('vincular');
  const [linkSaving, setLinkSaving] = useState(false);
  const [newOkrTrimestre, setNewOkrTrimestre] = useState('Q1');
  const [newOkrAno, setNewOkrAno] = useState('2026');
  const [newOkrForm, setNewOkrForm] = useState({ titulo: '', eixo: 'Governança' as EixoGestao, responsavel: '' });
  const [newKrForm, setNewKrForm] = useState({ descricao: '', kpi: '', tipo: 'Percentual' as 'Percentual' | 'Monetário' | 'Unidade', meta: 0 });
  
  const [formData, setFormData] = useState<Partial<DiagnosticoItem>>({
    descricao: '',
    eixo: 'Governança',
    swot: 'Fraqueza',
    tipoRisco: 'Operacional',
    gravidade: 3,
    urgencia: 3,
    tendencia: 3,
    impactoFinanceiro: 3,
    efeitoFinanceiro: 'Faturamento',
    custoInvestimento: 'Médio',
    retornoInvestimento: 'Médio Prazo (90-180 dias)'
  });

  const calculateIVE = (g: number, u: number, t: number, i: number) => {
    return g * u * t * i;
  };

  const SWOT_MULTIPLIERS: Record<string, { label: string; value: number; color: string }> = {
    'Oportunidade': { label: '×1.3', value: 1.3, color: 'text-emerald-600' },
    'Força':        { label: '×1.1', value: 1.1, color: 'text-sky-500' },
    'Fraqueza':     { label: '×1.0', value: 1.0, color: 'text-slate-400' },
    'Ameaça':       { label: '×0.8', value: 0.8, color: 'text-rose-500' },
  };

  const EFEITO_MULTIPLIERS: Record<string, { value: number; color: string }> = {
    'EBITDA':          { value: 1.4, color: 'text-emerald-600' },
    'Faturamento':     { value: 1.3, color: 'text-sky-600' },
    'Capital de Giro': { value: 1.2, color: 'text-amber-500' },
    'Endividamento':   { value: 0.7, color: 'text-rose-500' },
  };

  const CUSTO_MULTIPLIERS: Record<string, { value: number }> = {
    'Baixo': { value: 1.4 },
    'Médio': { value: 1.0 },
    'Alto':  { value: 0.7 },
  };

  const ROI_MULTIPLIERS: Record<string, { value: number; color: string }> = {
    'Imediato (< 30 dias)':       { value: 1.5, color: 'text-emerald-600' },
    'Curto Prazo (30-90 dias)':   { value: 1.3, color: 'text-emerald-500' },
    'Médio Prazo (90-180 dias)':  { value: 1.1, color: 'text-amber-500' },
    'Longo Prazo (6-12 meses)':   { value: 0.9, color: 'text-orange-500' },
    'Incerto (> 12 meses)':       { value: 0.7, color: 'text-rose-500' },
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.iveScore - a.iveScore);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const baseScore  = calculateIVE(formData.gravidade!, formData.urgencia!, formData.tendencia!, formData.impactoFinanceiro!);
      const swotMult   = SWOT_MULTIPLIERS[formData.swot!]?.value    ?? 1;
      const efeitoMult = EFEITO_MULTIPLIERS[formData.efeitoFinanceiro!]?.value ?? 1;
      const custoMult  = CUSTO_MULTIPLIERS[formData.custoInvestimento!]?.value ?? 1;
      const roiMult    = ROI_MULTIPLIERS[formData.retornoInvestimento!]?.value   ?? 1;
      const ive = Math.round(baseScore * swotMult * efeitoMult * custoMult * roiMult);
      const payload = { ...formData, iveScore: ive };

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
        eixo: 'Governança',
        swot: 'Fraqueza',
        tipoRisco: 'Operacional',
        gravidade: 3,
        urgencia: 3,
        tendencia: 3,
        impactoFinanceiro: 3,
        efeitoFinanceiro: 'Faturamento',
        custoInvestimento: 'Médio',
        retornoInvestimento: 'Médio Prazo (90-180 dias)'
      });
    } catch (err: any) {
      setSaveError(err.message ?? 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: DiagnosticoItem) => {
    setFormData(item);
    setEditingId(item.id!);
    setShowAddForm(true);
  };

  const openLinkModal = (item: DiagnosticoItem) => {
    setLinkingItem(item);
    setLinkTab('vincular');
    setNewOkrForm({ titulo: '', eixo: item.eixo, responsavel: '' });
    setNewOkrTrimestre('Q1');
    setNewOkrAno('2026');
    // Pre-fill KR based on efeitoFinanceiro
    const kpiSugestao = item.efeitoFinanceiro === 'EBITDA' ? 'EBITDA (R$)'
      : item.efeitoFinanceiro === 'Faturamento' ? 'Faturamento Bruto (R$)'
      : item.efeitoFinanceiro === 'Capital de Giro' ? 'Capital de Giro Líquido (R$)'
      : 'Nível de Endividamento (%)';
    setNewKrForm({ descricao: `Melhorar ${item.efeitoFinanceiro}`, kpi: kpiSugestao, tipo: item.efeitoFinanceiro === 'Endividamento' ? 'Percentual' : 'Monetário', meta: 0 });
  };

  const handleToggleOkrLink = async (diagnostico: DiagnosticoItem, okrId: string) => {
    const current = diagnostico.okrVinculado ?? [];
    const isLinked = current.includes(okrId);
    const newLinks = isLinked ? current.filter(id => id !== okrId) : [...current, okrId];

    // Partial update: only change okrVinculado
    await update(diagnostico.id!, { okrVinculado: newLinks });

    const okr = okrsData.find(o => o.id === okrId);
    if (okr) {
      const okrLinks = okr.vinculoDiagnostico ?? [];
      const newOkrLinks = isLinked
        ? okrLinks.filter(id => id !== diagnostico.id)
        : [...okrLinks, diagnostico.id!];
      // Partial update: only change vinculoDiagnostico
      await updateOkr(okrId, { vinculoDiagnostico: newOkrLinks });
    }
    setLinkingItem(prev => prev ? { ...prev, okrVinculado: newLinks } : null);
  };

  const handleCreateOkrFromDiagnostico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingItem) return;
    setLinkSaving(true);
    const periodo = `${newOkrTrimestre} ${newOkrAno}`;
    // Build KR if filled in
    const keyResults = newKrForm.descricao && newKrForm.kpi ? [{
      id: Math.random().toString(36).substr(2, 9),
      descricao: newKrForm.descricao,
      kpi: newKrForm.kpi,
      tipo: newKrForm.tipo,
      meta: newKrForm.meta,
      atual: 0,
      status: 'Not Started' as const,
      progresso: 0,
    }] : [];
    try {
      const newOkrId = await addOkr({
        titulo: newOkrForm.titulo,
        eixo: newOkrForm.eixo,
        responsavel: newOkrForm.responsavel,
        periodo,
        progressoGeral: 0,
        keyResults,
        vinculoDiagnostico: [linkingItem.id!],
      });
      const newLinks = [...(linkingItem.okrVinculado ?? []), newOkrId];
      await update(linkingItem.id!, { okrVinculado: newLinks });
      setLinkingItem(prev => prev ? { ...prev, okrVinculado: newLinks } : null);
      setLinkTab('vincular');
      setNewOkrForm({ titulo: '', eixo: linkingItem.eixo, responsavel: '' });
      setNewKrForm({ descricao: '', kpi: '', tipo: 'Percentual', meta: 0 });
    } finally {
      setLinkSaving(false);
    }
  };


  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-10 pb-32 animate-executive-fade">
      <div className="bg-slate-900 rounded-[40px] p-10 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <PageHeader 
            title="Diagnóstico Estratégico" 
            subtitle="Priorização inteligente baseada na Matriz GUT + IVE (Índice de Valor Estratégico)"
            icon={<ShieldAlert className="text-primary" size={24} />}
            color="primary"
          />
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) setEditingId(null);
            }}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            {showAddForm ? 'CANCELAR' : <><Plus size={16} /> NOVO ITEM</>}
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-[32px] p-6 border border-primary/10">
        <h3 className="text-sm font-black text-primary mb-2 flex items-center gap-2">
          <Target size={16} /> O que é o IVE e qual sua importância?
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          O <strong className="text-slate-800 font-black">Índice de Valor Estratégico (IVE)</strong> é uma métrica avançada criada para medir o verdadeiro impacto de uma ação no negócio. Ao invés de focar apenas em mitigar riscos, o IVE prioriza <strong>Geração de Valor</strong>, cruzando a urgência do problema com o potencial de <strong className="text-emerald-600">Retorno sobre Investimento (ROI)</strong>, <strong className="text-indigo-600">Efeito Financeiro</strong> e <strong className="text-amber-600">Custo</strong>.
          Itens com maior IVE são as prioridades absolutas: requerem menor esforço financeiro e entregam o maior resultado no caixa ou EBITDA da empresa.
        </p>
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
                {/* Efeito Financeiro */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                    Efeito Financeiro
                  </label>
                  <select 
                    value={formData.efeitoFinanceiro}
                    onChange={e => setFormData({...formData, efeitoFinanceiro: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="EBITDA">EBITDA ×1.4 ⬆️</option>
                    <option value="Faturamento">Faturamento ×1.3</option>
                    <option value="Capital de Giro">Capital de Giro ×1.2</option>
                    <option value="Endividamento">Endividamento ×0.7 ⬇️</option>
                  </select>
                </div>

                {/* Custo de Investimento */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                    Custo Invest.
                  </label>
                  <select 
                    value={formData.custoInvestimento}
                    onChange={e => setFormData({...formData, custoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="Baixo">Baixo ×1.4 ⬆️</option>
                    <option value="Médio">Médio ×1.0</option>
                    <option value="Alto">Alto ×0.7 ⬇️</option>
                  </select>
                </div>

                {/* Retorno de Investimento */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">
                    Retorno Invest.
                  </label>
                  <select 
                    value={formData.retornoInvestimento}
                    onChange={e => setFormData({...formData, retornoInvestimento: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                  >
                    <option value="Imediato (< 30 dias)">Imediato (&lt; 30 dias) ×1.5</option>
                    <option value="Curto Prazo (30-90 dias)">Curto Prazo (30–90 dias) ×1.3</option>
                    <option value="Médio Prazo (90-180 dias)">Médio Prazo (90–180 dias) ×1.1</option>
                    <option value="Longo Prazo (6-12 meses)">Longo Prazo (6–12 meses) ×0.9</option>
                    <option value="Incerto (> 12 meses)">Incerto (&gt; 12 meses) ×0.7</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {saveError && (
                  <div className="px-6 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-600">
                    ⚠️ {saveError}
                  </div>
                )}
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="px-12 py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Confirmar Diagnóstico'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IVE Ranking List */}
      <div className="space-y-4">
        {sortedData.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={item.id}
            className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex items-center gap-8"
          >
            <div className="flex flex-col items-center justify-center bg-slate-50 w-28 h-28 rounded-2xl border border-slate-100 shrink-0 gap-0.5">
               <span className="text-[10px] font-black text-slate-400 uppercase">Score IVE</span>
               <span className={cn(
                 "text-3xl font-black font-display",
                 item.iveScore >= 400 ? "text-rose-600" : item.iveScore >= 200 ? "text-amber-500" : "text-emerald-500"
               )}>
                 {item.iveScore}
               </span>
               {SWOT_MULTIPLIERS[item.swot] && (
                 <span className={cn("text-[10px] font-black", SWOT_MULTIPLIERS[item.swot].color)}>
                   {SWOT_MULTIPLIERS[item.swot].label} SWOT
                 </span>
               )}
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
                <div className={cn("flex items-center gap-1.5 font-black", EFEITO_MULTIPLIERS[item.efeitoFinanceiro]?.color ?? 'text-slate-400')}>
                  <Activity size={14} /> {item.efeitoFinanceiro}
                </div>
                <div className={cn("flex items-center gap-1.5 font-black", ROI_MULTIPLIERS[item.retornoInvestimento]?.color ?? 'text-slate-400')}>
                  <TrendingUp size={14} /> {item.retornoInvestimento}
                </div>
                <div className="flex items-center gap-1.5">
                  Custo: <span className="text-slate-600 font-black">{item.custoInvestimento}</span>
                </div>
              </div>

              {/* OKR badges */}
              {(item.okrVinculado ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(item.okrVinculado ?? []).map(okrId => {
                    const okr = okrsData.find(o => o.id === okrId);
                    return okr ? (
                      <span key={okrId} className="flex items-center gap-1 text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Target size={9} /> {okr.titulo.substring(0, 30)}{okr.titulo.length > 30 ? '...' : ''}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Sacerdotal Badge */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <SacerdotalInsightPanel 
                  principleId={SACERDOTAL_PRINCIPLES.find(p => p.axis === item.eixo)?.id || 'gov_1'} 
                  compact 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => openLinkModal(item)} className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Vincular OKR">
                 <Link2 size={18} />
               </button>
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

      {/* OKR Link Modal */}
      <AnimatePresence>
        {linkingItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setLinkingItem(null); }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Conexão Estratégica</p>
                  <h3 className="text-xl font-black text-slate-800 mt-1">Vincular IVE a OKR</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs truncate">{linkingItem.descricao}</p>
                </div>
                <button onClick={() => setLinkingItem(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"><X size={20} /></button>
              </div>

              <div className="flex border-b border-slate-100 px-8 shrink-0">
                {(['vincular', 'criar'] as const).map(tab => (
                  <button key={tab} onClick={() => setLinkTab(tab)}
                    className={cn('py-4 px-1 mr-6 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all',
                      linkTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400')}
                  >
                    {tab === 'vincular' ? 'Vincular Existente' : '+ Criar Objetivo (OKR)'}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {linkTab === 'vincular' ? (
                  okrsData.length === 0 ? (
                    <div className="text-center py-12 text-slate-300 flex flex-col items-center gap-3">
                      <Target size={40} strokeWidth={1} />
                      <p className="font-bold text-sm">Nenhum OKR cadastrado ainda.</p>
                      <p className="text-[10px] text-slate-400">OKR é opcional — vincule quando fizer sentido estratégico.</p>
                      <button onClick={() => setLinkTab('criar')} className="text-primary font-black text-xs underline">Criar agora</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 font-bold">OKR é opcional. Vincule somente quando fizer sentido estratégico para este diagnóstico.</p>
                      {okrsData.map(okr => {
                        const isLinked = (linkingItem.okrVinculado ?? []).includes(okr.id!);
                        return (
                          <div key={okr.id} className={cn('rounded-2xl border-2 transition-all overflow-hidden',
                            isLinked ? 'border-primary' : 'border-slate-100')}>
                            <button onClick={() => handleToggleOkrLink(linkingItem, okr.id!)}
                              className={cn('w-full text-left p-4 transition-all',
                                isLinked ? 'bg-primary/5' : 'bg-slate-50 hover:bg-slate-100')}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{okr.eixo} • {okr.periodo}</p>
                                  <p className="font-black text-slate-800 text-sm leading-tight">{okr.titulo}</p>
                                </div>
                                <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5',
                                  isLinked ? 'bg-primary border-primary' : 'border-slate-300')}>
                                  {isLinked && <Check size={12} className="text-white" />}
                                </div>
                              </div>
                            </button>
                            {/* KRs do OKR */}
                            {okr.keyResults.length > 0 && (
                              <div className="px-4 pb-3 space-y-1 border-t border-slate-100">
                                {okr.keyResults.map(kr => (
                                  <div key={kr.id} className="flex items-center gap-2 pt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                    <span className="text-[10px] font-bold text-slate-600 flex-1 truncate">{kr.descricao}</span>
                                    <span className="text-[9px] font-black text-slate-400">{kr.kpi}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <form onSubmit={handleCreateOkrFromDiagnostico} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Título do Objetivo</label>
                      <input required value={newOkrForm.titulo} onChange={e => setNewOkrForm({...newOkrForm, titulo: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Ex: Aumentar EBITDA em 20% no Q2"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Eixo</label>
                        <select value={newOkrForm.eixo} onChange={e => setNewOkrForm({...newOkrForm, eixo: e.target.value as EixoGestao})}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                          {EIXOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Trimestre</label>
                        <select value={newOkrTrimestre} onChange={e => setNewOkrTrimestre(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                          {['Q1','Q2','Q3','Q4'].map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ano</label>
                        <select value={newOkrAno} onChange={e => setNewOkrAno(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none">
                          {['2024','2025','2026','2027','2028'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Responsável</label>
                      <input value={newOkrForm.responsavel} onChange={e => setNewOkrForm({...newOkrForm, responsavel: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none"
                        placeholder="Nome do responsável" />
                    </div>

                    {/* KR pré-preenchido */}
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Key Result (opcional)</p>
                      <div className="space-y-3 bg-slate-50 rounded-2xl p-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 block">Descrição do KR</label>
                          <input value={newKrForm.descricao} onChange={e => setNewKrForm({...newKrForm, descricao: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none"
                            placeholder="Ex: Aumentar EBITDA mensal" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 block">KPI</label>
                            <input value={newKrForm.kpi} onChange={e => setNewKrForm({...newKrForm, kpi: e.target.value})}
                              className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none"
                              placeholder="EBITDA (R$)" />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 block">Tipo</label>
                            <select value={newKrForm.tipo} onChange={e => setNewKrForm({...newKrForm, tipo: e.target.value as any})}
                              className="w-full px-2 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none">
                              <option value="Percentual">%</option>
                              <option value="Monetário">R$</option>
                              <option value="Unidade">Un</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5 block">Meta</label>
                            <input type="number" value={newKrForm.meta} onChange={e => setNewKrForm({...newKrForm, meta: +e.target.value})}
                              className="w-full px-3 py-2.5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" disabled={linkSaving}
                        className="px-10 py-3 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-60">
                        {linkSaving ? 'Criando...' : 'Criar OKR e Vincular'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
