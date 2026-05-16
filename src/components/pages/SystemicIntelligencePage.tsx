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
import { DiagnosticoItem, EixoGestao } from '../../types/modules';
import { PageHeader, MarkdownText } from '../Common';

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

export function SystemicIntelligencePage({ clientId, selectedMonth, selectedYear }: SystemicIntelligencePageProps) {
  const { data: indicators, loading: loadingInd } = useModuleData<any>('indicators', clientId);
  const { data: diagnostics, loading: loadingDiag } = useModuleData<DiagnosticoItem>('diagnostico', clientId);

  const hasFinancialData = useMemo(() => {
    return indicators.some((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
  }, [indicators, selectedYear, selectedMonth]);

  const hasDiagnosticData = useMemo(() => {
    return diagnostics.length > 0;
  }, [diagnostics]);

  const stats = useMemo(() => {
    if (loadingInd || loadingDiag) return null;
    if (!hasFinancialData && !hasDiagnosticData) return null;

    // Filter indicators for the current period
    const currentInds = indicators.filter((i: any) => i.ano === selectedYear && i.mes === selectedMonth);
    
    // Financial metrics
    const ebitda = currentInds.find((i: any) => i.ind === 'EBITDA')?.val || 0;
    const revenue = currentInds.find((i: any) => i.ind === 'Receita Líquida')?.val || 0;
    const personnel = currentInds.find((i: any) => i.ind === 'Custo com Pessoal')?.val || 0;
    const cash = currentInds.find((i: any) => i.ind === 'Saldo em Caixa')?.val || 0;

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
  }, [indicators, diagnostics, loadingInd, loadingDiag, selectedMonth, selectedYear, hasFinancialData, hasDiagnosticData]);

  if (loadingInd || loadingDiag) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="text-secondary animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processando Inteligência Sistêmica...</p>
      </div>
    );
  }

  if (!hasFinancialData && !hasDiagnosticData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-executive-fade">
         <div className="w-32 h-32 rounded-[48px] bg-slate-900 flex items-center justify-center text-secondary shadow-2xl relative">
            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20 animate-pulse" />
            <Cpu size={64} className="relative z-10" />
         </div>
         <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Inteligência Sistêmica Indisponível</h2>
            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
              Para gerar os índices de perenidade, atrito e multiplicadores, é necessário que os dados financeiros do período e o diagnóstico de governança estejam populados no sistema.
            </p>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-3 bg-slate-100 rounded-2xl flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-slate-300" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando Dados Financeiros</span>
            </div>
            <div className="px-6 py-3 bg-slate-100 rounded-2xl flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-slate-300" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aguardando Diagnóstico SWOT/IVE</span>
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
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Score de Integração</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-display font-black text-secondary">{stats.alignmentScore}%</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${stats.alignmentScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
            <Sparkles size={14} className="text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Análise Multidimensional Ativa</span>
          </div>
        </div>
      </div>


      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Radar de Ressonância Estratégica */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <ArrowRightLeft size={16} className="text-secondary" />
                Ressonância entre Eixos
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Alinhamento de maturidade por área de gestão.</p>
            </div>
            <Info size={16} className="text-slate-300" />
          </div>
          
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.resonanceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Maturidade"
                  dataKey="A"
                  stroke="#ff8552"
                  strokeWidth={3}
                  fill="#ff8552"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] leading-relaxed text-slate-600 italic">
            {stats.alignmentScore > 80 
              ? "Alta ressonância estratégica detectada. A organização opera em harmonia, com baixa perda de energia entre departamentos."
              : "Desalinhamento detectado em alguns eixos críticos. Riscos de silos e ineficiências na execução da estratégia global."}
          </div>
        </div>

        {/* Índice de Atrito Sistêmico (Invisible Tax) */}
        <div className="glass-card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                Atrito Sistêmico (Taxa Invisível)
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">EBITDA drenado por ineficiências reais documentadas.</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-display font-black text-rose-500">{stats.frictionIndex}%</span>
               <span className="text-[8px] font-bold text-slate-400 block uppercase">Perda do EBITDA</span>
            </div>
          </div>

          <div className="h-[250px] w-full mb-6">
            {stats.frictionSources.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.frictionSources} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} width={120} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     formatter={(val) => [`${val}%`, 'Contribuição no Atrito']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {stats.frictionSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact === 'High' ? '#f43f5e' : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-emerald-500 gap-2 opacity-50">
                 <ShieldCheck size={48} />
                 <p className="text-[10px] font-black uppercase">Zero Atrito Crítico Detectado</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
             <div className={cn(
               "flex items-center justify-between p-3 rounded-xl border",
               stats.frictionIndex > 10 ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
             )}>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  stats.frictionIndex > 10 ? "text-rose-700" : "text-emerald-700"
                )}>Impacto Financeiro Estimado</span>
                <span className={cn(
                  "text-sm font-bold",
                  stats.frictionIndex > 10 ? "text-rose-700" : "text-emerald-700"
                )}>{formatCurrency(stats.estimatedLoss)} / período</span>
             </div>
             <p className="text-[10px] text-slate-500 text-center italic">
                *Cálculo baseado na Matriz IVE de itens de diagnóstico ativos.
             </p>
          </div>
        </div>

        {/* Perenidade e Alavancagem */}
        <div className="flex flex-col gap-8">
           {/* Card Alavancagem */}
           <div className="bg-primary p-8 rounded-[32px] text-white relative overflow-hidden group h-1/2">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all"></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={14} className="text-secondary" />
                  Multiplicador de Capital Humano
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-black text-white">{stats.humanLeverage}x</span>
                  <span className="text-xs font-bold text-emerald-400">{stats.humanLeverage > 1.2 ? 'Alta Eficiência' : 'Média Eficiência'}</span>
                </div>
                <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                  Sua operação gera <strong>{Math.round((stats.humanLeverage - 1) * 100)}% mais valor</strong> operacional (EBITDA) por unidade de custo com pessoas.
                </p>
              </div>
           </div>

           {/* Card Perenidade */}
           <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm relative overflow-hidden group h-1/2">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><ShieldCheck size={100} /></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" />
                  Índice de Perenidade (10 Anos)
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-display font-black text-primary">{stats.perenityIndex}%</span>
                  <div className="h-12 w-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500" style={{ height: `${stats.perenityIndex}%`, alignSelf: 'flex-end' }}></div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                  <MarkdownText text="Estabilidade calculada via correlação entre **Maturidade**, **Reserva de Caixa** e **Eficiência Operacional**." />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Early Warning System (Leading Indicators) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Sparkles className="text-secondary" />
              Sinais Antecipados de Inteligência (Leading Indicators)
           </h2>
           {stats.warnings.length > 0 && (
             <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">{stats.warnings.length} Alertas Ativos</span>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.warnings.length > 0 ? stats.warnings.map((alert: any) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-8 rounded-[32px] border flex gap-6 group hover:shadow-elegant transition-all",
                alert.severity === 'high' ? "bg-rose-50/50 border-rose-100" : "bg-amber-50/50 border-amber-100"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center shadow-sm",
                alert.severity === 'high' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
              )}>
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-white rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">Eixo: {alert.axis}</span>
                   <span className={cn(
                     "w-2 h-2 rounded-full",
                     alert.severity === 'high' ? "bg-rose-500" : "bg-amber-500"
                   )}></span>
                </div>
                <h4 className="text-lg font-black text-slate-800 leading-tight">{alert.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{alert.desc}</p>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-emerald-50 border border-emerald-100 rounded-[32px] text-emerald-700 gap-4">
               <ShieldCheck size={48} className="opacity-50" />
               <p className="text-sm font-black uppercase tracking-widest">Nenhum risco sistêmico antecipado detectado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Valuation Premium Guard */}
      <div className="bg-slate-900 p-12 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
           <div className="space-y-8">
              <div>
                <h3 className="text-secondary font-black text-xs uppercase tracking-[0.4em] mb-4">Múltiplo de Governança Estratégica</h3>
                <h2 className="text-5xl font-display font-black tracking-tight leading-tight">
                  Sua Governança agrega <span className="text-secondary">{stats.valuationPremium}% de Prêmio</span> no Valuation.
                </h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                A maturidade sistêmica reduz o risco percebido pelo mercado, permitindo que o EBITDA seja precificado com um múltiplo superior à média do setor.
              </p>
              <div className="flex flex-wrap gap-4">
                 {[
                   { icon: ShieldCheck, label: 'Baixo Risco' },
                   { icon: Layers, label: 'Escalabilidade' },
                   { icon: Target, label: 'Previsibilidade' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                      <item.icon size={14} className="text-secondary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="text-sm font-black uppercase tracking-widest">Impacto no Valor de Mercado</h4>
                 <Zap size={20} className="text-secondary" />
              </div>
              
              <div className="space-y-10">
                 <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-4">
                       <span>Mercado Padrão (Sem Inteligência Sistêmica)</span>
                       <span>Score Base</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full">
                       <div className="h-full bg-slate-500 w-[70%] rounded-full"></div>
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-[10px] font-black text-secondary uppercase mb-4">
                       <span>Illumine Signature (Maturidade Integrada)</span>
                       <span>+{stats.valuationPremium}% Premium</span>
                    </div>
                    <div className="h-3 bg-secondary/20 rounded-full">
                       <div className="h-full bg-secondary w-full rounded-full shadow-[0_0_15px_rgba(255,133,82,0.5)]"></div>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Aumento Patrimonial Estimado</span>
                    <span className="text-2xl font-display font-black text-white">
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
