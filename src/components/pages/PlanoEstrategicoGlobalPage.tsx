
import React, { useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Lightbulb, 
  Globe, 
  ShoppingBag, 
  Settings,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  ArrowRightLeft,
  Activity,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatValue, formatCurrency } from '../../lib/utils';
import { PageHeader, SectionHeader, StatusBadge } from '../Common';
import { useModuleData } from '../../hooks/useModuleData';
import { ObjetivoOKR } from '../../types/modules';

interface PlanejamentoEstrategicoPageProps {
  clientId: string;
}

export function PlanoEstrategicoGlobalPage({ clientId }: PlanejamentoEstrategicoPageProps) {
  const { data: okrs, loading } = useModuleData<ObjetivoOKR>('okrs', clientId);
  const hasData = okrs && okrs.length > 0;

  const axes = [
    { id: 'gov', title: 'Governança Corporativa', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50/50', status: hasData ? 85 : 0, goals: okrs?.filter(o => o.eixo === 'Governança Corporativa').length || 0 },
    { id: 'cul', title: 'Cultura Organizacional', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50/50', status: hasData ? 72 : 0, goals: okrs?.filter(o => o.eixo === 'Cultura Organizacional').length || 0 },
    { id: 'ges', title: 'Administração e Finanças', icon: TrendingUp, color: 'text-slate-700', bg: 'bg-slate-100/50', status: hasData ? 95 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão Administrativa e Financeira').length || 0 },
    { id: 'ino', title: 'Gestão de Inovação', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50/50', status: hasData ? 45 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão de Inovação').length || 0 },
    { id: 'mkt', title: 'Gestão de Marketing', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50/50', status: hasData ? 60 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão de Marketing').length || 0 },
    { id: 'com', title: 'Gestão Comercial', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50/50', status: hasData ? 90 : 0, goals: okrs?.filter(o => o.eixo === 'Gestão Comercial').length || 0 },
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

  if (loading) return null;

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title="Planejamento Estratégico" 
        subtitle="Monitoramento executivo de metas, execução e análise de desvios sistêmicos."
        icon={Target}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: Em Execução Ativa</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
            <Zap size={14} className="text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visão Global de Desvios</span>
          </div>
        </div>
      </div>


      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-primary/5 group-hover:text-primary/10 transition-colors">
            <TrendingUp size={64} strokeWidth={3} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Progresso Realizado</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{hasData ? `${strategicData.overallProgress}%` : '---'}</h3>
            {hasData && <span className="text-xs font-bold text-emerald-500 mb-2">+4.2% este mês</span>}
          </div>
          <div className="mt-6 h-2 bg-slate-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strategicData.overallProgress}%` }}
              className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-secondary/5 group-hover:text-secondary/10 transition-colors">
            <Target size={64} strokeWidth={3} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Meta Planejada (Q1)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{strategicData.plannedProgress}%</h3>
            <span className="text-xs font-bold text-slate-400 mb-2">Gap: -{strategicData.plannedProgress - strategicData.overallProgress}%</span>
          </div>
          <div className="mt-6 h-2 bg-slate-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${strategicData.plannedProgress}%` }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
            <AlertCircle size={64} strokeWidth={3} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Gaps Identificados</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{strategicData.gapsCount}</h3>
            <span className="text-xs font-bold text-rose-500 mb-2">{strategicData.criticalCount} críticos</span>
          </div>
          <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase italic">Ações corretivas pendentes</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors">
            <Activity size={64} strokeWidth={3} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Health Score Global</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">{hasData ? 'A-' : '---'}</h3>
            <span className="text-xs font-bold text-indigo-400 mb-2">{hasData ? 'Estável' : 'Pendente'}</span>
          </div>
          <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase italic">{hasData ? 'Risco de execução: Baixo' : 'Aguardando Planejamento'}</p>
        </div>
      </div>

      {/* Axis Matrix - Vision of the 7 Pillars */}
      <SectionHeader 
        title="Matriz de Eixos de Gestão" 
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
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/10 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", axis.bg, axis.color)}>
                  {(() => {
                    const Icon = axis.icon;
                    return <Icon size={28} />;
                  })()}
               </div>
               <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                  <span className={cn(
                    "text-lg font-black",
                    !hasData ? "text-slate-300" : (axis.status >= 80 ? "text-emerald-500" : axis.status >= 50 ? "text-amber-500" : "text-rose-500")
                  )}>{hasData ? `${axis.status}%` : '---'}</span>
               </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{axis.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{axis.goals} Objetivos em Curso</p>
            
            <div className="mt-6 flex items-center justify-between">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  ))}
               </div>
               <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Planned vs Executed Detailed Analysis - Hidden if no data */}
      {hasData && (
        <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute right-0 top-0 p-12 text-secondary/5 opacity-10">
              <BarChart3 size={320} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 space-y-12">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                 <div className="max-w-2xl">
                    <h4 className="text-sm font-black text-secondary uppercase tracking-[0.3em] mb-4">Análise de Execução & Gaps Estratégicos</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Visualização detalhada do desvio entre o planejamento teórico e a realidade operacional. 
                      Foco na identificação de gargalos que impedem a tração das iniciativas.
                    </p>
                 </div>
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-white/20" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Planejado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-400" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Executado</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-10">
                 {strategicData.objectives.map((task, i) => (
                   <div key={i} className="group relative">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                         <div className="space-y-1">
                            <div className="flex items-center gap-3">
                               <span className="text-secondary text-[10px] font-black uppercase tracking-widest">{task.axis}</span>
                               <span className="w-1 h-1 rounded-full bg-white/20" />
                               <span className="text-white font-black text-sm">{task.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-slate-500 uppercase">Gap Analysis:</span>
                               <span className={cn(
                                 "text-[10px] font-black uppercase",
                                 task.gap === 'Nenhum' ? "text-emerald-400" : "text-rose-400"
                               )}>{task.gap}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <span className="text-[9px] font-black text-slate-500 uppercase block">Status</span>
                               <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest",
                                 task.status === 'Concluído' ? "text-emerald-400" :
                                 task.status === 'Atrasado' ? "text-rose-400" : "text-amber-400"
                               )}>{task.status}</span>
                            </div>
                            <div className="text-right">
                               <span className="text-[9px] font-black text-slate-500 uppercase block">Execução</span>
                               <span className="text-lg font-black text-white">{task.executed}%</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                         {/* Planned Track (Background ghost) */}
                         <div 
                           className="absolute inset-0 bg-white/10 opacity-30 transition-all duration-1000"
                           style={{ width: `${task.planned}%` }}
                         />
                         {/* Executed Track */}
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${task.executed}%` }}
                           className={cn(
                             "absolute inset-0 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(56,189,248,0.3)]",
                             task.status === 'Concluído' ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                             task.status === 'Atrasado' ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "bg-blue-400"
                           )}
                         />
                      </div>
                   </div>
                 ))}
              </div>
              
              {/* Action Items Recommendation */}
              <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                 <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="text-secondary" size={20} />
                    <h5 className="text-xs font-black uppercase tracking-widest">Recomendações do Advisor AI</h5>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase">Foco de Atenção</p>
                       <p className="text-sm text-slate-300">Análise de desvios em tempo real. Os eixos com menor progresso demandam revisão imediata de recursos.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase">Oportunidade</p>
                       <p className="text-sm text-slate-300">Eixos com alta performance indicam maturidade operacional e podem servir de benchmark interno.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
