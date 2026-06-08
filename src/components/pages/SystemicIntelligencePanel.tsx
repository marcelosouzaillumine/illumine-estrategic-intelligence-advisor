import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Target, 
  ShieldCheck, 
  Activity, 
  ArrowRightLeft,
  Sparkles,
  Info,
  Layers,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import { cn, formatCurrency } from '../../lib/utils';
import { useModuleData } from '../../hooks/useModuleData';
import { useRealIndicatorData } from '../../hooks/useRealIndicatorData';
import { DiagnosticoItem, EixoGestao } from '../../types/modules';
import { PageHeader, MarkdownText } from '../Common';
import { DashboardSkeleton } from '../ui/skeletons';

interface SystemicIntelligencePageProps {
  clientId: string;
  selectedMonth: number;
  selectedYear: number;
}

const EIXOS: EixoGestao[] = [
  'Governança Corporativa', 
  'Cultura Organizacional', 
  'Gestão Administrativa e Financeira', 
  'Gestão de Inovação', 
  'Gestão de Marketing', 
  'Gestão Comercial', 
  'Gestão Operacional'
];

export function SystemicIntelligencePanel({ clientId, selectedMonth, selectedYear }: SystemicIntelligencePageProps) {
  const { data: indicators, loading: loadingInd } = useModuleData<any>('indicators', clientId);
  const { data: rawDiagnostics, loading: loadingDiag } = useModuleData<DiagnosticoItem>('diagnostico', clientId);
  const { kpis } = useRealIndicatorData(clientId, selectedMonth, selectedYear);

  const diagnostics = useMemo(() => {
    return rawDiagnostics.filter(d => {
      // If ano/mes is absent, treat it as global (valid for all periods)
      if (d.ano === undefined) return true;
      // Filter by the specific period if it has an assigned year
      const matchYear = d.ano === selectedYear;
      const matchMonth = d.mes ? d.mes === selectedMonth : true; // if no month, treat as annual
      return matchYear && matchMonth;
    });
  }, [rawDiagnostics, selectedYear, selectedMonth]);

  const hasFinancialData = useMemo(() => {
    return (kpis.revenue > 0 || kpis.totalAssets > 0) || indicators.some((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
  }, [indicators, selectedYear, selectedMonth, kpis]);

  const hasDiagnosticData = useMemo(() => {
    return diagnostics.length > 0;
  }, [diagnostics]);

  const stats = useMemo(() => {
    if (loadingInd || loadingDiag) return null;
    if (!hasFinancialData && !hasDiagnosticData) return null;

    // Filter indicators for the current period
    const currentInds = indicators.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
    
    // Financial metrics
    const ebitda = kpis.ebitda || currentInds.find((i: any) => i.ind === 'EBITDA')?.val || 0;
    const revenue = kpis.revenue || currentInds.find((i: any) => i.ind === 'Receita Líquida')?.val || 0;
    const personnel = currentInds.find((i: any) => i.ind === 'Custo com Pessoal')?.val || 0;
    const cash = kpis.saldoCaixa || currentInds.find((i: any) => i.ind === 'Saldo em Caixa')?.val || 0;

    // 1. Friction Index Calculation (Based on IVE of weaknesses/threats)
    const criticalItems = diagnostics.filter(d => d.swot === 'Fraqueza' || d.swot === 'Ameaça');
    const totalFrictionIve = criticalItems.reduce((acc, d) => acc + d.iveScore, 0);
    
    // Assume 10.000 IVE total = 25% EBITDA loss (hypothetical model)
    const frictionIndex = Math.min(25, (totalFrictionIve / 10000) * 25);
    const estimatedLoss = (ebitda * (frictionIndex / 100)) || 0;

    // 2. Alignment Score (Radar Data)
    const resonanceData = EIXOS.map(axis => {
      const items = diagnostics.filter(d => d.eixo === axis);
      const axisIve = items.reduce((acc, i) => acc + i.iveScore, 0);
      const maturity = items.length > 0 ? Math.max(10, 100 - (axisIve / 20)) : 0; 
      return { 
        subject: axis.replace('Gestão de ', '').replace('Organizacional', '').replace('Corporativa', ''), 
        A: Math.round(maturity), 
        fullMark: 100 
      };
    });

    const avgMaturity = hasDiagnosticData 
      ? resonanceData.reduce((acc, d) => acc + d.A, 0) / EIXOS.length
      : 0;

    // 3. Human Leverage Multiplier
    // Formula: EBITDA / Personnel Cost
    const humanLeverage = (personnel > 0 && ebitda !== 0) ? (ebitda / personnel) : 0;

    // 4. Perenity Index
    // Combines stability indicators: Governance Maturity + Cash/EBITDA + Low Friction
    const cashCoverage = ebitda > 0 ? (cash / (ebitda / 12)) : 0; // Months of EBITDA in cash
    const perenity = (hasFinancialData || hasDiagnosticData)
      ? Math.min(100, (avgMaturity * 0.6) + (Math.min(12, cashCoverage) * 2.5) + (25 - frictionIndex))
      : 0;

    // 5. Friction Sources (Top IVE items)
    const frictionSources = criticalItems
      .sort((a, b) => b.iveScore - a.iveScore)
      .slice(0, 4)
      .map(item => ({
        name: item.descricao.length > 20 ? item.descricao.substring(0, 17) + '...' : item.descricao,
        value: Math.round((item.iveScore / totalFrictionIve) * frictionIndex * 10) / 10 || 0,
        impact: item.iveScore > 400 ? 'High' : 'Medium'
      }));

    // 6. Early Warnings
    const warnings = diagnostics
      .filter(d => d.iveScore > 300 && (d.swot === 'Ameaça' || d.swot === 'Fraqueza'))
      .slice(0, 2)
      .map(d => ({
        id: d.id,
        title: `Alerta: ${d.descricao}`,
        desc: `Impacto crítico detectado no eixo ${d.eixo}. Risco de comprometimento do ${d.efeitoFinanceiro}.`,
        severity: d.iveScore > 500 ? 'high' : 'medium',
        axis: d.eixo
      }));

    return {
      frictionIndex: Math.round(frictionIndex * 10) / 10,
      estimatedLoss,
      resonanceData,
      alignmentScore: Math.round(avgMaturity),
      humanLeverage: Math.round(humanLeverage * 100) / 100,
      perenityIndex: Math.round(perenity),
      frictionSources,
      warnings,
      valuationPremium: Math.round((avgMaturity / 100) * 30), // Max 30% premium
      ebitda
    };
  }, [indicators, diagnostics, loadingInd, loadingDiag, selectedMonth, selectedYear, hasFinancialData, hasDiagnosticData, kpis]);

  if (loadingInd || loadingDiag) {
    return <DashboardSkeleton />;
  }

  if (!hasFinancialData && !hasDiagnosticData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-executive-fade w-full">
         <div className="w-32 h-32 rounded-md bg-executive flex items-center justify-center text-secondary shadow-premium relative">
            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 animate-pulse" />
            <Cpu size={64} className="relative z-10" />
         </div>
         <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
            <h2 className="text-h1 font-medium text-foreground tracking-tight">Inteligência Sistêmica Indisponível</h2>
            <p className="text-muted-foreground w-full max-w-2xl mx-auto font-medium leading-relaxed italic">
              Para gerar os índices de perenidade, atrito e multiplicadores, é necessário que os dados financeiros do período e o diagnóstico de governança estejam populados no sistema.
            </p>
         </div>
         <div className="flex gap-4">
            <div className="px-4 md:px-6 py-2 md:py-3 bg-surface-container rounded-md flex items-center gap-2 border border-border">
               <div className="w-2 h-2 rounded-full bg-border" />
               <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">Aguardando Dados Financeiros</span>
            </div>
            <div className="px-4 md:px-6 py-2 md:py-3 bg-surface-container rounded-md flex items-center gap-2 border border-border">
               <div className="w-2 h-2 rounded-full bg-border" />
               <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">Aguardando Diagnóstico SWOT/IVE</span>
            </div>
         </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-10 pb-20 animate-executive-fade">
      <PageHeader 
        title="Inteligência Sistêmica" 
        subtitle="Visão integrada de alavancagem, atrito operacional e ressonância estratégica C-Level."
        icon={Cpu}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest block mb-1">Score de Integração</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium text-secondary">{stats.alignmentScore}%</span>
                <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${stats.alignmentScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-card border border-border rounded-md shadow-sm flex items-center gap-2">
            <Sparkles size={14} className="text-secondary" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Análise Multidimensional Ativa</span>
          </div>
        </div>
      </div>


      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Radar de Ressonância Estratégica */}
        <div className="card-premium p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[10px] font-medium text-primary uppercase tracking-widest flex items-center gap-2">
                <ArrowRightLeft size={16} className="text-secondary" />
                Ressonância entre Eixos
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">Alinhamento de maturidade por área de gestão.</p>
            </div>
            <Info size={16} className="text-muted-foreground/30" />
          </div>
          
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.resonanceData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted-foreground)', fontSize: 9, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Maturidade"
                  dataKey="A"
                  stroke="var(--color-secondary)"
                  strokeWidth={3}
                  fill="var(--color-secondary)"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: 'var(--shadow-premium)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-surface-container rounded-md border border-border text-[11px] leading-relaxed text-muted-foreground italic">
            {stats.alignmentScore > 80 
              ? "Alta ressonância estratégica detectada. A organização opera em harmonia, com baixa perda de energia entre departamentos."
              : "Desalinhamento detectado em alguns eixos críticos. Riscos de silos e ineficiências na execução da estratégia global."}
          </div>
        </div>

        {/* Índice de Atrito Sistêmico (Invisible Tax) */}
        <div className="card-premium p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[10px] font-medium text-primary uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-warning" />
                Atrito Sistêmico (Taxa Invisível)
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest">EBITDA drenado por ineficiências reais documentadas.</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-medium text-destructive">{stats.frictionIndex}%</span>
               <span className="text-[8px] font-medium text-muted-foreground block uppercase tracking-widest">Perda do EBITDA</span>
            </div>
          </div>

          <div className="h-[250px] w-full mb-6">
            {stats.frictionSources.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.frictionSources} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontWeight: 500 }} width={120} />
                  <Tooltip 
                     contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)', boxShadow: 'var(--shadow-premium)' }}
                     formatter={(val) => [`${val}%`, 'Contribuição no Atrito']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {stats.frictionSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact === 'High' ? 'var(--color-destructive)' : 'var(--color-warning)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-success gap-2 opacity-50">
                 <ShieldCheck size={48} />
                 <p className="text-[10px] font-medium uppercase tracking-widest">Zero Atrito Crítico Detectado</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
             <div className={cn(
               "flex items-center justify-between p-3 rounded-md border",
               stats.frictionIndex > 10 ? "bg-destructive/10 border-destructive/20" : "bg-success/10 border-success/20"
             )}>
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-widest",
                  stats.frictionIndex > 10 ? "text-destructive" : "text-success"
                )}>Impacto Financeiro Estimado</span>
                <span className={cn(
                  "text-sm font-medium",
                  stats.frictionIndex > 10 ? "text-destructive" : "text-success"
                )}>{formatCurrency(stats.estimatedLoss)} / período</span>
             </div>
             <p className="text-[10px] text-muted-foreground text-center italic uppercase tracking-widest">
                *Cálculo baseado na Matriz IVE de itens de diagnóstico ativos.
             </p>
          </div>
        </div>

        {/* Perenidade e Alavancagem */}
        <div className="flex flex-col gap-8">
           {/* Card Alavancagem */}
           <div className="bg-executive p-8 rounded-md text-white relative overflow-hidden group h-1/2">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all" />
              <div className="relative z-10">
                <h3 className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={14} className="text-secondary" />
                  Multiplicador de Capital Humano
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-medium text-white tracking-tighter">{stats.humanLeverage}x</span>
                  <span className="text-xs font-medium text-success">{stats.humanLeverage > 1.2 ? 'Alta Eficiência' : 'Média Eficiência'}</span>
                </div>
                <p className="mt-4 text-xs text-white/60 leading-relaxed italic">
                  Sua operação gera <strong>{Math.round((stats.humanLeverage - 1) * 100)}% mais valor</strong> operacional (EBITDA) por unidade de custo com pessoas.
                </p>
              </div>
           </div>

           {/* Card Perenidade */}
           <div className="card-premium p-8 overflow-hidden group h-1/2">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><ShieldCheck size={100} /></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-secondary" />
                  Índice de Perenidade (10 Anos)
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-medium text-foreground tracking-tighter">{stats.perenityIndex}%</span>
                  <div className="h-12 w-1.5 bg-surface-container rounded-full overflow-hidden">
                     <div className="h-full bg-secondary" style={{ height: `${stats.perenityIndex}%`, alignSelf: 'flex-end' }} />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground leading-relaxed italic">
                  <MarkdownText text="Estabilidade calculada via correlação entre **Maturidade**, **Reserva de Caixa** e **Eficiência Operacional**." />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Early Warning System (Leading Indicators) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-h3 font-medium text-foreground flex items-center gap-3 tracking-tight">
              <Sparkles className="text-secondary" />
              Sinais Antecipados de Inteligência (Leading Indicators)
           </h2>
           {stats.warnings.length > 0 && (
             <span className="px-3 py-1 bg-warning/10 text-warning rounded-md text-[9px] font-medium uppercase tracking-widest">{stats.warnings.length} Alertas Ativos</span>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.warnings.length > 0 ? stats.warnings.map((alert: any) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-8 rounded-md border flex gap-6 group hover:shadow-premium transition-all",
                alert.severity === 'high' ? "bg-destructive/5 border-destructive/10" : "bg-warning/5 border-warning/10"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-md shrink-0 flex items-center justify-center shadow-inner",
                alert.severity === 'high' ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
              )}>
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-card rounded-md text-[8px] font-medium uppercase tracking-widest text-muted-foreground border border-border">Eixo: {alert.axis}</span>
                   <span className={cn(
                     "w-2 h-2 rounded-full",
                     alert.severity === 'high' ? "bg-destructive" : "bg-warning"
                   )} />
                </div>
                <h4 className="text-h4 font-medium text-foreground leading-tight tracking-tight">{alert.title}</h4>
                <p className="text-body-sm text-muted-foreground leading-relaxed italic">{alert.desc}</p>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-success/5 border border-success/10 rounded-md text-success gap-4">
               <ShieldCheck size={48} className="opacity-50" />
               <p className="text-body-sm font-medium uppercase tracking-widest">Nenhum risco sistêmico antecipado detectado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Valuation Premium Guard */}
      <div className="bg-executive p-12 rounded-md text-white relative overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
           <div className="space-y-8">
              <div>
                <h3 className="text-secondary font-medium text-[10px] uppercase tracking-widest mb-4">Múltiplo de Governança Estratégica</h3>
                <h2 className="text-5xl font-medium tracking-tight leading-tight">
                  Sua Governança agrega <span className="text-secondary">{stats.valuationPremium}% de Prêmio</span> no Valuation.
                </h2>
              </div>
              <p className="text-white/60 text-lg leading-relaxed italic">
                A maturidade sistêmica reduz o risco percebido pelo mercado, permitindo que o EBITDA seja precificado com um múltiplo superior à média do setor.
              </p>
              <div className="flex flex-wrap gap-4">
                 {[
                   { icon: ShieldCheck, label: 'Baixo Risco' },
                   { icon: Layers, label: 'Escalabilidade' },
                   { icon: Target, label: 'Previsibilidade' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md">
                      <item.icon size={14} className="text-secondary" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-10 rounded-md backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="text-[10px] font-medium uppercase tracking-widest">Impacto no Valor de Mercado</h4>
                 <Zap size={20} className="text-secondary" />
              </div>
              
              <div className="space-y-10">
                 <div>
                    <div className="flex justify-between text-[10px] font-medium text-white/40 uppercase mb-4 tracking-widest">
                       <span>Mercado Padrão</span>
                       <span>Score Base</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full">
                       <div className="h-full bg-white/40 w-[70%] rounded-full" />
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-[10px] font-medium text-secondary uppercase mb-4 tracking-widest">
                       <span>Illumine Signature</span>
                       <span>+{stats.valuationPremium}% Premium</span>
                    </div>
                    <div className="h-3 bg-secondary/20 rounded-full">
                       <div className="h-full bg-secondary w-full rounded-full shadow-premium" />
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Aumento Patrimonial Estimado</span>
                    <span className="text-2xl font-medium text-white tracking-tight">
                      {formatCurrency(stats.ebitda * 12 * (stats.valuationPremium / 100))}
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
