
import React, { useMemo } from 'react';
import { 
  Globe, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  MessageSquare,
  Search,
  RefreshCw,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface AnaliseMercadoPageProps {
  clientId: string;
}

export function AnaliseMercadoPage({ clientId }: AnaliseMercadoPageProps) {
  const marketTrends = [
    { label: 'Crescimento do Setor', value: '+4.2%', status: 'up', source: 'Bloomberg Finance' },
    { label: 'Taxa Selic Projetada', value: '11.25%', status: 'down', source: 'Relatório Focus' },
    { label: 'Inflação (IPCA)', value: '4.5%', status: 'up', source: 'IBGE' },
    { label: 'Câmbio (USD/BRL)', value: 'R$ 5,05', status: 'neutral', source: 'Reuters' }
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Globe size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Análise de Mercado</h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Inteligência Competitiva e Tendências Setoriais</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">
              <RefreshCw size={14} className="animate-spin-slow" /> Atualizado há 15 min
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
              <Zap size={14} /> Gerar Insight IA
           </button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* Global Indicators Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketTrends.map((trend, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-all"
          >
             <div className={cn(
               "w-10 h-10 rounded-xl mb-4 flex items-center justify-center",
               trend.status === 'up' ? "bg-emerald-50 text-emerald-500" : 
               trend.status === 'down' ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-400"
             )}>
                {trend.status === 'up' ? <ArrowUpRight size={20} /> : trend.status === 'down' ? <ArrowDownRight size={20} /> : <TrendingUp size={20} />}
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{trend.label}</p>
             <p className="text-2xl font-black text-slate-800 mb-2">{trend.value}</p>
             <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Fonte: {trend.source}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sector Performance Chart */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                  <Activity size={20} className="text-indigo-600" /> Performance Comparativa do Setor
               </h3>
               <div className="flex gap-2">
                  {['Local', 'Nacional', 'Global'].map(scope => (
                    <button key={scope} className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      scope === 'Nacional' ? "bg-primary text-white shadow-lg" : "bg-slate-50 text-slate-400 border border-slate-100"
                    )}>{scope}</button>
                  ))}
               </div>
            </div>
            <div className="h-[300px] bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Benchmark Setorial em Integração</p>
            </div>
         </div>

         {/* Strategic Market Summary */}
         <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-8 text-indigo-500/10">
               <PieIcon size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare size={20} /> Panorama de Oportunidades
               </h3>
               <div className="space-y-6">
                  {[
                    { title: "Mudança de Comportamento", desc: "Adoção acelerada de serviços digitais no segmento premium abre espaço para novo modelo de assinatura." },
                    { title: "Gap de Concorrência", desc: "O principal concorrente nacional reduziu investimentos em logística, criando oportunidade de ganho de market share no Sudeste." },
                    { title: "Ameaça Regulatória", desc: "Novas diretrizes de sustentabilidade entrarão em vigor no Q3; antecipação pode ser diferencial competitivo." }
                  ].map((insight, i) => (
                    <div key={i} className="group cursor-default">
                       <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Zap size={12} /> {insight.title}
                       </h4>
                       <p className="text-xs font-medium text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                          {insight.desc}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
