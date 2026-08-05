


import React, { useMemo } from 'react';
import { Target, TrendingUp, ShieldCheck, Users, Lightbulb, Globe, ShoppingBag, Settings, ChevronRight, CheckCircle2, Clock, AlertCircle, BarChart3, ArrowRightLeft, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatValue, formatCurrency } from '../../../lib/utils';
import { PageHeader, SectionHeader, StatusBadge } from '../../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { usePlanoEstrategicoGlobalPageViewModel } from '../../../viewmodels/usePlanoEstrategicoGlobalPageViewModel';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { useModuleData } from '../../../hooks/useModuleData';
import { ObjetivoOKR } from '../../../types/modules';
import { DashboardSkeleton } from '../../ui/skeletons';

interface PlanejamentoEstrategicoPageProps {
  clientId: string;
}

export function PlanoEstrategicoGlobalPage({ clientId }: PlanejamentoEstrategicoPageProps) {
  // Adapter: usePlanoEstrategicoGlobalPageAdapter
  // ViewModel: usePlanoEstrategicoGlobalPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = usePlanoEstrategicoGlobalPageViewModel({ clientId });
  const portal = createPortal;
  // Adapter: useModuleData provides Firestore-backed OKR data access layer
  // ViewModel: strategicData computed from okrs for display and deviation analysis
  const { data: okrs, loading } = useModuleData<ObjetivoOKR>('okrs', clientId);
  const hasData = okrs && okrs.length > 0;

  const axes = [
    { id: 'gov', title: 'Governança Corporativa', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50/50', status: hasData ? 85 : 0, goals: okrs?.filter(o => o.eixo === 'Governança Corporativa').length || 0 },
    { id: 'cul', title: 'Cultura Organizacional', icon: Users, color: 'text-rose-500', bg: 'bg-critical-soft/50', status: hasData ? 72 : 0, goals: okrs?.filter(o => o.eixo === 'Cultura Organizacional').length || 0 },
    { id: 'ges', title: 'Administração e Finanças', icon: TrendingUp, color: 'text-muted-foreground', bg: 'bg-slate-100/50', status: hasData ? 95 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão Administrativa e Financeira').length || 0 },
    { id: 'ino', title: 'Gestão de Inovação', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-warning-soft/50', status: hasData ? 45 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão de Inovação').length || 0 },
    { id: 'mkt', title: 'Gestão de Marketing', icon: Globe, color: 'text-primary', bg: 'bg-primary', status: hasData ? 60 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão de Marketing').length || 0 },
    { id: 'com', title: 'Gestão Comercial', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-success-soft/50', status: hasData ? 90 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão Comercial').length || 0 },
    { id: 'ope', title: 'Gestão Operacional', icon: Settings, color: 'text-orange-500', bg: 'bg-orange-50/50', status: hasData ? 88 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão Operacional').length || 0 }
  ];

  // Logic to calculate progress from OKRs
  const strategicData = useMemo(() => {
    const hasData = okrs && okrs.length > 0;
    
    if (!hasData) {
      return {
        overallProgress: 0,
        plannedProgress: 0,
        gapsCount: 0,
        criticalCount: 0,
        objectives: []
      };
    }

    const totalProgress = okrs.reduce((acc, obj) => acc + (obj.progressoGeral || 0), 0) / okrs.length;
    const gaps = okrs.filter(o => (o.progressoGeral || 0) < 50).length;

    return {
      overallProgress: Math.round(totalProgress),
      plannedProgress: 100, // Target usually 100% for execution
      gapsCount: gaps,
      criticalCount: okrs.filter(o => (o.progressoGeral || 0) < 30).length,
      objectives: okrs.map(o => ({
        label: o.titulo,
        axis: o.eixo,
        planned: 100,
        executed: Math.round(o.progressoGeral || 0),
        status: (o.progressoGeral || 0) >= 100 ? 'Concluído' : (o.progressoGeral || 0) >= 50 ? 'Em Curso' : 'Atrasado',
        gap: (o.progressoGeral || 0) < 50 ? 'Desvio detectado' : 'Nenhum'
      }))
    };
  }, [okrs]);

  if (loading) return <DashboardSkeleton />;

  return (
    <ExecutivePageTemplate header={{
      title: "Planejamento Estratégico",
      description: "Monitoramento executivo de metas, execução e análise de desvios sistêmicos.",
    }}>

      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Em Execução Ativa" />
          {hasData && (
            <StatusBadge status="Verde" label={`${okrs.length} OKRs Ativos`} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-surface-container border border-border rounded-md shadow-sm flex items-center gap-2">
            <Zap size={14} className="text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Visão Global de Desvios</span>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="KPIs Estratégicos Consolidados"
        subtitle="Progresso realizado vs. metas planejadas e desvios sistêmicos."
        variant="analytics"
        defaultExpanded
      >


      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-premium p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-primary/5 group-hover:text-primary/10 transition-colors">
            <TrendingUp size={64} strokeWidth={3} />
          </div>
          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-4">Progresso Realizado</ExecutiveText>
          <div className="flex items-end gap-2">
            <ExecutiveHeading as="h3" className="text-foreground">{hasData ? `${strategicData.overallProgress}%` : '---'}</ExecutiveHeading>
            {hasData && <span className="text-[10px] font-medium text-success mb-2 uppercase tracking-widest shadow-sm">+4.2% este mês</span>}
          </div>
          <div className="mt-6 h-2 bg-surface-container rounded-sm overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strategicData.overallProgress}%` }}
              className="h-full bg-executive rounded-sm shadow-premium"
            />
          </div>
        </div>

        <div className="card-premium p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-secondary/5 group-hover:text-secondary/10 transition-colors">
            <Target size={64} strokeWidth={3} />
          </div>
          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-4">Meta Planejada (Q1)</ExecutiveText>
          <div className="flex items-end gap-2">
            <ExecutiveHeading as="h3" className="text-foreground">{strategicData.plannedProgress}%</ExecutiveHeading>
            <span className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-widest shadow-sm">Gap: -{strategicData.plannedProgress - strategicData.overallProgress}%</span>
          </div>
          <div className="mt-6 h-2 bg-surface-container rounded-sm overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strategicData.plannedProgress}%` }}
              className="h-full bg-secondary rounded-sm shadow-premium"
            />
          </div>
        </div>

        <div className="card-premium p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-destructive/5 group-hover:text-destructive/10 transition-colors">
            <AlertCircle size={64} strokeWidth={3} />
          </div>
          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-4">Gaps Identificados</ExecutiveText>
          <div className="flex items-end gap-2">
            <ExecutiveHeading as="h3" className="text-foreground">{strategicData.gapsCount}</ExecutiveHeading>
            <span className="text-[10px] font-medium text-destructive mb-2 uppercase tracking-widest shadow-sm">{strategicData.criticalCount} críticos</span>
          </div>
     <ExecutiveText as="div" variant="bodyStandard" className="mt-6 text-executive-secondary italic">Ações corretivas pendentes</ExecutiveText>
        </div>

        <div className="card-premium p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-secondary/5 group-hover:text-secondary/10 transition-colors">
            <Activity size={64} strokeWidth={3} />
          </div>
          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mb-4">Health Score Global</ExecutiveText>
          <div className="flex items-end gap-2">
            <ExecutiveHeading as="h3" className="text-secondary">{hasData ? 'A-' : '---'}</ExecutiveHeading>
            <span className="text-[10px] font-medium text-secondary/60 mb-2 uppercase tracking-widest shadow-sm">{hasData ? 'Estável' : 'Pendente'}</span>
          </div>
     <ExecutiveText as="div" variant="bodyStandard" className="mt-6 text-executive-secondary italic">{hasData ? 'Risco de execução: Baixo' : 'Aguardando Planejamento'}</ExecutiveText>
        </div>
      </div>

      {/* Axis Matrix - Vision of the 7 Pillars */}
      <SectionHeader 
        title="Matriz de Pilares de Gestão" 
        subtitle="SAÚDE CORPORATIVA POR DIMENSÃO" 
        icon={Zap}
        tone="slate"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {axes.map((axis, idx) => (
          <motion.div 
            key={axis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card-premium p-8 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className={cn("w-14 h-14 rounded-md flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", axis.bg, axis.color)}>
                  {(() => {
                    const Icon = axis.icon;
                    return <Icon size={28} />;
                  })()}
               </div>
               <div className="text-right">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block">Status</span>
                  <span className={cn(
                    "text-xl font-medium tracking-tighter",
                    !hasData ? "text-muted-foreground/30" : (axis.status >= 80 ? "text-success" : axis.status >= 50 ? "text-warning" : "text-destructive")
                  )}>{hasData ? `${axis.status}%` : '---'}</span>
               </div>
            </div>
            <ExecutiveHeading as="h3" className="text-foreground mb-1">{axis.title}</ExecutiveHeading>
      <ExecutiveText as="div" variant="bodyStandard" className="text-executive-secondary italic">{axis.goals} Objetivos em Curso</ExecutiveText>
            
            <div className="mt-6 flex items-center justify-between relative z-10">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-sm border border-border bg-surface-container shadow-inner" />
                  ))}
               </div>
               <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-secondary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {hasData && (
        <div className="bg-executive rounded-md p-12 text-white shadow-premium relative overflow-hidden border border-white/5">
           <div className="absolute right-0 top-0 p-12 text-secondary/5 opacity-10 shadow-inner">
              <BarChart3 size={320} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 space-y-12">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                 <div className="max-w-2xl">
                    <ExecutiveHeading as="h4" className="text-secondary mb-4">Análise de Execução & Gaps Estratégicos</ExecutiveHeading>
                    <p className="text-white/60 text-sm font-medium leading-relaxed uppercase tracking-widest italic">
                      Visualização detalhada do desvio entre o planejamento teórico e a realidade operacional. 
                      Foco na identificação de gargalos que impedem a tração das iniciativas.
                    </p>
                 </div>
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-sm bg-white/20 shadow-inner" />
                       <span className="text-[9px] font-medium uppercase text-white/40 tracking-widest">Planejado</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-sm bg-secondary shadow-premium" />
                       <span className="text-[9px] font-medium uppercase text-white/40 tracking-widest">Executado</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-10">
                 {strategicData.objectives.map((task, i) => (
                    <div key={i} className="group relative">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-secondary text-[9px] font-medium uppercase tracking-widest italic">{task.axis}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20 shadow-inner" />
                                <span className="text-white font-medium text-sm uppercase tracking-tighter">{task.label}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Gap Analysis:</span>
                                <span className={cn(
                                  "text-[9px] font-medium uppercase tracking-widest italic",
                                  task.gap === 'Nenhum' ? "text-success" : "text-destructive"
                                )}>{task.gap}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <span className="text-[8px] font-medium text-white/30 uppercase tracking-widest block">Status</span>
                                <span className={cn(
                                  "text-[9px] font-medium uppercase tracking-widest shadow-sm",
                                  task.status === 'Concluído' ? "text-success" :
                                  task.status === 'Atrasado' ? "text-destructive" : "text-warning"
                                )}>{task.status}</span>
                             </div>
                             <div className="text-right">
                                <span className="text-[8px] font-medium text-white/30 uppercase tracking-widest block">Execução</span>
                                <span className="text-lg font-medium text-white tracking-tighter">{task.executed}%</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="relative h-2.5 bg-white/5 rounded-sm overflow-hidden shadow-inner border border-white/5">
                          {/* Planned Track (Background ghost) */}
                          <div 
                            className="absolute inset-0 bg-white/10 opacity-30 transition-all duration-1000 shadow-inner"
                            style={{ width: `${task.planned}%` }}
                          />
                          {/* Executed Track */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${task.executed}%` }}
                            className={cn(
                              "absolute inset-0 h-full rounded-sm transition-all duration-1000 shadow-premium",
                              task.status === 'Concluído' ? "bg-success" :
                              task.status === 'Atrasado' ? "bg-destructive" : "bg-secondary"
                            )}
                          />
                       </div>
                    </div>
                 ))}
              </div>
              
              {/* Action Items Recommendation */}
              <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-md backdrop-blur-xl shadow-inner">
                 <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="text-secondary" size={20} />
                    <h5 className="text-[10px] font-medium uppercase tracking-[0.2em] shadow-sm">Recomendações do Advisor AI</h5>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <ExecutiveText as="div" variant="bodyStandard" className="text-white/30">Foco de Atenção</ExecutiveText>
                       <ExecutiveText as="div" variant="caption" className="text-white/60 italic">Análise de desvios em tempo real. Os eixos com menor progresso demandam revisão imediata de recursos.</ExecutiveText>
                    </div>
                    <div className="space-y-2">
                       <ExecutiveText as="div" variant="bodyStandard" className="text-white/30">Oportunidade</ExecutiveText>
                       <ExecutiveText as="div" variant="caption" className="text-white/60 italic">Eixos com alta performance indicam maturidade operacional e podem servir de benchmark interno.</ExecutiveText>
                    </div>
                 </div>
              </div>
           </div>
         </div>
       )}
        <ExecutiveSummarySection 
         status={{ label: 'Planejamento Ativo', variant: 'success' }}
         question="Como monitorar a aderência das metas e OKRs do planejamento?"
         opinion="O conselho administrativo aprova o progresso dos OKRs consolidados nos respectivos eixos estratégicos."
         driver="Objetivos estratégicos, metas setoriais e progresso acumulado."
         implication="Garantia de alinhamento tático de todas as unidades com a governança corporativa."
         executiveQuestion="Efetuar revisões de OKR bimestrais para mitigar desvios de metas."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
