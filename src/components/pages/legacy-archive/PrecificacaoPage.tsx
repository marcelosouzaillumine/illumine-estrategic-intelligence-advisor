

import React, { useState, useMemo } from 'react';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, Percent, Calculator, ArrowRightLeft, AlertCircle, BarChart2, Package, ArrowUpRight, ChevronRight, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { useModuleData } from '../../../hooks/useModuleData';
import { useFinancialData } from '../../../hooks/useFinancialData';
import { ProdutoServico } from '../../../types/modules';
import { cn, formatCurrency, formatValue } from '../../../lib/utils';
import { SectionHeader, PageHeader, StatusBadge } from '../../Common';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { DashboardSkeleton } from '../../ui/skeletons';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { usePrecificacaoPageViewModel } from '../../../viewmodels/usePrecificacaoPageViewModel';

interface PrecificacaoPageProps {
  clientId: string;
}


export function PrecificacaoPage({ clientId }: PrecificacaoPageProps) {
  // Adapter: usePrecificacaoPageAdapter
  // ViewModel: usePrecificacaoPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePrecificacaoPageViewModel({ clientId });
  const portal = createPortal;
  const { data: produtos, add, remove, loading } = useModuleData<ProdutoServico>('precificacao', clientId);
  const { dbData: dreGerencial } = useFinancialData(clientId, 2026, 3, 'DRE Gerencial');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    precoVenda: 0,
    custoMP: 0,
    comissao: 0,
    impostos: 0,
    frete: 0,
    outros: 0
  });

  const [simulador, setSimulador] = useState({
    variacaoPreco: 0,
    variacaoVolume: 0
  });

  const custosFixosTotais = useMemo(() => {
    if (!dreGerencial) return 0;
    return dreGerencial
      .filter(e => e.conta?.toLowerCase().includes('custo fixo') || e.conta?.toLowerCase().includes('despesa fixa'))
      .reduce((acc, curr) => acc + (curr.valor || 0), 0);
  }, [dreGerencial]);

  const stats = useMemo(() => {
    if (!produtos) return [];
    const list = produtos.map(p => {
      const cv = p.custosVariaveis || { materiaPrima: 0, comissao: 0, impostos: 0, frete: 0, outros: 0 };
      const totalCustosVar = (cv.materiaPrima || 0) + (cv.comissao || 0) + (cv.impostos || 0) + (cv.frete || 0) + (cv.outros || 0);
      const margemUnit = (p.precoVenda || 0) - totalCustosVar;
      const margemPct = (p.precoVenda || 0) > 0 ? (margemUnit / p.precoVenda) * 100 : 0;
      
      const pontoEquilibrioUnd = margemUnit > 0 ? custosFixosTotais / margemUnit : 0;
      const pontoEquilibrioFin = (p.precoVenda || 0) * pontoEquilibrioUnd;

      return { ...p, totalCustosVar, margemUnit, margemPct, pontoEquilibrioUnd, pontoEquilibrioFin };
    });

    return list.sort((a, b) => b.margemPct - a.margemPct);
  }, [produtos, custosFixosTotais]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalCustosVar = formData.custoMP + formData.comissao + formData.impostos + formData.frete + formData.outros;
    const margemUnit = formData.precoVenda - totalCustosVar;
    const margemPct = formData.precoVenda > 0 ? (margemUnit / formData.precoVenda) * 100 : 0;

    await add({
      nome: formData.nome,
      precoVenda: formData.precoVenda,
      custosVariaveis: {
        materiaPrima: formData.custoMP,
        comissao: formData.comissao,
        impostos: formData.impostos,
        frete: formData.frete,
        outros: formData.outros
      },
      margemContribuicaoUnit: margemUnit,
      margemContribuicaoPct: margemPct
    });

    setShowAddForm(false);
    setFormData({ nome: '', precoVenda: 0, custoMP: 0, comissao: 0, impostos: 0, frete: 0, outros: 0 });
  };

  const summaryKPIs = useMemo(() => {
    if (stats.length === 0) return [];
    
    const avgMargem = stats.reduce((acc, curr) => acc + curr.margemPct, 0) / stats.length;
    const totalPE = stats.reduce((acc, curr) => acc + curr.pontoEquilibrioFin, 0) / stats.length;
    const topProduct = stats[0];

    return [
      { label: 'Margem Contrib. Média', value: avgMargem, suffix: '%', icon: Percent, status: avgMargem > 30 ? 'positive' : 'neutral' },
      { label: 'P.E. Médio / Produto', value: totalPE, isCur: true, icon: Target, status: 'positive' },
      { label: 'Custo Fixo Mensal', value: custosFixosTotais, isCur: true, icon: DollarSign, status: 'neutral' },
      { label: 'Top Rentabilidade', value: topProduct.nome, isText: true, icon: TrendingUp, status: 'positive' },
    ];
  }, [stats, custosFixosTotais]);

  const simuladorResult = useMemo(() => {
    if (stats.length === 0) return null;
    const topProduto = stats[0];
    const baseVolume = 1000;
    const originalMargemTotal = topProduto.margemUnit * baseVolume;
    
    const novoPreco = topProduto.precoVenda * (1 + (simulador.variacaoPreco / 100));
    const novoVolume = baseVolume * (1 + (simulador.variacaoVolume / 100));
    const novaMargemUnit = novoPreco - topProduto.totalCustosVar;
    const novaMargemTotal = novaMargemUnit * novoVolume;
    
    return {
      original: originalMargemTotal,
      novo: novaMargemTotal,
      impacto: originalMargemTotal !== 0 ? ((novaMargemTotal / originalMargemTotal) - 1) * 100 : 0
    };
  }, [stats, simulador]);

  if (loading) return <DashboardSkeleton />;

  return (
    <ExecutivePageTemplate header={{
      title: "Precificação & Margem",
      description: "Engenharia de Preços, Margem de Contribuição e Ponto de Equilíbrio estratégico.",
      actions: (
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 md:px-8 py-2.5 md:py-4 bg-secondary text-primary rounded-3xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-secondary/20 transition-all font-display"
        >
          {showAddForm ? 'Cancelar' : <><Plus size={16} /> Adicionar Produto/Serviço</>}
        </button>
      )
    }}>
      <div className="space-y-12 pb-32 animate-executive-fade">

       <div className="mt-12 mb-8 border-t border-border pt-8" />
       <ExecutiveAccordion
         title="KPIs de Precificação e Margem"
         subtitle="Engenharia de preços, contribuição e ponto de equilíbrio estratégico."
         variant="analytics"
         defaultExpanded
       >
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryKPIs.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {(() => {
                    const Icon = kpi.icon;
                    return <Icon size={24} />;
                  })()}
                </div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                kpi.status === 'positive' ? "bg-success-soft0 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : 
                kpi.status === 'negative' ? "bg-critical-soft0 shadow-[0_0_12px_rgba(244,63,94,0.4)]" : 
                "bg-warning-soft0 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              )} />
            </div>

            <div>
       <ExecutiveHeading as="h4" className="font-display text-executive-secondary group-hover:text-secondary transition-colors mb-1.5">
                {kpi.label}
              </ExecutiveHeading>
       <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary mb-4">Métrica de Performance</ExecutiveText>
              <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-executive-secondary tabular-nums tracking-tighter whitespace-nowrap">
                  {kpi.isText ? kpi.value : formatValue(kpi.value as number, kpi.isCur ? 'R$' : kpi.suffix || '')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[48px] border border-border shadow-2xl p-12 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Calculator size={160} strokeWidth={1} />
            </div>
            <form onSubmit={handleAdd} className="space-y-10 relative z-10">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-success-soft flex items-center justify-center text-emerald-600">
                    <Plus size={24} />
                  </div>
                  <div>
          <ExecutiveHeading as="h3" className="text-executive-secondary">Novo Item para Precificação</ExecutiveHeading>
                    <ExecutiveText as="div" variant="caption" className="text-muted-foreground">Defina os parâmetros unitários de venda e custo</ExecutiveText>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3 px-1">Nome do Produto ou Serviço</label>
                      <input 
                        required
                        value={formData.nome}
                        onChange={e => setFormData({...formData, nome: e.target.value})}
                        className="w-full px-5 md:px-8 py-3 md:py-5 bg-slate-50 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg text-muted-foreground transition-all"
                        placeholder="Ex: Consultoria Premium Mensal"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3 px-1">Preço de Venda Praticado (R$)</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-black">R$</span>
                            <input 
                              required
                              type="number"
                              value={formData.precoVenda}
                              onChange={e => setFormData({...formData, precoVenda: parseFloat(e.target.value)})}
                              className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-border rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-2xl text-emerald-600 transition-all"
                            />
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-10 rounded-[40px] border border-border space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                       <DollarSign size={18} className="text-emerald-600" />
                       <ExecutiveHeading as="h4" className="text-emerald-600">Custos Variáveis Unitários</ExecutiveHeading>
                    </div>
                    {[
                      { label: 'Matéria-Prima / Insumo', field: 'custoMP' },
                      { label: 'Comissão de Venda', field: 'comissao' },
                      { label: 'Impostos Diretos', field: 'impostos' },
                      { label: 'Logística / Frete', field: 'frete' },
                      { label: 'Outros Variáveis', field: 'outros' },
                    ].map(c => (
                      <div key={c.field} className="space-y-1.5">
                        <label className="text-[9px] font-black text-muted-foreground uppercase block ml-1">{c.label}</label>
                        <input 
                          type="number"
                          value={(formData as any)[c.field]}
                          onChange={e => setFormData({...formData, [c.field]: parseFloat(e.target.value)})}
                          className="w-full px-5 py-3 bg-white border border-border rounded-xl text-sm font-bold outline-none focus:border-emerald-500/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
               </div>

               <div className="mt-12 flex justify-end pt-6 border-t border-border pt-8 mb-8">
                 <button type="submit" className="px-4 md:px-6 md:px-12 py-2 md:py-3.5 md:py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-emerald-600/30 transition-all active:scale-95">
                   Salvar Inteligência de Preço
                 </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <div className="xl:col-span-2 space-y-10">
            <SectionHeader title="Margens por Produto" subtitle="Ranking de rentabilidade unitária e eficiência" icon={BarChart2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {stats.map((item, idx) => (
                 <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[48px] border border-border shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-8 flex flex-col gap-2">
                       <div className={cn(
                         "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                         item.margemPct >= 40 ? "bg-success-soft text-emerald-600" : 
                         item.margemPct >= 20 ? "bg-blue-50 text-blue-600" : 
                         item.margemPct > 0 ? "bg-warning-soft text-amber-600" : "bg-critical-soft text-rose-600"
                       )}>
                         {item.margemPct.toFixed(1)}% Margem
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500">
                             <Package size={24} />
                          </div>
             <ExecutiveHeading as="h4" className="font-display text-executive-secondary">
                             {item.nome}
                          </ExecutiveHeading>
                          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground">Preço Praticado: <span className="text-muted-foreground">{formatCurrency(item.precoVenda)}</span></ExecutiveText>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="bg-slate-50/50 p-6 rounded-3xl border border-border group-hover:bg-white transition-colors">
                             <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2 tracking-widest">M.C. Unitária</span>
                             <span className="text-2xl font-black text-primary font-display">{formatCurrency(item.margemUnit)}</span>
                          </div>
                          <div className="bg-slate-50/50 p-6 rounded-3xl border border-border group-hover:bg-white transition-colors">
                             <span className="text-[10px] font-black text-muted-foreground uppercase block mb-2 tracking-widest">P.E. Unitário</span>
                             <span className="text-2xl font-black text-muted-foreground font-display">{item.pontoEquilibrioUnd.toFixed(0)} <span className="text-xs text-muted-foreground">UND</span></span>
                          </div>
                       </div>

                       <div className="mt-12 pt-8 border-t border-border flex justify-between items-center mb-8">
                          <div>
                            <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-1">P.E. Financeiro Empresa</ExecutiveText>
                            <ExecutiveText as="div" variant="bodyStandard" className="text-emerald-600 font-display">{formatCurrency(item.pontoEquilibrioFin)}</ExecutiveText>
                          </div>
                          <button 
                            onClick={() => remove(item.id!)} 
                            className="p-4 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-critical-soft transition-all opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={20} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="space-y-12">
            <SectionHeader title="Simulador de Impacto" subtitle="Sensibilidade de preço e volume" icon={ArrowRightLeft} />
            
            <div className="bg-slate-900 rounded-[56px] p-12 text-white space-y-10 relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(15,23,42,0.3)] border border-white/5">
               <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-success-soft0/10 blur-[100px] rounded-full"></div>
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
               
               <div className="relative z-10 space-y-10">
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                         <span className="text-emerald-400 flex items-center gap-2">
                           <TrendingUp size={14} /> Variação de Preço
                         </span>
                         <span className={cn(
                           "px-3 py-1 rounded-lg bg-white/5",
                           simulador.variacaoPreco >= 0 ? "text-emerald-400" : "text-rose-400"
                         )}>
                           {simulador.variacaoPreco > 0 ? '+' : ''}{simulador.variacaoPreco}%
                         </span>
                      </div>
                      <input 
                        type="range" min="-30" max="30" step="1"
                        value={simulador.variacaoPreco}
                        onChange={e => setSimulador({...simulador, variacaoPreco: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                         <span className="text-blue-400 flex items-center gap-2">
                           <TrendingUp size={14} /> Variação de Volume
                         </span>
                         <span className={cn(
                           "px-3 py-1 rounded-lg bg-white/5",
                           simulador.variacaoVolume >= 0 ? "text-blue-400" : "text-rose-400"
                         )}>
                           {simulador.variacaoVolume > 0 ? '+' : ''}{simulador.variacaoVolume}%
                         </span>
                      </div>
                      <input 
                        type="range" min="-50" max="50" step="1"
                        value={simulador.variacaoVolume}
                        onChange={e => setSimulador({...simulador, variacaoVolume: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {simuladorResult && (
                    <div className="p-10 bg-white/[0.03] rounded-[48px] border border-white/10 space-y-8 backdrop-blur-md">
                       <div className="text-center space-y-3">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Impacto na Margem de Contribuição</span>
                          <div className={cn(
                             "text-6xl font-black font-display tracking-tighter",
                             simuladorResult.impacto >= 0 ? "text-emerald-400" : "text-rose-400"
                          )}>
                             {simuladorResult.impacto > 0 ? '+' : ''}{simuladorResult.impacto.toFixed(1)}%
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
                          <div className="text-center space-y-1">
                             <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Base de Cálculo</div>
               <div className="text-sm font-black text-executive-secondary">{formatCurrency(simuladorResult.original)}</div>
                          </div>
                          <div className="text-center border-l border-white/5 space-y-1">
                             <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Expectativa</div>
                             <div className="text-sm font-black text-emerald-400">{formatCurrency(simuladorResult.novo)}</div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-border shadow-sm space-y-6 relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                 <AlertCircle size={140} />
               </div>
               <div className="flex items-center gap-3 text-muted-foreground relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                  <ExecutiveHeading as="h4" className="font-display">Insights Estratégicos</ExecutiveHeading>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-border text-xs font-medium text-muted-foreground leading-relaxed">
                     <span className="font-black text-muted-foreground uppercase block mb-2 tracking-widest">Cobertura de Custo Fixo</span>
                     A empresa possui um custo operacional fixo de <span className="font-black text-muted-foreground">{formatCurrency(custosFixosTotais)}</span>. Sua margem de contribuição atual deve priorizar o atingimento do Ponto de Equilíbrio global.
                  </div>
                  {stats.some(p => p.margemPct < 25) && (
                    <div className="p-6 bg-critical-soft rounded-3xl border border-rose-100 text-xs font-medium text-rose-800 leading-relaxed">
                       <span className="font-black uppercase block mb-2 tracking-widest text-rose-600">Alerta de Rentabilidade</span>
                       Detectamos produtos com margem inferior a <span className="font-black">25%</span>. Itens com margem baixa exigem alto volume para compensar ou renegociação de custos de insumos.
                    </div>
                  )}
                 </div>
              </div>
           </div>
       </div>
        <ExecutiveSummarySection 
          status={{ label: 'Precificação Validada', variant: 'success' }}
          question="Como otimizar o markup e a margem de contribuição dos produtos?"
          opinion="O comitê fiduciário homologa a estrutura de preços e o ponto de equilíbrio calculado por produto e serviço."
          driver="Margem de contribuição unitária, custos variáveis, despesas fixas e volume de vendas."
          implication="Proteção contra erosão de margens e maximização do lucro operacional."
          executiveQuestion="Revisar os markups vigentes frente ao repasse da inflação de custos bimensalmente."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
       </ExecutiveAccordion>
     </div>
    </ExecutivePageTemplate>
   );
 }
