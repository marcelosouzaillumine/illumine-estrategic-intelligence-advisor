import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  Users, 
  Coins, 
  Scale, 
  Layers, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { useAllFinancialData } from '../../../hooks/useFinancialData';
import { useInstitutionalRuntime } from '../../../hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '../../../lib/utils';
import { PageHeader } from '../../Common';

interface RiskExposureCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function RiskExposureCenter({ selectedClient, selectedYear }: RiskExposureCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();

  // Fetch historical data for runtime analysis
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(selectedClient || '');

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

  const brmInference = useMemo(() => {
    return runtimeOutput?.inferences?.['BoardRiskMatrixAdapter'];
  }, [runtimeOutput]);

  const brmMetrics = brmInference?.metrics || {};
  const {
    boardRiskScore = 70,
    institutionalIntegrityLevel = 'Stable Governance Structure',
    bankingReadinessScore = 70,
    bankingReadinessLevel = 'Financeable',
    alerts = [],
    explainability = {},
    auditability = {},
    dimensions = {
      treasury: 70,
      earnings: 70,
      survivability: 70,
      governance: 70,
      capital: 70,
      stability: 70
    },
    divergence = {
      cqs: 70,
      eqs: 70,
      divergenceScore: 0
    },
    intensidadePartesRelacionadas = 0,
    leverageRatio = 0,
    stDebtRatio = 0
  } = brmMetrics;

  const radarData = useMemo(() => {
    return [
      { subject: 'Treasury Integrity', value: dimensions.treasury },
      { subject: 'Earnings Integrity', value: dimensions.earnings },
      { subject: 'Operational Survivability', value: dimensions.survivability },
      { subject: 'Governance Exposure', value: dimensions.governance },
      { subject: 'Capital Structure', value: dimensions.capital },
      { subject: 'Stability', value: dimensions.stability }
    ];
  }, [dimensions]);

  if (loadingHistory || runtimeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide uppercase">Consolidando Matriz de Risco Fiduciário...</span>
      </div>
    );
  }

  const getScoreColor = (val: number) => {
    return val >= 85 ? 'text-emerald-400' :
           val >= 70 ? 'text-yellow-400' :
           val >= 50 ? 'text-amber-500' : 'text-rose-500';
  };

  const getScoreBg = (val: number) => {
    return val >= 85 ? 'bg-success-soft0/10 border-emerald-500/20 text-emerald-400' :
           val >= 70 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
           val >= 50 ? 'bg-warning-soft0/10 border-amber-500/20 text-amber-500' :
           'bg-critical-soft0/10 border-rose-500/20 text-rose-500';
  };

  const getStatusLabel = (val: number) => {
    return val >= 85 ? 'ESTÁVEL' :
           val >= 70 ? 'MODERADO' :
           val >= 50 ? 'ALTO' : 'CRÍTICO';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      {/* Page Header */}
      <PageHeader 
        title="Board Risk Matrix (BRM)"
        subtitle="Painel de Risco Corporativo e Legitimidade Fiduciária para Conselhos de Administração."
        icon={ShieldAlert}
        transparent
        actions={
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1">Status de Auditoria</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Monitoramento Ativo</span>
            </div>
          </div>
        }
      />

      {/* Row 1: Key Metrics & Divergence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board Risk Score Gauge */}
        <div className="card-premium p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Board Risk Score</span>
              <span className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border", getScoreBg(boardRiskScore))}>
                {getStatusLabel(boardRiskScore)}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn("text-5xl font-light tracking-tight", getScoreColor(boardRiskScore))}>{boardRiskScore}</span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-light">
              Nível Geral: <span className="font-semibold text-muted-foreground">{institutionalIntegrityLevel}</span>
            </p>
          </div>
          <div className="border-t border-border pt-4 mt-6">
            <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
              <div 
                className={cn("h-1.5 rounded-full transition-all duration-1000", 
                  boardRiskScore >= 85 ? 'bg-emerald-400' :
                  boardRiskScore >= 70 ? 'bg-yellow-400' :
                  boardRiskScore >= 50 ? 'bg-warning-soft0' : 'bg-critical-soft0'
                )}
                style={{ width: `${boardRiskScore}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium tracking-wide uppercase">Consolidação Ponderada das 6 Dimensões Corporativas</p>
          </div>
        </div>

        {/* Banking Readiness Score */}
        <div className="card-premium p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Banking Readiness</span>
              <span className={cn("px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border", getScoreBg(bankingReadinessScore))}>
                {bankingReadinessScore >= 70 ? 'FINANCEÁVEL' : 'RESTRITO'}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn("text-5xl font-light tracking-tight", getScoreColor(bankingReadinessScore))}>{bankingReadinessScore}</span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-light">
              Classificação: <span className="font-semibold text-muted-foreground">{bankingReadinessLevel}</span>
            </p>
          </div>
          <div className="border-t border-border pt-4 mt-6">
            <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
              <div 
                className={cn("h-1.5 rounded-full transition-all duration-1000", 
                  bankingReadinessScore >= 85 ? 'bg-emerald-400' :
                  bankingReadinessScore >= 70 ? 'bg-sky-400' :
                  bankingReadinessScore >= 50 ? 'bg-warning-soft0' : 'bg-critical-soft0'
                )}
                style={{ width: `${bankingReadinessScore}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium tracking-wide uppercase">Capacidade e Resiliência frente a Credores</p>
          </div>
        </div>

        {/* Treasury vs Earnings Divergence */}
        <div className="card-premium p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Divergência: Caixa vs Lucro</span>
              {divergence.divergenceScore > 30 ? (
                <span className="bg-critical-soft0/10 border-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border">
                  Alto Descompasso
                </span>
              ) : (
                <span className="bg-success-soft0/10 border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border">
                  Sincronia Estável
                </span>
              )}
            </div>
            
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Qualidade de Caixa (CQS)</span>
                  <span className="font-semibold text-muted-foreground">{divergence.cqs}</span>
                </div>
                <div className="w-full bg-slate-850 rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full" style={{ width: `${divergence.cqs}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Qualidade do Lucro (EQS)</span>
                  <span className="font-semibold text-muted-foreground">{divergence.eqs}</span>
                </div>
                <div className="w-full bg-slate-850 rounded-full h-1">
                  <div className="bg-sky-400 h-1 rounded-full" style={{ width: `${divergence.eqs}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Divergência Absoluta:</span>
            <span className={cn("text-lg font-semibold", divergence.divergenceScore > 30 ? 'text-rose-400' : 'text-muted-foreground')}>
              {divergence.divergenceScore} pts
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Radar Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Matrix */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Radar de Exposição Executiva
          </h3>
          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar
                  name="Exposição"
                  dataKey="value"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Panel */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Heatmap de Vulnerabilidade Corporativa
          </h3>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <HeatmapBlock title="Treasury Integrity" score={dimensions.treasury} />
            <HeatmapBlock title="Earnings Integrity" score={dimensions.earnings} />
            <HeatmapBlock title="Operational Survivability" score={dimensions.survivability} />
            <HeatmapBlock title="Governance Exposure" score={dimensions.governance} />
            <HeatmapBlock title="Capital Structure" score={dimensions.capital} />
            <HeatmapBlock title="Stability" score={dimensions.stability} />
          </div>
        </div>
      </div>

      {/* Row 3: Alerts & Governance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts Feed */}
        <div className="lg:col-span-2 card-premium p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Alertas de Integridade e Conformidade Fiduciária
          </h3>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl">
                <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nenhum alerta crítico ativo no período</p>
              </div>
            ) : (
              alerts.map((alert: string, idx: number) => (
                <div key={idx} className="flex gap-3 p-4 bg-slate-950/40 border border-amber-500/20 rounded-xl items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase text-amber-500 tracking-wider">Aviso de Risco</span>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{alert}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Governance & Capital Exposure */}
        <div className="card-premium p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Métricas de Opacidade & Alavancagem
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Concentração Partes Relacionadas</span>
                <span className="font-semibold text-muted-foreground">{(intensidadePartesRelacionadas * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-850 rounded-full h-1.5">
                <div 
                  className={cn("h-1.5 rounded-full", intensidadePartesRelacionadas > 0.25 ? 'bg-rose-400' : 'bg-slate-500')} 
                  style={{ width: `${Math.min(100, intensidadePartesRelacionadas * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Alavancagem Financeira</span>
                <span className="font-semibold text-muted-foreground">{(leverageRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-850 rounded-full h-1.5">
                <div 
                  className={cn("h-1.5 rounded-full", leverageRatio > 0.5 ? 'bg-rose-400' : 'bg-slate-500')} 
                  style={{ width: `${Math.min(100, leverageRatio * 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Dívida de Curto Prazo (vs Total)</span>
                <span className="font-semibold text-muted-foreground">{(stDebtRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-850 rounded-full h-1.5">
                <div 
                  className={cn("h-1.5 rounded-full", stDebtRatio > 0.7 ? 'bg-rose-400' : 'bg-slate-500')} 
                  style={{ width: `${Math.min(100, stDebtRatio * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Explainability & Auditability Accordions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
          Transparência & Rastreabilidade de Score
        </h3>

        {/* Explainability Accordions */}
        <div className="border border-border rounded-xl overflow-hidden bg-slate-950/40">
          <div 
            onClick={() => toggleSection('explainability')}
            className="flex justify-between items-center p-5 cursor-pointer hover:bg-slate-900/50 transition-all select-none"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Explicabilidade por Dimensão (Model Formulary)</h4>
                <p className="text-xs text-muted-foreground mt-1">Fórmulas, bases, ajustes e racional para cada dimensão avaliada.</p>
              </div>
            </div>
            {expandedSection === 'explainability' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>

          {expandedSection === 'explainability' && (
            <div className="p-6 border-t border-border space-y-6 divide-y divide-slate-800/50">
              {Object.entries(explainability).map(([key, value]: [string, any]) => (
                <div key={key} className="pt-4 first:pt-0">
                  <h5 className="text-xs font-black uppercase text-primary tracking-wider mb-2">{key}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1"><span className="font-bold text-muted-foreground">Fórmula:</span> {value.formula}</p>
                      <p className="text-muted-foreground mb-1"><span className="font-bold text-muted-foreground">Origem:</span> {value.source}</p>
                      <p className="text-muted-foreground"><span className="font-bold text-muted-foreground">Rastro (Lineage):</span> {value.lineage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1"><span className="font-bold text-muted-foreground">Ajuste Fiduciário:</span> {value.adjustments}</p>
                      <p className="text-muted-foreground"><span className="font-bold text-muted-foreground">Racional Fiduciário:</span> {value.rationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auditability Trace */}
        <div className="border border-border rounded-xl overflow-hidden bg-slate-950/40">
          <div 
            onClick={() => toggleSection('auditability')}
            className="flex justify-between items-center p-5 cursor-pointer hover:bg-slate-900/50 transition-all select-none"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-sky-400" />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Trilha de Auditoria e Reconstrução Fiduciária</h4>
                <p className="text-xs text-muted-foreground mt-1">Evidências de reconciliação DFC x BP, origens e interpretações regulatórias.</p>
              </div>
            </div>
            {expandedSection === 'auditability' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>

          {expandedSection === 'auditability' && (
            <div className="p-6 border-t border-border space-y-4 text-xs text-muted-foreground">
              <p><span className="font-bold text-muted-foreground">Lógica de Reconciliação:</span> {auditability.reconciliationLogic}</p>
              <p><span className="font-bold text-muted-foreground">Rastro de Reconstrução:</span> {auditability.reconstructionTrace}</p>
              <p><span className="font-bold text-muted-foreground">Verificação Causal:</span> {auditability.lineageTrace}</p>
              <div className="p-3 bg-slate-950/60 border border-border rounded-lg text-[10px] text-muted-foreground font-mono">
                Lineage-Certified Trace ID: {(brmInference as any)?.lineageHash || 'No tracing hash generated'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HeatmapBlockProps {
  title: string;
  score: number;
}

function HeatmapBlock({ title, score }: HeatmapBlockProps) {
  const getBlockColor = (val: number) => {
    return val >= 85 ? 'from-emerald-950/30 to-emerald-900/10 border-emerald-500/20 text-emerald-400' :
           val >= 70 ? 'from-yellow-950/30 to-yellow-900/10 border-yellow-500/20 text-yellow-400' :
           val >= 50 ? 'from-amber-950/30 to-amber-900/10 border-amber-500/20 text-amber-500' :
           'from-rose-950/30 to-rose-900/10 border-rose-500/20 text-rose-400';
  };

  const getStatusLabel = (val: number) => {
    return val >= 85 ? 'ESTÁVEL' :
           val >= 70 ? 'MODERADO' :
           val >= 50 ? 'ALTO' : 'CRÍTICO';
  };

  return (
    <div className={cn("p-4 border rounded-xl flex flex-col justify-between bg-gradient-to-br transition-all hover:scale-[1.01]", getBlockColor(score))}>
      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{title}</span>
      <div className="flex justify-between items-baseline mt-4">
        <span className="text-2xl font-light">{score}</span>
        <span className="text-[9px] font-bold tracking-wider">{getStatusLabel(score)}</span>
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
}

function StatusCard({ title, value, icon, trend }: StatusCardProps) {
  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-border transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <div className="p-2 bg-slate-950/40 rounded-xl border border-border/10">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-light text-muted-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-bold">{trend}</div>
      </div>
    </div>
  );
}
