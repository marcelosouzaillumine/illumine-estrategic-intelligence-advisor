import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Layers, 
  Database,
  ArrowRightLeft,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface EconomicNormalizationCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function EconomicNormalizationCenter({ selectedClient, selectedYear }: EconomicNormalizationCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // Fetch history data
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

  // Run runtime engines
  const { runtimeOutput, loading: runtimeLoading } = useInstitutionalRuntime({
    input: {
      clientId: selectedClient,
      rawFinancialData: {
        filterYear,
        allHistoryData
      }
    }
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const eneInference = useMemo(() => {
    return runtimeOutput?.inferences?.['EconomicNormalizationAdapter'];
  }, [runtimeOutput]);

  const eneMetrics = eneInference?.metrics || {};

  const {
    ensScore = 70,
    ensLevel = 'Transitional Economic Structure',
    ebitda = { contabil: 0, operacionalReal: 0, recorrente: 0, normalizado: 0, score: 70 },
    workingCapital = { contabil: 0, operacionalLiquidoAjustado: 0, liquidezAjustada: 0, dependenciaGiro: 0, score: 70 },
    roic = { contabil: 0, normalizado: 0, normalizadoStatus: 'OK', normalizadoReason: '', evaContabil: 0, evaEconomicoReal: 0, score: 70 },
    debt = { dividaFinanceiraReal: 0, passivosOperacionais: 0, passivosSocietarios: 0, passivosArtificiais: 0, pressaoCurtoPrazo: 0, dependenciaRefinanciamento: 0, score: 70 },
    margin = { margemEbitdaReal: 0, margemOperacionalAjustada: 0, margemRecorrente: 0, pressaoEstruturalCustos: 0, score: 70 },
    stability = { lossCyclesCount: 0, ebitdaVol: 0, score: 80 },
    alerts = [],
    isEarlyStage = false,
    auditability = {},
    receitasNaoRecorrentes = 0,
    impactosSocietarios = 0,
    estoques = 0,
    creditosSocios = 0,
    passivosArtificiais = 0
  } = eneMetrics;

  const radarData = useMemo(() => {
    return [
      { subject: 'EBITDA Integrity', value: ebitda.score ?? 70 },
      { subject: 'Working Capital', value: workingCapital.score ?? 70 },
      { subject: 'ROIC / EVA', value: roic.score ?? 70 },
      { subject: 'Debt Structure', value: debt.score ?? 70 },
      { subject: 'Margin Integrity', value: margin.score ?? 70 },
      { subject: 'Economic Stability', value: stability.score ?? 80 }
    ];
  }, [ebitda.score, workingCapital.score, roic.score, debt.score, margin.score, stability.score]);

  const comparisonChartData = useMemo(() => {
    return [
      {
        name: 'EBITDA',
        'Contábil': ebitda.contabil,
        'Normalizado': ebitda.normalizado
      },
      {
        name: 'Capital de Giro',
        'Contábil': workingCapital.contabil,
        'Ajustado': workingCapital.operacionalLiquidoAjustado
      }
    ];
  }, [ebitda.contabil, ebitda.normalizado, workingCapital.contabil, workingCapital.operacionalLiquidoAjustado]);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide uppercase">Instanciando Camada de Normalização Econômica...</span>
      </div>
    );
  }

  // Predefined score mapping to avoid inline computations
  const scoreColorsMap: Record<string, string> = {
    ESTAVEL: 'text-emerald-400',
    MODERADO: 'text-yellow-400',
    ALTO: 'text-amber-500',
    CRITICO: 'text-rose-500'
  };

  const scoreBgMap: Record<string, string> = {
    ESTAVEL: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
    MODERADO: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    ALTO: 'bg-warning-soft0/10 border-amber-500/20 text-amber-500',
    CRITICO: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
  };

  const getLabelKey = (val: number): string => {
    return val >= 85 ? 'ESTAVEL' : val >= 70 ? 'MODERADO' : val >= 50 ? 'ALTO' : 'CRITICO';
  };

  const getStatusText = (val: number): string => {
    return val >= 85 ? 'ESTÁVEL' : val >= 70 ? 'MODERADO' : val >= 50 ? 'ALTO' : 'CRÍTICO';
  };

  const getHeatmapDistortion = (val: number): string => {
    return val >= 85 ? 'LOW DISTORTION' : val >= 70 ? 'MODERATE DISTORTION' : val >= 50 ? 'HIGH DISTORTION' : 'CRITICAL DISTORTION';
  };

  const getHeatmapBg = (val: number): string => {
    return val >= 85 ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
           val >= 70 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
           val >= 50 ? 'bg-warning-soft0/10 border-amber-500/20 text-amber-500' :
           'bg-critical-soft0/10 border-rose-500/20 text-rose-500';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const currentLabelKey = getLabelKey(ensScore);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Centro de Normalização Econômica (ENE)"
        subtitle="Interpretação e conciliação de performance econômica real, expurgando distorções societárias e não recorrentes."
        icon={Scale}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Status do Runtime</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">ENE upstream ativo</span>
            </div>
          </div>
        }
      />

      {/* Row 1: ENS Score & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ENS score gauge and level card */}
        <div className="card-premium p-8 flex flex-col justify-between relative overflow-hidden group hover:border-border transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl pointer-events-none group-hover:bg-accent transition-all"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Fiduciary Intelligence</span>
                <h3 className="text-lg font-medium text-muted-foreground mt-1">Economic Normalization Score</h3>
              </div>
              <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", scoreBgMap[currentLabelKey])}>
                {getStatusText(ensScore)}
              </span>
            </div>
            
            <div className="my-8 flex items-baseline gap-2">
              <span className={cn("text-7xl font-light tracking-tight transition-colors", scoreColorsMap[currentLabelKey])}>
                {ensScore}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">
              {eneInference?.narrative?.diagnostic || 'ENE carregado e processado upstream.'}
            </p>
          </div>

          <div className="pt-6 border-t border-border/10">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground uppercase font-semibold">Classification:</span>
              <span className="text-muted-foreground font-bold uppercase tracking-wide">{ensLevel}</span>
            </div>
          </div>
        </div>

        {/* Recharts Radar for the 6 ENE dimensions */}
        <div className="card-premium p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Radar de Normalização Econômica</h3>
            <p className="text-[11px] text-muted-foreground font-light">Mapeamento de integridade e distorção estrutural em 6 eixos fiduciários.</p>
          </div>
          
          <div className="h-[280px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'medium' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
                <Radar
                  name="Integridade Real"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Comparison Cards (Normalized vs Accounting) */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-border/10 pb-4">
          <div>
            <h2 className="text-lg font-medium text-muted-foreground">Reconciliação e Expurgos Estruturais</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Comparativo entre dados declarados contábeis e a realidade econômica ajustada fiduciariamente.</p>
          </div>
          {isEarlyStage && (
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase">
              Early-Stage Attenuations Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* EBITDA Comparison */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-slate-900 border border-border/5 rounded-xl text-primary">
                  <Coins className="w-5 h-5" />
                </span>
                <span className={cn("text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full border", scoreBgMap[getLabelKey(ebitda.score)])}>
                  {ebitda.score}/100
                </span>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">EBITDA Normalizado</h4>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">Contábil Oficial:</span>
                  <span className="text-sm text-muted-foreground font-semibold">{formatCurrency(ebitda.contabil)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">Operacional Real:</span>
                  <span className="text-sm text-muted-foreground font-semibold">{formatCurrency(ebitda.operacionalReal)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-primary font-semibold">Normalizado ENE:</span>
                  <span className="text-base text-primary font-black">{formatCurrency(ebitda.normalizado)}</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed font-light">
              Expurga R$ {formatCurrency(receitasNaoRecorrentes)} em receitas extraordinárias e R$ {formatCurrency(Math.abs(impactosSocietarios))} em transações com partes relacionadas.
            </p>
          </div>

          {/* Working Capital Comparison */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-slate-900 border border-border/5 rounded-xl text-amber-500">
                  <Layers className="w-5 h-5" />
                </span>
                <span className={cn("text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full border", scoreBgMap[getLabelKey(workingCapital.score)])}>
                  {workingCapital.score}/100
                </span>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Capital de Giro Normalizado</h4>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">Giro Contábil:</span>
                  <span className="text-sm text-muted-foreground font-semibold">{formatCurrency(workingCapital.contabil)}</span>
                </div>
                <div className="flex justify-between items-baseline font-medium">
                  <span className="text-xs text-muted-foreground font-medium">Giro Operacional Líquido Ajustado:</span>
                  <span className="text-sm text-amber-500 font-semibold">{formatCurrency(workingCapital.operacionalLiquidoAjustado)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">Liquidez Ajustada:</span>
                  <span className="text-sm text-muted-foreground font-semibold">{workingCapital.liquidezAjustada.toFixed(2)}x</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed font-light">
              Desconta R$ {formatCurrency(estoques)} em estoques de baixa liquidez e R$ {formatCurrency(creditosSocios)} em mútuos/ativos com partes relacionadas.
            </p>
          </div>

          {/* ROIC Comparison */}
          <div className="card-premium p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-2 bg-slate-900 border border-border/5 rounded-xl text-emerald-400">
                  <Activity className="w-5 h-5" />
                </span>
                <span className={cn("text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full border", scoreBgMap[getLabelKey(roic.score)])}>
                  {roic.score}/100
                </span>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ROIC / EVA Normalizado</h4>
              
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">ROIC Contábil:</span>
                  <span className="text-sm text-muted-foreground font-semibold">{(roic.contabil * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">ROIC Normalizado:</span>
                  <span className="text-sm text-emerald-400 font-bold">
                    {roic.normalizadoStatus === 'NOT_COMPUTABLE' 
                      ? 'Não calculável com segurança fiduciária' 
                      : `${((roic.normalizado ?? 0) * 100).toFixed(1)}%`
                    }
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground font-medium">EVA Econômico Real:</span>
                  <span className="text-sm text-muted-foreground font-semibold">
                    {roic.evaEconomicoReal !== null ? formatCurrency(roic.evaEconomicoReal) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed font-light">
              Mede a rentabilidade real sobre o capital investido operacional puro, expurgando R$ {formatCurrency(creditosSocios + passivosArtificiais)} em capital artificial de relacionados.
            </p>
          </div>

        </div>
      </div>

      {/* Row 3: Distortion Heatmap & Alerts Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Distortion Heatmap Grid */}
        <div className="card-premium p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Distortion Heatmap</h3>
            <p className="text-[11px] text-muted-foreground font-light mb-4">Grau de distorção de aparência contábil detectada por dimensão econômica.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            {radarData.map(item => (
              <div key={item.subject} className="flex justify-between items-center p-3 bg-slate-950/20 border border-border/5 rounded-xl">
                <span className="text-xs font-medium text-muted-foreground">{item.subject}</span>
                <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border", getHeatmapBg(item.value))}>
                  {getHeatmapDistortion(item.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground font-light mt-4 pt-4 border-t border-border/10">
            Distorção CRÍTICA representa um gap de valor contábil vs real de alta severidade, enquanto distorção BAIXA valida a aderência da DRE/BP à realidade operacional.
          </div>
        </div>

        {/* ENE Active Alerts Log */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">ENE Alerts Feed</h3>
            
            {alerts.length > 0 ? (
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                {alerts.map((alert: string, idx: number) => (
                  <div key={idx} className="p-3 bg-critical-soft0/5 border border-rose-500/10 rounded-xl flex gap-3 items-start">
                    <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-400 font-light leading-normal">{alert}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/20" />
                <span className="text-[10px] font-black tracking-widest uppercase">Nenhum alerta de distorção ativo</span>
              </div>
            )}
          </div>

          <div className="text-[9px] font-mono text-muted-foreground uppercase pt-4 border-t border-border/10">
            ENE Signature Engine • v2.5.0
          </div>
        </div>

      </div>

      {/* Row 4: Debt & Margin Structure Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Debt Structure normalizations */}
        <div className="card-premium p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/10 pb-2">
            Detalhamento da Dívida e Alavancagem ENE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Dívida Financeira Real:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{formatCurrency(debt.dividaFinanceiraReal)}</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Passivos Operacionais:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{formatCurrency(debt.passivosOperacionais)}</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Passivos Societários:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{formatCurrency(debt.passivosSocietarios)}</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Passivos Artificiais:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{formatCurrency(debt.passivosArtificiais)}</p>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground font-light flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>Refinanciamento de Curto Prazo: <strong className="text-muted-foreground">{(debt.dependenciaRefinanciamento * 100).toFixed(1)}%</strong> da dívida financeira total.</span>
          </div>
        </div>

        {/* Margin Structure normalizations */}
        <div className="card-premium p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/10 pb-2">
            Detalhamento da Integridade de Margens
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Margem EBITDA Real:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{(margin.margemEbitdaReal * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Margem Operacional Ajustada:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{(margin.margemOperacionalAjustada * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Margem Recorrente:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{(margin.margemRecorrente * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-slate-900 border border-border/5 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Pressão de OPEX / SG&A:</span>
              <p className="text-sm font-bold text-muted-foreground mt-1">{(margin.pressaoEstruturalCustos * 100).toFixed(1)}%</p>
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground font-light flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>Volatilidade de EBITDA longitudinal: <strong className="text-muted-foreground">{(stability.ebitdaVol * 100).toFixed(1)}%</strong> ao longo dos anos.</span>
          </div>
        </div>

      </div>

      {/* Row 5: Explainability & Auditability Trace Accordions */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/10 pb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          Rastreabilidade Fiduciária e Trilhas de Auditoria (No-Black-Box)
        </h3>

        {/* EBITDA Accordion */}
        <div className="card-premium overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('ebitda')}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-950/20 transition-all"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              Trilha de Conciliação de EBITDA Normalizado
            </span>
            {expandedSection === 'ebitda' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'ebitda' && (
            <div className="px-6 pb-6 pt-2 border-t border-border/5 space-y-4 text-xs font-light text-muted-foreground animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Base Contábil Declarada:</span>
                  <p className="text-muted-foreground mt-1 font-mono">{formatCurrency(auditability.ebitda?.accountingBase ?? 0)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Linha de Evidência e Contas Fonte:</span>
                  <p className="text-muted-foreground mt-1 font-mono">{auditability.ebitda?.lineage ?? 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Rastro da Conciliação de Ajustes:</span>
                <p className="text-muted-foreground mt-1 font-mono bg-slate-950/40 p-3 rounded-lg border border-border/5">
                  {auditability.ebitda?.reconciliationTrace ?? 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Diretriz Fiduciária de Reconstrução:</span>
                <p className="text-muted-foreground mt-1">{auditability.ebitda?.reconstructionLogic ?? 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Racional Fiduciário:</span>
                <p className="text-muted-foreground mt-1">{auditability.ebitda?.fiduciaryRationale ?? 'N/A'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Working Capital Accordion */}
        <div className="card-premium overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('wc')}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-950/20 transition-all"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Trilha de Conciliação de Capital de Giro Operacional Líquido Ajustado
            </span>
            {expandedSection === 'wc' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'wc' && (
            <div className="px-6 pb-6 pt-2 border-t border-border/5 space-y-4 text-xs font-light text-muted-foreground animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Base Contábil de Giro:</span>
                  <p className="text-muted-foreground mt-1 font-mono">{formatCurrency(auditability.workingCapital?.accountingBase ?? 0)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Contas Patrimoniais e Linhas de Linhagem:</span>
                  <p className="text-muted-foreground mt-1 font-mono">{auditability.workingCapital?.lineage ?? 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Rastro da Conciliação de Ajustes:</span>
                <p className="text-muted-foreground mt-1 font-mono bg-slate-950/40 p-3 rounded-lg border border-border/5">
                  {auditability.workingCapital?.reconciliationTrace ?? 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Diretriz Fiduciária de Reconstrução:</span>
                <p className="text-muted-foreground mt-1">{auditability.workingCapital?.reconstructionLogic ?? 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Racional Fiduciário:</span>
                <p className="text-muted-foreground mt-1">{auditability.workingCapital?.fiduciaryRationale ?? 'N/A'}</p>
              </div>
            </div>
          )}
        </div>

        {/* ROIC Accordion */}
        <div className="card-premium overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('roic')}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-950/20 transition-all"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Trilha de Conciliação de ROIC / EVA Normalizado
            </span>
            {expandedSection === 'roic' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'roic' && (
            <div className="px-6 pb-6 pt-2 border-t border-border/5 space-y-4 text-xs font-light text-muted-foreground animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Base Contábil ROIC:</span>
                  <p className="text-muted-foreground mt-1 font-mono">
                    {auditability.roic?.accountingBase !== undefined ? `${((auditability.roic.accountingBase as number) * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Linhagem de Evidências Multilaterais:</span>
                  <p className="text-muted-foreground mt-1 font-mono">{auditability.roic?.lineage ?? 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Rastro da Conciliação de Ajustes:</span>
                <p className="text-muted-foreground mt-1 font-mono bg-slate-950/40 p-3 rounded-lg border border-border/5">
                  {auditability.roic?.reconciliationTrace ?? 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Diretriz Fiduciária de Reconstrução:</span>
                <p className="text-muted-foreground mt-1">{auditability.roic?.reconstructionLogic ?? 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Racional Fiduciário:</span>
                <p className="text-muted-foreground mt-1">{auditability.roic?.fiduciaryRationale ?? 'N/A'}</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
