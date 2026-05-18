import React, { useMemo, useState, useEffect } from 'react';
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
import { db } from '../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { DATA } from '../../data';

interface AnaliseMercadoPageProps {
  clientId: string;
}

type Scope = 'Local' | 'Nacional' | 'Global';

export function AnaliseMercadoPage({ clientId }: AnaliseMercadoPageProps) {
  const [selectedScope, setSelectedScope] = useState<Scope>('Nacional');
  const [econData, setEconData] = useState<any[]>(DATA.premissas.economicas);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system', 'economic_premises'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.econData) setEconData(data.econData);
      }
    });
    return () => unsub();
  }, []);

  const scopeIndicators = useMemo(() => {
    // Buscar valores das premissas
    const findPremissa = (term: string) => {
      for (const cat of econData) {
        const found = cat.indicadores?.find((i: any) => i.nome.toLowerCase().includes(term.toLowerCase()));
        if (found) return found;
      }
      return null;
    };

    const selic = findPremissa('Selic');
    const ipca = findPremissa('IPCA');
    const dolar = findPremissa('Dólar');

    const data: Record<Scope, any[]> = {
      Local: [
        { label: 'PIB Regional (Projetado)', value: '+2.1%', trend: 'Estável', status: 'neutral', icon: TrendingUp, obs: 'Dados SEADE/Regionais' },
        { label: 'Índice de Consumo Local', value: '104.5', suffix: ' pts', trend: 'up', status: 'positive', icon: Activity, obs: 'Varejo e Serviços Local' },
        { label: 'Custo Operacional Região', value: 'R$ 4.2k', trend: 'up', status: 'warning', icon: Target, obs: 'Média m² e Logística local' },
        { label: 'Desemprego Regional', value: '7.8%', trend: 'down', status: 'positive', icon: Layers, obs: 'Caged / Dados Municipais' }
      ],
      Nacional: [
        { 
          label: 'PIB Brasil 2026', 
          value: findPremissa('PIB')?.valor || '1.8%', 
          trend: 'Moderado', 
          status: 'neutral', 
          icon: TrendingUp, 
          obs: findPremissa('PIB')?.obs || 'Relatório Focus / Banco Central' 
        },
        { 
          label: 'Selic (Projeção)', 
          value: selic?.valor || '11.25%', 
          trend: selic?.status?.toLowerCase()?.includes('redução') ? 'down' : 'Estável', 
          status: 'positive', 
          icon: Target, 
          obs: selic?.obs || 'Meta COPOM' 
        },
        { 
          label: 'Inflação (IPCA)', 
          value: ipca?.valor || '4.5%', 
          trend: 'up', 
          status: 'warning', 
          icon: Activity, 
          obs: ipca?.obs || 'Acumulado 12 meses IBGE' 
        },
        { 
          label: 'Dólar (Ptax Médio)', 
          value: dolar?.valor || 'R$ 5,05', 
          trend: 'neutral', 
          status: 'neutral', 
          icon: Globe, 
          obs: dolar?.obs || 'Fechamento Comercial' 
        }
      ],
      Global: [
        { label: 'PIB Mundial (FMI)', value: '3.1%', trend: 'Estável', status: 'positive', icon: Globe, obs: 'World Economic Outlook' },
        { label: 'Fed Funds Rate', value: '5.25%', trend: 'neutral', status: 'neutral', icon: Target, obs: 'Federal Reserve US' },
        { label: 'Commodities Index', value: '+12.4%', trend: 'up', status: 'positive', icon: BarChart3, obs: 'Brent & Iron Ore Trend' },
        { label: 'Global Tech Index', value: '14.8k', trend: 'up', status: 'positive', icon: Zap, obs: 'Nasdaq & AI Sector Growth' }
      ]
    };
    return data[selectedScope];
  }, [selectedScope, econData]);

  return (
    <div className="space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Inteligência Competitiva"
        subtitle="Monitoramento estratégico de indicadores setoriais reais e validados nos âmbitos Local, Nacional e Global."
        icon={Globe}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container border border-border p-1 rounded-md shadow-inner">
            {(['Local', 'Nacional', 'Global'] as Scope[]).map(scope => (
              <button 
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={cn(
                  "px-6 py-2 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all",
                  selectedScope === scope ? "bg-card text-foreground shadow-premium border border-border" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-card border border-border rounded-md shadow-premium flex items-center gap-2">
            <RefreshCw size={14} className="text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Dados em Tempo Real</span>
          </div>
        </div>
      </div>


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
              className="card-premium p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container rounded-bl-[60px] -mr-12 -mt-12 pointer-events-none group-hover:bg-primary/5 transition-colors shadow-inner" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-md flex items-center justify-center shadow-inner group-hover:shadow-premium transition-all duration-500",
                  trend.status === 'positive' ? "bg-success/10 text-success group-hover:bg-success group-hover:text-white" : 
                  trend.status === 'warning' ? "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white" : 
                  "bg-surface-container text-muted-foreground group-hover:bg-executive group-hover:text-white"
                )}>
                  {(() => {
                    const Icon = trend.icon;
                    return <Icon size={22} />;
                  })()}
                </div>
                <div className="flex flex-col items-end">
                   <div className={cn(
                     "px-3 py-1 rounded-sm text-[8px] font-medium uppercase tracking-widest border",
                     trend.trend === 'up' ? "bg-success/5 text-success border-success/20 shadow-premium" : 
                     trend.trend === 'down' ? "bg-destructive/5 text-destructive border-destructive/20 shadow-premium" : 
                     "bg-surface-container text-muted-foreground border-border shadow-inner"
                   )}>
                      {trend.trend}
                   </div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">{trend.label}</p>
                <p className="text-3xl font-medium text-foreground mb-4 tracking-tighter">
                  {trend.value}
                  {trend.suffix && <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest">{trend.suffix}</span>}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-medium text-muted-foreground uppercase tracking-widest italic">
                  <Info size={12} className="text-secondary" />
                  <span className="break-words overflow-visible leading-normal">{trend.obs}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sector Performance Chart */}
         <div className="lg:col-span-2 card-premium p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <BarChart3 size={240} />
            </div>
            <div className="flex justify-between items-center mb-12 relative z-10">
               <div>
                  <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] mb-2">Análise Comparativa</h3>
                  <h2 className="text-2xl font-medium text-foreground tracking-tight uppercase">Performance vs Benchmark {selectedScope}</h2>
               </div>
               <div className="flex bg-surface-container/50 p-1 rounded-md border border-border shadow-inner">
                  <button className="px-5 py-2 bg-card text-foreground rounded-md text-[10px] font-medium uppercase tracking-widest shadow-premium border border-border flex items-center gap-2">
                    <Calendar size={12} className="text-secondary" /> Trimestral
                  </button>
               </div>
            </div>
            
            <div className="h-[350px] bg-surface-container/30 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-border group hover:border-secondary/30 transition-all cursor-pointer shadow-inner">
               <div className="w-16 h-16 rounded-md bg-card flex items-center justify-center text-muted-foreground group-hover:text-secondary group-hover:scale-110 transition-all shadow-premium border border-border mb-6">
                 <Activity size={32} />
               </div>
               <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] mb-2 italic">Integração de Dados em Tempo Real</p>
               <p className="text-muted-foreground/40 text-[9px] font-medium uppercase tracking-widest">Sincronizado via Premissas do Sistema</p>
            </div>
         </div>

         {/* Strategic Market Summary */}
         <div className="bg-executive p-12 rounded-md text-white shadow-premium relative overflow-hidden flex flex-col border border-white/5">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none shadow-inner" />
            
            <div className="relative z-10 flex flex-col h-full">
               <div className="mb-12">
                  <p className="text-[10px] font-medium text-secondary uppercase tracking-[0.3em] mb-2">Deep Insights</p>
                  <h3 className="text-2xl font-medium text-white tracking-tight flex items-center gap-3 uppercase">
                    Panorama de Oportunidades
                  </h3>
               </div>

               <div className="space-y-10 flex-1">
                  {[].map((insight: any, i: number) => (
                    <div key={i} className="group cursor-default flex gap-6">
                       <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-inner shrink-0">
                          {(() => {
                            const Icon = insight.icon;
                            return <Icon size={18} />;
                          })()}
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest mb-1">{insight.title}</h4>
                          <p className="text-[11px] font-medium text-white/60 leading-relaxed group-hover:text-white transition-colors uppercase tracking-widest italic">
                            {insight.desc}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-12 pt-8 border-t border-white/10">
                  <button className="btn-executive bg-white/5 border border-white/10 hover:bg-white/10">
                    <RefreshCw size={14} /> Atualizar Inteligência
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
