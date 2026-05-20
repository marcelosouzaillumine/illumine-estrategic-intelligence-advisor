import React, { useMemo } from 'react';
import { 
  Database, 
  Activity, 
  Truck, 
  Box, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Zap,
  MessageSquare,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StatusBadge, PageHeader, KpiCard, KpiValue } from '../Common';
import { formatValue, formatCurrency, cn } from '../../lib/utils';

interface OperacionalPageProps {
  type: 'logistica' | 'producao';
  clientId: string;
}

const getValueSizeClass = (maxLen: number) => {
  if (maxLen > 22) return "text-[clamp(0.6rem,1vw,0.75rem)]";
  if (maxLen > 18) return "text-[clamp(0.7rem,1.2vw,0.9rem)]";
  if (maxLen > 15) return "text-[clamp(0.85rem,1.4vw,1.1rem)]";
  if (maxLen > 12) return "text-[clamp(1rem,1.7vw,1.35rem)]";
  if (maxLen > 10) return "text-[clamp(1.2rem,2vw,1.7rem)]";
  return "text-[clamp(1.6rem,2.5vw,2.3rem)]";
};

export function OperacionalPage({ type, clientId }: OperacionalPageProps) {
  const [dbIndicators, setDbIndicators] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);

  React.useEffect(() => {
    if (!clientId) {
      setDbIndicators([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setDbIndicators([]); // Reset para evitar exibir dados do cliente anterior
    const q = query(
      collection(db, 'indicators'),
      where('clientId', '==', clientId),
      where('ano', '==', selectedYear),
      where('mes', '==', selectedMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDbIndicators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [clientId, selectedYear, selectedMonth]);

  const getIndicatorValue = (name: string, fallback: number = 0) => {
    const ind = dbIndicators.find(i => i.ind === name || i.ind?.toLowerCase() === name.toLowerCase());
    return ind ? ind.val : fallback;
  };

  const isLogistica = type === 'logistica';
  const hasData = dbIndicators.length > 0;

  const indicators = useMemo(() => {
    if (isLogistica) {
      return [
        { label: 'OTIF (Entrega no Prazo)', value: getIndicatorValue('OTIF', 0), suffix: '%', status: 'positive', target: 95, icon: Truck },
        { label: 'Giro de Estoque', value: getIndicatorValue('Giro de Estoque', 0), suffix: 'x', status: 'neutral', target: 6.0, icon: Box },
        { label: 'Custo Frete / Receita', value: getIndicatorValue('Custo Frete', 0), suffix: '%', status: 'negative', target: 6.0, icon: TrendingUp },
        { label: 'Lead Time Entrega', value: getIndicatorValue('Lead Time Entrega', 0), suffix: ' dias', status: 'positive', target: 4.0, icon: Clock },
        { label: 'Ocupação de Frota', value: getIndicatorValue('Ocupação de Frota', 0), suffix: '%', status: 'positive', target: 85, icon: Activity },
      ];
    } else {
      return [
        { label: 'OEE (Eficiência Equip.)', value: getIndicatorValue('OEE', 0), suffix: '%', status: 'positive', target: 85, icon: Settings },
        { label: 'Índice de Qualidade', value: getIndicatorValue('Índice de Qualidade', 0), suffix: '%', status: 'positive', target: 98, icon: ShieldCheck },
        { label: 'Produtividade Colaborador', value: getIndicatorValue('Produtividade Colaborador', 0), suffix: ' und/h', status: 'positive', target: 150, icon: Activity },
        { label: 'Manutenção Preditiva', value: getIndicatorValue('Manutenção Preditiva', 0), suffix: '%', status: 'positive', target: 90, icon: Zap },
        { label: 'Nível de Refugo', value: getIndicatorValue('Nível de Refugo', 0), suffix: '%', status: 'negative', target: 1.5, icon: AlertCircle },
      ];
    }
  }, [isLogistica, dbIndicators]);

  const recommendations = useMemo(() => {
    if (!hasData) return [];
    if (isLogistica) {
      return [
        "Negociar tabelas de frete com transportadoras alternativas para rotas críticas.",
        "Implementar sistema de roteirização inteligente para otimizar entregas locais.",
        "Reduzir estoque de segurança de itens C para melhorar o giro total."
      ];
    } else {
      return [
        "Implementar manutenção preventiva programada para reduzir paradas não planejadas.",
        "Treinar operadores em técnicas de Lean Manufacturing para redução de desperdício.",
        "Revisar fluxo de processos na linha 3 para eliminar gargalos identificados."
      ];
    }
  }, [isLogistica, hasData]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-10 pb-32 animate-executive-fade">
      <PageHeader 
        title={isLogistica ? 'Eficiência em Logística' : 'Produção & Processos'} 
        subtitle={isLogistica ? 'Monitoramento estratégico de entregas, fretes e cadeia de suprimentos.' : 'Otimização de processos, produtividade e controle de qualidade.'}
        icon={isLogistica ? Truck : Activity}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                {loading ? 'Sincronizando...' : !hasData ? 'Aguardando Sincronização' : 'Eficiência Monitorada'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-card border border-border rounded-md shadow-sm flex items-center gap-2">
            <Layers size={14} className="text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Visão de Cadeia de Valor</span>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {indicators.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            title={kpi.label}
            value={formatValue(kpi.value, '')}
            suffix={kpi.suffix || ''}
            icon={kpi.icon}
            status={kpi.status === 'positive' ? 'Verde' : kpi.status === 'negative' ? 'Vermelho' : 'Amarelo'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Chart Placeholder */}
         {/* Chart Placeholder */}
         <div className="lg:col-span-2 card-premium p-10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
               <h3 className="text-[10px] font-medium text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                  <BarChart3 size={20} className="text-secondary" /> Histórico de Eficiência
               </h3>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-surface-container text-muted-foreground rounded-sm text-[9px] font-medium uppercase tracking-widest border border-border shadow-sm">Diário</button>
                  <button className="btn-executive bg-primary shadow-sm">Semanal</button>
               </div>
            </div>
            <div className="h-[300px] bg-surface-container/50 rounded-sm flex items-center justify-center border border-dashed border-border relative z-10 shadow-inner">
               <p className="text-muted-foreground/40 font-medium uppercase tracking-widest text-[9px] italic">Monitoramento em Tempo Real</p>
            </div>
         </div>

         {/* Recommendations */}
         {/* Recommendations */}
         <div className="bg-executive p-10 rounded-md text-white shadow-premium relative overflow-hidden group border border-white/5">
            <div className="absolute right-0 top-0 p-8 text-secondary/5 group-hover:text-secondary/10 transition-colors opacity-10 shadow-inner">
               <Zap size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
               <div className="space-y-8">
                 <h3 className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] flex items-center gap-3 shadow-sm">
                    <MessageSquare size={20} /> Insights do Eixo Operacional
                 </h3>
                 <div className="space-y-6">
                    {hasData ? recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-4 group cursor-default">
                         <div className="w-8 h-8 rounded-sm bg-white/10 border border-white/10 flex items-center justify-center text-secondary font-medium text-[10px] shrink-0 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                            {i + 1}
                         </div>
                         <p className="text-[11px] font-medium text-white/60 uppercase tracking-widest italic leading-relaxed group-hover:text-white transition-colors">
                            {rec}
                         </p>
                      </div>
                    )) : (
                      <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest italic leading-relaxed">
                         Aguardando inserção de dados operacionais para gerar insights e recomendações de eficiência.
                      </p>
                    )}
                 </div>
               </div>
               <button className="btn-executive w-full bg-white/5 hover:bg-white/10 border border-white/10 uppercase shadow-sm">
                  Otimizar Processos
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
