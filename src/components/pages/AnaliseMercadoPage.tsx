import React, { useMemo, useState } from 'react';
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
  Activity,
  Target,
  BarChart,
  Calendar,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, formatValue } from '../../lib/utils';
import { PageHeader, SectionHeader } from '../Common';

interface AnaliseMercadoPageProps {
  clientId: string;
}

type Scope = 'Local' | 'Nacional' | 'Global';

export function AnaliseMercadoPage({ clientId }: AnaliseMercadoPageProps) {
  const [selectedScope, setSelectedScope] = useState<Scope>('Nacional');

  const scopeIndicators = useMemo(() => {
    const data: Record<Scope, any[]> = {
      Local: [
        { label: 'PIB Regional (Projetado)', value: '+2.1%', trend: 'Estável', status: 'neutral', icon: TrendingUp, obs: 'Dados SEADE/Regionais' },
        { label: 'Índice de Consumo Local', value: '104.5', suffix: ' pts', trend: 'up', status: 'positive', icon: Activity, obs: 'Varejo e Serviços Local' },
        { label: 'Custo Operacional Região', value: 'R$ 4.2k', trend: 'up', status: 'warning', icon: Target, obs: 'Média m² e Logística local' },
        { label: 'Desemprego Regional', value: '7.8%', trend: 'down', status: 'positive', icon: Layers, obs: 'Caged / Dados Municipais' }
      ],
      Nacional: [
        { label: 'PIB Brasil 2026', value: '1.8%', trend: 'Moderado', status: 'neutral', icon: TrendingUp, obs: 'Relatório Focus / Banco Central' },
        { label: 'Selic (Projeção)', value: '11.25%', trend: 'down', status: 'positive', icon: Target, obs: 'Meta COPOM' },
        { label: 'Inflação (IPCA)', value: '4.5%', trend: 'up', status: 'warning', icon: Activity, obs: 'Acumulado 12 meses IBGE' },
        { label: 'Dólar (Ptax Médio)', value: 'R$ 5,05', trend: 'neutral', status: 'neutral', icon: Globe, obs: 'Fechamento Comercial' }
      ],
      Global: [
        { label: 'PIB Mundial (FMI)', value: '3.1%', trend: 'Estável', status: 'positive', icon: Globe, obs: 'World Economic Outlook' },
        { label: 'Fed Funds Rate', value: '5.25%', trend: 'neutral', status: 'neutral', icon: Target, obs: 'Federal Reserve US' },
        { label: 'Commodities Index', value: '+12.4%', trend: 'up', status: 'positive', icon: BarChart3, obs: 'Brent & Iron Ore Trend' },
        { label: 'Global Tech Index', value: '14.8k', trend: 'up', status: 'positive', icon: Zap, obs: 'Nasdaq & AI Sector Growth' }
      ]
    };
    return data[selectedScope];
  }, [selectedScope]);

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Inteligência Competitiva"
        subtitle="Monitoramento de indicadores setoriais reais e validados nos âmbitos Local, Nacional e Global."
        icon={Globe}
        color="bg-slate-900"
        actions={
          <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
            {(['Local', 'Nacional', 'Global'] as Scope[]).map(scope => (
              <button 
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  selectedScope === scope ? "bg-secondary text-primary shadow-lg" : "text-slate-400 hover:text-white"
                )}
              >
                {scope}
              </button>
            ))}
          </div>
        }
      />

      {/* Scope Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {scopeIndicators.map((trend, idx) => (
            <motion.div 
              key={`${selectedScope}-${idx}`}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -mr-12 -mt-12 pointer-events-none group-hover:bg-primary/5 transition-colors" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-500",
                  trend.status === 'positive' ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" : 
                  trend.status === 'warning' ? "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white" : 
                  "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
                )}>
                  {(() => {
                    const Icon = trend.icon;
                    return <Icon size={22} />;
                  })()}
                </div>
                <div className="flex flex-col items-end">
                   <div className={cn(
                     "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                     trend.trend === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                     trend.trend === 'down' ? "bg-rose-50 text-rose-600 border-rose-100" : 
                     "bg-slate-50 text-slate-400 border-slate-200"
                   )}>
                      {trend.trend}
                   </div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{trend.label}</p>
                <p className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tighter">
                  {trend.value}
                  {trend.suffix && <span className="text-sm text-slate-400 ml-1">{trend.suffix}</span>}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                  <Info size={12} className="text-slate-300" />
                  <span className="truncate">{trend.obs}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sector Performance Chart */}
         <div className="lg:col-span-2 bg-white p-12 rounded-[48px] border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <BarChart3 size={240} />
            </div>
            <div className="flex justify-between items-center mb-12 relative z-10">
               <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Análise Comparativa</h3>
                  <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Performance vs Benchmark {selectedScope}</h2>
               </div>
               <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 flex items-center gap-2">
                    <Calendar size={12} /> Trimestral
                  </button>
               </div>
            </div>
            
            <div className="h-[350px] bg-slate-50 rounded-[40px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group hover:border-secondary/30 transition-all cursor-pointer">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-secondary group-hover:scale-110 transition-all shadow-sm mb-6">
                 <Activity size={32} />
               </div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Integração de Dados em Tempo Real</p>
               <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">Sincronizado via Sacerdotal Intelligence</p>
            </div>
         </div>

         {/* Strategic Market Summary */}
         <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="mb-12">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Deep Insights</p>
                  <h3 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-3">
                    Panorama de Oportunidades
                  </h3>
               </div>

               <div className="space-y-10 flex-1">
                  {[
                    { title: "Transformação Digital Setorial", desc: "Adoção acelerada de serviços digitais no segmento premium abre espaço para novo modelo de assinatura recorrente.", icon: Zap },
                    { title: "Dinâmica de Concorrência", desc: "Redução de investimentos em logística por grandes players nacionais cria gap para expansão regional agressiva.", icon: Target },
                    { title: "Compliance & ESG", desc: "Novas diretrizes de sustentabilidade entrarão em vigor no próximo ciclo; antecipação gera diferencial de marca.", icon: Layers }
                  ].map((insight, i) => (
                    <div key={i} className="group cursor-default flex gap-6">
                       <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-lg shrink-0">
                          {(() => {
                            const Icon = insight.icon;
                            return <Icon size={18} />;
                          })()}
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{insight.title}</h4>
                          <p className="text-xs font-medium text-slate-400 leading-relaxed group-hover:text-white transition-colors">
                            {insight.desc}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-12 pt-8 border-t border-white/5">
                  <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[20px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <RefreshCw size={14} /> Atualizar Inteligência
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
