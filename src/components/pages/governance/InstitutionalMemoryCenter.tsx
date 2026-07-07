import React, { useState, useMemo } from 'react';
import { History, Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Clock, Scale, ShieldCheck, Brain } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface InstitutionalMemoryCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function InstitutionalMemoryCenter({ selectedClient, selectedYear }: InstitutionalMemoryCenterProps) {
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

  const memoryInference = useMemo(() => {
    return runtimeOutput?.inferences?.['InstitutionalMemoryEngine'];
  }, [runtimeOutput]);

  const metrics = memoryInference?.metrics || {};

  const {
    imsScore = 70,
    imsLevel = 'Transitional Institutional Consistency',
    trajectoryClassification = 'VOLATILE',
    isEarlyStage = false,
    domains = {
      treasury: { score: 70 },
      earnings: { score: 70 },
      governance: { score: 70 },
      advisory: { score: 70 },
      drift: { score: 70 },
      strategic: { score: 70 }
    },
    alerts = [],
    timeline = [],
    heatmaps = {
      treasury: [],
      governance: [],
      advisory: [],
      drift: [],
      strategic: [],
      recoveryMomentum: []
    },
    auditability = {}
  } = metrics;

  const radarData = useMemo(() => {
    return [
      { subject: 'Treasury Persistence', value: domains.treasury?.score ?? 70 },
      { subject: 'Earnings Recurrence', value: domains.earnings?.score ?? 70 },
      { subject: 'Governance Memory', value: domains.governance?.score ?? 70 },
      { subject: 'Advisory Compliance', value: domains.advisory?.score ?? 70 },
      { subject: 'Institutional Drift', value: domains.drift?.score ?? 70 },
      { subject: 'Strategic Consistency', value: domains.strategic?.score ?? 70 }
    ];
  }, [domains]);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide uppercase">Instanciando Camada de Memória Institucional...</span>
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
    return val >= 85 ? 'ORGANIZAÇÃO APRENDENTE' : val >= 70 ? 'ESTÁVEL' : val >= 50 ? 'TRANSIÇÃO' : 'CRÍTICO';
  };

  const getHeatmapBg = (val: number): string => {
    return val >= 85 ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
           val >= 70 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
           val >= 50 ? 'bg-warning-soft0/10 border-amber-500/20 text-amber-500' :
           'bg-critical-soft0/10 border-rose-500/20 text-rose-500';
  };

  const getMomentumBg = (momentum: string): string => {
    return momentum === 'ACCELERATING' ? 'bg-success-soft0/15 border-emerald-500/30 text-emerald-400' :
           momentum === 'STABILIZING' ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' :
           'bg-critical-soft0/15 border-rose-500/30 text-rose-500';
  };

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      ACTIVE: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      RESOLVED: 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400',
      MITIGATED: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      RECURRING: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      ESCALATED: 'bg-critical-soft0/10 border-rose-500/20 text-rose-500'
    };
    return maps[status] || 'bg-slate-800 border-border text-muted-foreground';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const currentLabelKey = getLabelKey(imsScore);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Centro de Memória Institucional"
        subtitle="Rastreabilidade e memória de governança fiduciária, consistência temporal e classificação longitudinal de trajetória."
        icon={History}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Status da Linhagem</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">IME downstream ativo</span>
            </div>
          </div>
        }
      />

      {/* Row 1: IMS Score & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* IMS score gauge and level card */}
        <div className="card-premium p-8 flex flex-col justify-between relative overflow-hidden group hover:border-border transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl pointer-events-none group-hover:bg-accent transition-all"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Longitudinal Memory</span>
                <h3 className="text-lg font-medium text-muted-foreground mt-1">Institutional Memory Score</h3>
              </div>
              <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border", scoreBgMap[currentLabelKey])}>
                {getStatusText(imsScore)}
              </span>
            </div>
            
            <div className="my-8 flex items-baseline gap-2">
              <span className={cn("text-7xl font-light tracking-tight transition-colors", scoreColorsMap[currentLabelKey])}>
                {imsScore}
              </span>
              <span className="text-muted-foreground text-sm font-medium">/100</span>
            </div>
            
            <div className="space-y-2 mt-6">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nível de Memória:</div>
              <div className="text-sm font-semibold text-muted-foreground">{imsLevel}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Ponderação determinística dos 6 pilares de integridade institucional ao longo do tempo.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6 flex justify-between items-center text-xs text-muted-foreground font-mono">
            <span>Trajetória:</span>
            <span className="font-bold text-muted-foreground uppercase">{trajectoryClassification}</span>
          </div>
        </div>

        {/* Radar Chart Card */}
        <div className="lg:col-span-2 card-premium p-8 flex flex-col justify-between hover:border-border transition-all duration-300">
          <div>
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Análise Radar</span>
            <h3 className="text-lg font-medium text-muted-foreground mt-1">Desempenho por Eixo de Memória</h3>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="currentColor" />
                <PolarAngleAxis dataKey="subject" stroke="currentColor" tick={{ fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="currentColor" tick={{ fontSize: 8 }} />
                <Radar name="Memory Score" dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-executive-primary)', borderRadius: '12px' }} 
                  labelStyle={{ color: 'var(--color-executive-primary)', fontSize: '11px', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--color-executive-primary)', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Warnings & Trajectory Diagnostics */}
      {alerts.length > 0 && (
        <div className="card-premium p-6 border-l-4 border-l-amber-500/70 bg-warning-soft0/5 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">Alertas de Risco Longitudinal Ativos</h4>
          </div>
          <ul className="space-y-2.5">
            {alerts.map((alert: string, idx: number) => (
              <li key={idx} className="text-xs text-muted-foreground font-medium leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning-soft0 mt-1.5 flex-shrink-0"></span>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Row 3: The 6 Heatmaps */}
      <div className="card-premium p-8 space-y-6">
        <div>
          <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Matrizes Cíclicas</span>
          <h3 className="text-lg font-medium text-muted-foreground mt-1">Série Temporal de Integridade (Heatmaps)</h3>
          <p className="text-xs text-muted-foreground mt-1">Evolução anual das dimensões reguladoras e do momento de recuperação.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Heatmap 1: Treasury Recurrence */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Treasury Recurrence</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.treasury?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-1", getHeatmapBg(h.score))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-xs font-bold font-mono">{h.score}</div>
                </div>
              ))}
              {(!heatmaps.treasury || heatmaps.treasury.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>

          {/* Heatmap 2: Governance Dependency */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Governance Dependency</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.governance?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-1", getHeatmapBg(h.score))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-xs font-bold font-mono">{h.score}</div>
                </div>
              ))}
              {(!heatmaps.governance || heatmaps.governance.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>

          {/* Heatmap 3: Advisory Neglect */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Advisory Neglect</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.advisory?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-1", getHeatmapBg(h.score))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-xs font-bold font-mono">{h.score}</div>
                </div>
              ))}
              {(!heatmaps.advisory || heatmaps.advisory.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>

          {/* Heatmap 4: Institutional Drift */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Institutional Drift</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.drift?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-1", getHeatmapBg(h.score))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-xs font-bold font-mono">{h.score}</div>
                </div>
              ))}
              {(!heatmaps.drift || heatmaps.drift.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>

          {/* Heatmap 5: Strategic Stability */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Strategic Stability</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.strategic?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-1", getHeatmapBg(h.score))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-xs font-bold font-mono">{h.score}</div>
                </div>
              ))}
              {(!heatmaps.strategic || heatmaps.strategic.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>

          {/* Heatmap 6: Recovery Momentum */}
          <div className="space-y-3 bg-slate-950/20 p-4 border border-border rounded-xl">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
              <span>Recovery Momentum</span>
              <span className="text-[10px] text-muted-foreground">Momentum</span>
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {heatmaps.recoveryMomentum?.map((h: any) => (
                <div key={h.year} className={cn("p-2 text-center rounded border flex flex-col justify-center gap-0.5", getMomentumBg(h.momentum))}>
                  <div className="text-[8px] font-mono opacity-60">{h.year}</div>
                  <div className="text-[9px] font-black font-mono leading-none tracking-tighter">{h.momentum}</div>
                </div>
              ))}
              {(!heatmaps.recoveryMomentum || heatmaps.recoveryMomentum.length === 0) && (
                <div className="col-span-5 text-center text-xs py-3 text-muted-foreground">Sem histórico</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Explainability Timeline */}
      <div className="card-premium p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">Linha do Tempo Fiduciária Explicável</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Mapeamento sequencial de desvios e resoluções</p>
          </div>
        </div>

        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-900">
          {timeline.map((phase: any, idx: number) => (
            <div key={idx} className="relative group space-y-2">
              <div className="absolute left-[-25px] top-1.5 w-3.5 h-3.5 rounded-full border border-primary bg-slate-950 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                <span className="text-primary font-mono">Ciclo {phase.period}</span>
                <span>•</span>
                <span>Origem: {phase.engine}</span>
                <span>•</span>
                <span>Referência: {phase.metric}</span>
              </div>

              <div className="flex justify-between items-start">
                <h4 className="text-xs font-semibold text-muted-foreground">{phase.advisory}</h4>
                <span className={cn("px-2.5 py-0.5 rounded-xl text-[9px] font-black tracking-widest uppercase border", getStatusBadge(phase.status))}>
                  {phase.status}
                </span>
              </div>

              <ul className="space-y-1.5">
                {phase.events.map((evt: string, eIdx: number) => (
                  <li key={eIdx} className="text-xs text-muted-foreground font-medium">{evt}</li>
                ))}
              </ul>

              <div className="text-[9px] text-muted-foreground font-mono">
                Persistência acumulada: {phase.duration} ciclo(s)
              </div>
            </div>
          ))}
          {timeline.length === 0 && (
            <div className="text-center italic text-muted-foreground text-xs py-8">
              Nenhum evento registrado no histórico fiduciário longitudinal.
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Reconciliation Accordions */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rastreabilidade Fiduciária e Auditoria</h4>
        
        {/* Trace 1 */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button 
            onClick={() => toggleSection('lineage')}
            className="w-full flex justify-between items-center p-5 bg-slate-950/20 text-left text-sm font-semibold text-muted-foreground hover:bg-slate-950/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Rastreabilidade de Linhagem Contábil (Lineage Trace)
            </span>
            {expandedSection === 'lineage' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSection === 'lineage' && (
            <div className="p-6 bg-slate-950/40 border-t border-border space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                Os seguintes eixos de dados contábeis foram normalizados e reconciliados sequencialmente para alimentar a memória fiduciária:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-border font-mono text-muted-foreground">
                {auditability.lineage || 'BP.PL, BP.NetDebt, BP.AtivoCirculante, BP.PassivoCirculante, DFC.FCO, DRE.EBITDA'}
              </div>
              <p className="text-[10px] text-muted-foreground">
                *Toda modificação na base original invalida a cadeia de linhagem, forçando o runtime a fail-closed preventivo.
              </p>
            </div>
          )}
        </div>

        {/* Trace 2 */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button 
            onClick={() => toggleSection('logic')}
            className="w-full flex justify-between items-center p-5 bg-slate-950/20 text-left text-sm font-semibold text-muted-foreground hover:bg-slate-950/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-insight" />
              Racional fiduciário de pesos e atenuadores (IMS)
            </span>
            {expandedSection === 'logic' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSection === 'logic' && (
            <div className="p-6 bg-slate-950/40 border-t border-border space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                A nota compostada final de Memória Institucional pondera as vulnerabilidades longitudinais:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-border font-mono text-muted-foreground">
                {auditability.reconstructionLogic || 'IMS = (Treasury * 0.20) + (Earnings * 0.20) + (Governance * 0.15) + (Advisory * 0.15) + (Drift * 0.15) + (Strategic * 0.15)'}
              </div>
              <p>
                Atenuador Early-Stage: {isEarlyStage ? 'ATIVADO (<3 ciclos históricos)' : 'DESATIVADO (Maturidade temporal suficiente)'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
