
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
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PlanoEstrategicoGlobalPageProps {
  clientId: string;
}

export function PlanoEstrategicoGlobalPage({ clientId }: PlanoEstrategicoGlobalPageProps) {
  const axes = [
    { id: 'gov', title: 'Governança', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50', status: '85%', goals: 12 },
    { id: 'cul', title: 'Cultura', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50', status: '72%', goals: 8 },
    { id: 'ges', title: 'Gestão', icon: TrendingUp, color: 'text-slate-700', bg: 'bg-slate-100', status: '95%', goals: 20 },
    { id: 'ino', title: 'Inovação', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50', status: '45%', goals: 15 },
    { id: 'mkt', title: 'Marketing', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50', status: '60%', goals: 6 },
    { id: 'com', title: 'Comercial', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', status: '90%', goals: 10 },
    { id: 'ope', title: 'Operação', icon: Settings, color: 'text-orange-500', bg: 'bg-orange-50', status: '88%', goals: 14 }
  ];

  return (
    <div className="space-y-10 pb-32">
      {/* Header */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Plano Estratégico Global</h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Visão Sistêmica por Eixos de Gestão</p>
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="text-right px-6 border-r border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Progresso Geral</span>
              <span className="text-2xl font-black text-primary">78%</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Meta Q1</span>
              <span className="text-2xl font-black text-secondary">85%</span>
           </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Axis Matrix */}
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
                  <axis.icon size={28} />
               </div>
               <span className="text-xs font-black text-primary">{axis.status}</span>
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">{axis.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{axis.goals} Objetivos Ativos</p>
            
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

      {/* Global Timeline / Gantt Placeholder */}
      <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 p-12 text-secondary/5 opacity-20">
            <TrendingUp size={240} strokeWidth={1} />
         </div>
         <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-end">
               <div>
                  <h4 className="text-sm font-black text-secondary uppercase tracking-[0.3em] mb-4">Timeline de Execução Global</h4>
                  <p className="text-slate-400 text-xs font-medium max-w-lg">Acompanhamento temporal das iniciativas estratégicas em todos os eixos da companhia.</p>
               </div>
               <div className="flex gap-4">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                    <div key={q} className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      q === 'Q1' ? "bg-secondary text-primary border-secondary" : "bg-white/5 border-white/10 text-slate-500"
                    )}>{q}</div>
                  ))}
               </div>
            </div>

            <div className="space-y-8">
               {[
                 { label: 'Reestruturação Financeira', axis: 'Gestão', progress: 100, status: 'Concluído' },
                 { label: 'Expansão de Mercado Norte', axis: 'Comercial', progress: 65, status: 'Em Curso' },
                 { label: 'Novo Programa de Trainee', axis: 'Cultura', progress: 30, status: 'Atrasado' },
                 { label: 'Migração Cloud 2.0', axis: 'Operação', progress: 85, status: 'Finalizando' }
               ].map((task, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <div className="flex items-center gap-3">
                          <span className="text-secondary">{task.axis}</span>
                          <span className="text-white">{task.label}</span>
                       </div>
                       <span className={cn(
                         task.status === 'Concluído' ? "text-emerald-400" :
                         task.status === 'Atrasado' ? "text-rose-400" : "text-amber-400"
                       )}>{task.status}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${task.progress}%` }}
                         className={cn(
                           "h-full rounded-full",
                           task.status === 'Concluído' ? "bg-emerald-500" :
                           task.status === 'Atrasado' ? "bg-rose-500" : "bg-amber-500"
                         )}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
