import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import React, { useState, useMemo } from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Activity, CheckCircle, Users, Coins, Scale, Layers, Compass, ChevronDown, ChevronUp, HelpCircle, TrendingDown, Info } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAllFinancialData } from '@/hooks/useFinancialData';
import { useInstitutionalRuntime } from '@/hooks/useInstitutionalRuntime';
import { cn, formatCurrency } from '@/lib/utils';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '@/components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '@/components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '@/components/ui/executive-technical-layer';

interface RiskExposureCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

export function RiskExposureCenter({ selectedClient, selectedYear }: RiskExposureCenterProps) {
  const filterYear = selectedYear || new Date().getFullYear();

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
    institutionalIntegrityLevel = 'Estrutura Estável de Governança',
    bankingReadinessScore = 70,
    bankingReadinessLevel = 'Financeável',
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
      { subject: 'Tesouraria', value: dimensions.treasury },
      { subject: 'Lucratividade', value: dimensions.earnings },
      { subject: 'Sobrevivência', value: dimensions.survivability },
      { subject: 'Governança', value: dimensions.governance },
      { subject: 'Estrutura de Capital', value: dimensions.capital },
      { subject: 'Estabilidade', value: dimensions.stability }
    ];
  }, [dimensions]);

  if (loadingHistory || runtimeLoading) {
    return (
      <ExecutivePageTemplate header={{ title: "Matriz de Riscos Fiduciários", description: "Consolidando Matriz de Risco Fiduciário..." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col items-center justify-center min-h-[300px] border-border bg-card">
          <Activity className="w-8 h-8 animate-pulse text-primary mb-3" />
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground font-bold uppercase tracking-wider">Consolidando Matriz de Risco Fiduciário...</ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  const getBadgeVariant = (val: number): 'success' | 'warning' | 'critical' | 'neutral' => {
    return val >= 85 ? 'success' : val >= 70 ? 'neutral' : val >= 50 ? 'warning' : 'critical';
  };

  const getStatusLabel = (val: number) => {
    return val >= 85 ? 'ESTÁVEL' : val >= 70 ? 'MODERADO' : val >= 50 ? 'ALTO' : 'CRÍTICO';
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ExecutivePageTemplate header={{ 
      title: "Painel de Risco Corporativo e Legitimidade Fiduciária", 
      description: "Matriz de risco corporativo, exposição de capital e legitimidade fiduciária para Conselhos de Administração.", 
      icon: ShieldAlert 
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DA MATRIZ DE RISCOS) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Matriz Auditada', variant: 'success' }}
        question="Qual a exposição consolidada a riscos fiduciários, operacionais e de estrutura de capital?"
        opinion="O comitê fiduciário homologa o Board Risk Score, validando a estabilidade da governança e a capacidade de bancabilidade da instituição."
        driver="Integridade de tesouraria, descompasso caixa vs lucro, alavancagem financeira e partes relacionadas."
        implication="Preservação da legitimidade corporativa e proteção do patrimônio dos sócios."
        action="Monitorar o descompasso entre caixa e lucro e mitigar a concentração de dívida de curto prazo."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      {/* --- CAMADA 2: DIRETORIA & KPIS DE RISCO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Board Risk Score Gauge */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase font-bold">Board Risk Score</ExecutiveText>
              <ExecutiveBadge variant={getBadgeVariant(boardRiskScore)}>
                {getStatusLabel(boardRiskScore)}
              </ExecutiveBadge>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black font-mono text-foreground">{boardRiskScore}</span>
              <span className="text-muted-foreground text-lg font-bold">/100</span>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground mt-4 font-medium">
              Nível Geral: <strong className="text-foreground">{institutionalIntegrityLevel}</strong>
            </ExecutiveText>
          </div>
          <div className="pt-4 border-t border-border mt-6">
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-border">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${boardRiskScore}%` }}
              />
            </div>
            <ExecutiveText variant="caption" className="text-muted-foreground mt-2">Consolidação Ponderada das 6 Dimensões Corporativas</ExecutiveText>
          </div>
        </ExecutiveSurface>

        {/* Banking Readiness Score */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase font-bold">Banking Readiness</ExecutiveText>
              <ExecutiveBadge variant={bankingReadinessScore >= 70 ? "success" : "warning"}>
                {bankingReadinessScore >= 70 ? 'FINANCEÁVEL' : 'RESTRITO'}
              </ExecutiveBadge>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-black font-mono text-foreground">{bankingReadinessScore}</span>
              <span className="text-muted-foreground text-lg font-bold">/100</span>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground mt-4 font-medium">
              Classificação: <strong className="text-foreground">{bankingReadinessLevel}</strong>
            </ExecutiveText>
          </div>
          <div className="pt-4 border-t border-border mt-6">
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-border">
              <div 
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${bankingReadinessScore}%` }}
              />
            </div>
            <ExecutiveText variant="caption" className="text-muted-foreground mt-2">Capacidade e Resiliência frente a Credores</ExecutiveText>
          </div>
        </ExecutiveSurface>

        {/* Treasury vs Earnings Divergence */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase font-bold">Divergência: Caixa vs Lucro</ExecutiveText>
              <ExecutiveBadge variant={divergence.divergenceScore > 30 ? "critical" : "success"}>
                {divergence.divergenceScore > 30 ? 'Alto Descompasso' : 'Sincronia Estável'}
              </ExecutiveBadge>
            </div>
            
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1 font-medium">
                  <span>Qualidade de Caixa (CQS)</span>
                  <span className="font-bold text-foreground font-mono">{divergence.cqs}</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 border border-border">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${divergence.cqs}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1 font-medium">
                  <span>Qualidade do Lucro (EQS)</span>
                  <span className="font-bold text-foreground font-mono">{divergence.eqs}</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 border border-border">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${divergence.eqs}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-6 flex justify-between items-center">
            <ExecutiveText variant="caption" className="text-muted-foreground">Divergência Absoluta:</ExecutiveText>
            <span className={cn("text-lg font-black font-mono", divergence.divergenceScore > 30 ? 'text-critical' : 'text-foreground')}>
              {divergence.divergenceScore} pts
            </span>
          </div>
        </ExecutiveSurface>
      </div>

      {/* Radar Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
          <ExecutiveHeading as="h3" className="text-foreground mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Radar de Exposição Executiva
          </ExecutiveHeading>
          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-foreground)', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-muted-foreground)' }} />
                <Radar
                  name="Exposição"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm flex flex-col justify-between">
          <ExecutiveHeading as="h3" className="text-foreground mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Heatmap de Vulnerabilidade Corporativa
          </ExecutiveHeading>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <HeatmapBlock title="Tesouraria" score={dimensions.treasury} />
            <HeatmapBlock title="Lucratividade" score={dimensions.earnings} />
            <HeatmapBlock title="Sobrevivência" score={dimensions.survivability} />
            <HeatmapBlock title="Governança" score={dimensions.governance} />
            <HeatmapBlock title="Estrutura de Capital" score={dimensions.capital} />
            <HeatmapBlock title="Estabilidade" score={dimensions.stability} />
          </div>
        </ExecutiveSurface>
      </div>

      {/* Alertas & Detalhamento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ExecutiveSurface padding="xl" radius="xl" className="lg:col-span-2 bg-card border border-border shadow-sm">
          <ExecutiveHeading as="h3" className="text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Alertas de Integridade e Conformidade Fiduciária
          </ExecutiveHeading>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl">
                <CheckCircle className="w-8 h-8 text-success mb-2" />
                <ExecutiveText variant="caption" className="text-muted-foreground">Nenhum alerta crítico ativo no período</ExecutiveText>
              </div>
            ) : (
              alerts.map((alert: string, idx: number) => (
                <div key={idx} className="flex gap-3 p-4 bg-surface-container/30 border border-border rounded-xl items-start">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase text-warning tracking-wider">Aviso de Risco</span>
                    <ExecutiveText variant="bodyStandard" className="text-foreground mt-1">{alert}</ExecutiveText>
                  </div>
                </div>
              ))
            )}
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
          <ExecutiveHeading as="h3" className="text-foreground mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Métricas de Opacidade & Alavancagem
          </ExecutiveHeading>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium">
                <span>Concentração Partes Relacionadas</span>
                <span className="font-bold text-foreground font-mono">{(intensidadePartesRelacionadas * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 border border-border">
                <div 
                  className={cn("h-full rounded-full", intensidadePartesRelacionadas > 0.25 ? 'bg-critical' : 'bg-primary')} 
                  style={{ width: `${Math.min(100, intensidadePartesRelacionadas * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium">
                <span>Alavancagem Financeira</span>
                <span className="font-bold text-foreground font-mono">{(leverageRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 border border-border">
                <div 
                  className={cn("h-full rounded-full", leverageRatio > 0.5 ? 'bg-critical' : 'bg-primary')} 
                  style={{ width: `${Math.min(100, leverageRatio * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium">
                <span>Dívida de Curto Prazo (vs Total)</span>
                <span className="font-bold text-foreground font-mono">{(stDebtRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 border border-border">
                <div 
                  className={cn("h-full rounded-full", stDebtRatio > 0.7 ? 'bg-critical' : 'bg-primary')} 
                  style={{ width: `${Math.min(100, stDebtRatio * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* --- CAMADA 3: CAMADA TÉCNICA E RASTREABILIDADE --- */}
      <ExecutiveTechnicalLayer
        title="Camada Técnica — Transparência & Rastreabilidade de Score"
        subtitle="Explicabilidade e Trilha de Auditoria Fiduciária"
        description="Fórmulas, bases de cálculo e reconstrução causal dos scores de risco."
        className="mb-8"
      >
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
          {/* Explainability Accordion */}
          <div className="border border-border rounded-xl overflow-hidden bg-surface-container/20">
            <div 
              onClick={() => toggleSection('explainability')}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-container/40 transition-all select-none"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <div>
                  <ExecutiveHeading as="h4" className="text-foreground">Explicabilidade por Dimensão (Model Formulary)</ExecutiveHeading>
                  <ExecutiveText variant="caption" className="text-muted-foreground mt-1">Fórmulas, bases, ajustes e racional para cada dimensão avaliada.</ExecutiveText>
                </div>
              </div>
              {expandedSection === 'explainability' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>

            {expandedSection === 'explainability' && (
              <div className="p-6 border-t border-border space-y-6 divide-y divide-border">
                {Object.entries(explainability).map(([key, value]: [string, any]) => (
                  <div key={key} className="pt-4 first:pt-0">
                    <h5 className="text-xs font-bold uppercase text-primary tracking-wider mb-2">{key}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <ExecutiveText variant="bodyStandard" className="text-muted-foreground mb-1"><strong className="text-foreground">Fórmula:</strong> {value.formula}</ExecutiveText>
                        <ExecutiveText variant="bodyStandard" className="text-muted-foreground mb-1"><strong className="text-foreground">Origem:</strong> {value.source}</ExecutiveText>
                        <ExecutiveText variant="bodyStandard" className="text-muted-foreground"><strong className="text-foreground">Rastro (Lineage):</strong> {value.lineage}</ExecutiveText>
                      </div>
                      <div>
                        <ExecutiveText variant="bodyStandard" className="text-muted-foreground mb-1"><strong className="text-foreground">Ajuste Fiduciário:</strong> {value.adjustments}</ExecutiveText>
                        <ExecutiveText variant="bodyStandard" className="text-muted-foreground"><strong className="text-foreground">Racional Fiduciário:</strong> {value.rationale}</ExecutiveText>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auditability Trace */}
          <div className="border border-border rounded-xl overflow-hidden bg-surface-container/20">
            <div 
              onClick={() => toggleSection('auditability')}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-container/40 transition-all select-none"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-primary" />
                <div>
                  <ExecutiveHeading as="h4" className="text-foreground">Trilha de Auditoria e Reconstrução Fiduciária</ExecutiveHeading>
                  <ExecutiveText variant="caption" className="text-muted-foreground mt-1">Evidências de reconciliação DFC x BP, origens e interpretações regulatórias.</ExecutiveText>
                </div>
              </div>
              {expandedSection === 'auditability' ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>

            {expandedSection === 'auditability' && (
              <div className="p-6 border-t border-border space-y-4 text-xs text-muted-foreground">
                <ExecutiveText variant="bodyStandard"><strong className="text-foreground">Lógica de Reconciliação:</strong> {auditability.reconciliationLogic}</ExecutiveText>
                <ExecutiveText variant="bodyStandard"><strong className="text-foreground">Rastro de Reconstrução:</strong> {auditability.reconstructionTrace}</ExecutiveText>
                <ExecutiveText variant="bodyStandard"><strong className="text-foreground">Verificação Causal:</strong> {auditability.lineageTrace}</ExecutiveText>
                <div className="p-3 bg-surface-container border border-border rounded-lg text-[10px] text-foreground font-mono">
                  Lineage-Certified Trace ID: {(brmInference as any)?.lineageHash || 'No tracing hash generated'}
                </div>
              </div>
            )}
          </div>
        </ExecutiveSurface>
      </ExecutiveTechnicalLayer>
    </ExecutivePageTemplate>
  );
}

function HeatmapBlock({ title, score }: { title: string; score: number }) {
  const getBadgeVariant = (val: number): 'success' | 'warning' | 'critical' | 'neutral' => {
    return val >= 85 ? 'success' : val >= 70 ? 'neutral' : val >= 50 ? 'warning' : 'critical';
  };

  const getStatusLabel = (val: number) => {
    return val >= 85 ? 'ESTÁVEL' : val >= 70 ? 'MODERADO' : val >= 50 ? 'ALTO' : 'CRÍTICO';
  };

  return (
    <div className="p-4 border border-border rounded-xl flex flex-col justify-between bg-surface-container/30 transition-all hover:border-primary/40">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
      <div className="flex justify-between items-baseline mt-4">
        <span className="text-2xl font-black font-mono text-foreground">{score}</span>
        <ExecutiveBadge variant={getBadgeVariant(score)}>
          {getStatusLabel(score)}
        </ExecutiveBadge>
      </div>
    </div>
  );
}
