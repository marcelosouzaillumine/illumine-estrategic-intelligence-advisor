import React from 'react';
import { Scale, Activity, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSummarySection } from '@/components/ui/executive-summary-section';
import { ExecutiveTechnicalEvidenceSection } from '@/components/executive-architecture/executive-technical-evidence-section';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { useCapitalGovernanceViewModel } from '@/viewmodels/governance/useCapitalGovernanceViewModel';
import { cn, formatCurrency } from '@/lib/utils';

interface CapitalGovernanceCenterProps {
  clients?: any[];
  selectedClient?: string;
  selectedYear?: number;
}

// ── Score Ring Component (Refatorado para Design System Tokens Canônicos) ──
function CgsScoreRing({ value, label, status }: { value: number; label: string; status: string }) {
  const r = 50, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  
  const getBadgeVariant = (v: number) => {
    if (v >= 85) return 'success';
    if (v >= 70) return 'info';
    if (v >= 50) return 'warning';
    return 'critical';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="8"
            strokeDasharray={`${c} ${c}`} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div className="absolute flex flex-col items-center">
          <ExecutiveHeading as="h3" className="text-3xl text-foreground">
            {Math.round(value)}
          </ExecutiveHeading>
          <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-bold text-[9px]">Score</ExecutiveText>
        </div>
      </div>
      <div className="text-center flex flex-col items-center gap-1">
        <ExecutiveText as="div" variant="caption" className="text-muted-foreground">{label}</ExecutiveText>
        <ExecutiveBadge variant={getBadgeVariant(value)}>
          {status}
        </ExecutiveBadge>
      </div>
    </div>
  );
}

export function CapitalGovernanceCenter({ selectedClient, selectedYear }: CapitalGovernanceCenterProps) {
  const { state, computed } = useCapitalGovernanceViewModel({ selectedClient, selectedYear });
  const { loading } = state;
  const {
    cgeInference,
    cgeMetrics,
    cgs,
    cgsStatus,
    cpi,
    cpiStatus,
    cdi,
    ddi,
    ddiStatus,
    eri,
    eriStatus,
    trajectory,
    capitalSocial,
    patrimonioLiquido,
    netIncome,
    dividendos,
    renderedNetIncome,
    renderedCapitalSocial,
    renderedPreservation,
    renderedIntegrity,
    renderedResilience,
    runtimeNetIncome,
    runtimeCapitalSocial,
    runtimePreservation,
    runtimeIntegrity,
    runtimeResilience,
    hasMismatches,
    radarData,
    historicalDependencyList,
    trajectoryTimeline,
    translateCpiStatus
  } = computed;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary" />
        <ExecutiveText as="span" variant="caption" className="font-medium tracking-wide uppercase">Instanciando Fiduciary Capital Governance Runtime...</ExecutiveText>
      </div>
    );
  }

  return (
    <ExecutivePageTemplate header={{ title: "Centro de Governança de Capital (CGE)", description: "Auditoria fiduciária da base societária, políticas de dividendos, retenção de lucros e sustentabilidade patrimonial.", icon: Scale }}>

      {/* BLOCO 1 (EAC): Executive Summary Section */}
      <ExecutiveSummarySection
        status={{
          label: cgsStatus,
          variant: cgs >= 85 ? 'success' : cgs >= 70 ? 'info' : cgs >= 50 ? 'warning' : 'critical'
        }}
        question="Qual é a saúde fiduciária da estrutura societária e capacidade de sustentação patrimonial?"
        opinion={cgeInference?.narrative?.diagnostic || `O Capital Governance Score atual é de ${Math.round(cgs)}/100 (${cgsStatus}). A trajetória patrimonial está classificada como ${trajectory}.`}
        driver={cgeInference?.narrative?.driver || `Preservação patrimonial calculada em ${cgeMetrics.capitalPreservation !== undefined ? `${Number(cgeMetrics.capitalPreservation).toFixed(2)}%` : `${(cpi * 100).toFixed(2)}%`}.`}
        implication={cgeInference?.narrative?.impact || "Inconsistências entre distribuição de dividendos e necessidade de aporte societário podem gerar fragilidade de liquidez."}
        action={cgeInference?.narrative?.recommendation || "Fortalecer retenção de lucros operacionais e calibrar a política de dividendos para preservar o Patrimônio Líquido."}
        technicalScore={{
          value: Math.round(cgs),
          confidence: 'Alta'
        }}
      />

      {/* BLOCO 2 (EAC): Score Gauge & Radar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        
        {/* CGS Gauge Card */}
        <ExecutiveSurface variant="default" padding="lg" className="flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Capital Governance Engine</ExecutiveText>
                <ExecutiveHeading as="h3" className="text-foreground mt-1">Capital Governance Score</ExecutiveHeading>
              </div>
            </div>
            
            <div className="my-8 flex justify-center">
              <CgsScoreRing 
                value={cgs} 
                label={cgsStatus} 
                status={cgs >= 70 ? 'Aprovado' : 'Atenção'} 
              />
            </div>

            <ExecutiveText as="p" variant="bodyStandard" className="text-muted-foreground text-center">
              {cgeInference?.narrative?.diagnostic || 'Parecer de governança estruturado upstream.'}
            </ExecutiveText>
          </div>

          <div className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center">
            <ExecutiveText as="span" variant="caption" className="text-muted-foreground uppercase font-semibold">Trajetória Atual:</ExecutiveText>
            <ExecutiveBadge variant="info">{trajectory}</ExecutiveBadge>
          </div>
        </ExecutiveSurface>

        {/* Capital Structure Radar Chart */}
        <ExecutiveSurface variant="default" padding="lg" className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <ExecutiveHeading as="h3" className="text-foreground mb-1">Radar de Governança de Capital</ExecutiveHeading>
            <ExecutiveText as="div" variant="caption" className="text-muted-foreground">Evolução e conformidade em 6 eixos fiduciários estruturais.</ExecutiveText>
          </div>
          
          <div className="h-[280px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="currentColor" className="text-border/60" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary, #475569)', fontSize: 10, fontWeight: '600' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--color-text-muted, #64748B)', fontSize: 8 }} />
                <Radar
                  name="Maturidade Patrimonial"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ExecutiveSurface>

      </div>

      {/* BLOCO 3 (EAC): Capital Preservation Panel */}
      <div className="space-y-4 mt-8">
        <div className="border-b border-border/40 pb-3">
          <ExecutiveHeading as="h2" className="text-foreground">Painel de Preservação Patrimonial</ExecutiveHeading>
          <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 mt-1 font-medium">Soberania do Capital Social e integridade do Patrimônio Líquido frente a prejuízos ou capitalizações.</ExecutiveText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
          <ExecutiveMetricCard
            label="Lucro Líquido do Exercício"
            value={netIncome !== null && netIncome !== undefined ? formatCurrency(netIncome) : <span className="text-lg font-bold tracking-tight text-foreground truncate block">Não identificado</span>}
            description="Base para distribuição"
            tone="neutral"
            className="h-full"
          />

          <ExecutiveMetricCard
            label="Capital Social Integralizado"
            value={formatCurrency(capitalSocial)}
            description="Base de captação societária"
            tone="info"
            className="h-full"
          />

          <ExecutiveMetricCard
            label="Patrimônio Líquido Final"
            value={formatCurrency(patrimonioLiquido)}
            description={translateCpiStatus(cpiStatus)}
            tone={cpiStatus.includes('Erosion') || cpiStatus.includes('Collapse') ? 'critical' : 'success'}
            className="h-full"
          />

          <ExecutiveMetricCard
            label="Preservação Patrimonial"
            value={cgeMetrics.capitalPreservation !== undefined ? `${Number(cgeMetrics.capitalPreservation).toFixed(2)}%` : `${(cpi * 100).toFixed(2)}%`}
            description="PL Fim / Capital Social"
            tone="success"
            className="h-full"
          />

          <ExecutiveMetricCard
            label="Erosão Patrimonial"
            value={cgeMetrics.capitalErosion !== undefined ? `${Number(cgeMetrics.capitalErosion).toFixed(2)}%` : `${((1 - cpi) * 100).toFixed(2)}%`}
            description="1 - Preservação"
            tone="critical"
            className="h-full"
          />
        </div>
      </div>

      {/* BLOCO 4 (EAC): Heatmap & Retention Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Heatmap Section */}
        <ExecutiveSurface variant="default" padding="lg" className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <ExecutiveHeading as="h3" className="text-foreground mb-1">Histórico de Dependência de Aporte dos Sócios</ExecutiveHeading>
            <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-200 mb-4 font-medium">Análise longitudinal da necessidade de reinjeção de capital próprio para sustentação operacional.</ExecutiveText>
          </div>

          <div className="space-y-3">
            {historicalDependencyList.map(item => (
              <div key={item.year} className="flex justify-between items-center p-3 bg-muted/20 border border-border/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <ExecutiveText as="span" variant="caption" className="font-bold text-foreground">{item.year}</ExecutiveText>
                  <ExecutiveText as="div" variant="caption" className="text-slate-700 dark:text-slate-300 font-semibold">
                    Aportes: <span className="text-foreground font-bold">{formatCurrency(item.injections)}</span>
                  </ExecutiveText>
                </div>
                <div className="flex items-center gap-4">
                  <ExecutiveText as="span" variant="caption" className="text-slate-700 dark:text-slate-300 font-semibold">CDI: {(item.cdi * 100).toFixed(1)}%</ExecutiveText>
                  <ExecutiveBadge variant={
                    item.status === 'Independent' ? 'success' :
                    item.status === 'Moderate Dependency' ? 'warning' : 'critical'
                  }>
                    {item.status === 'Independent' ? 'Independente' : item.status === 'Moderate Dependency' ? 'Dependência Moderada' : 'Alta Dependência'}
                  </ExecutiveBadge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border/40 space-y-2">
            <ExecutiveText as="div" variant="bodyStandard" className="text-slate-800 dark:text-slate-200 font-medium">
              Fidelidade societária elevada reduz o risco de colapso, contudo, a dependência recorrente de capitalização indica ineficiência na geração de caixa operacional.
            </ExecutiveText>
            {cgeMetrics.capitalizationDependency && (
              <div className="bg-muted/30 p-2.5 rounded-xl border border-border/40 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                <span className="font-bold text-foreground">Auditoria do Índice de Capitalização:</span><br />
                Fórmula: {cgeMetrics.capitalizationDependency.formula} ({formatCurrency(cgeMetrics.capitalizationDependency.numerator)} ÷ {formatCurrency(cgeMetrics.capitalizationDependency.denominator)}) = <span className="text-primary font-bold">{cgeMetrics.capitalizationDependency.value}%</span> ({cgeMetrics.capitalizationDependency.classification})
              </div>
            )}
          </div>
        </ExecutiveSurface>

        {/* Retention & Distribution Board */}
        <ExecutiveSurface variant="default" padding="lg" className="flex flex-col justify-between">
          <div>
            <ExecutiveHeading as="h3" className="text-foreground mb-4">Política de Retenção & Dividendos</ExecutiveHeading>
            
            <div className="space-y-4">
              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <div className="flex justify-between items-center">
                  <ExecutiveText as="span" variant="caption" className="text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">Taxa de Retenção (ERI)</ExecutiveText>
                  <ExecutiveBadge variant="info">{eriStatus === 'NOT_APPLICABLE' ? 'Não Aplicável' : eriStatus}</ExecutiveBadge>
                </div>
                <ExecutiveHeading as="h4" className="text-foreground mt-1">
                  {eri === 'NOT_APPLICABLE' ? 'Não Aplicável' : `${((eri as number) * 100).toFixed(1)}%`}
                </ExecutiveHeading>
              </div>

              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <div className="flex justify-between items-center">
                  <ExecutiveText as="span" variant="caption" className="text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">Taxa de Distribuição (DDI)</ExecutiveText>
                  <ExecutiveBadge variant="info">{ddiStatus === 'NOT_APPLICABLE' ? 'Não Aplicável' : ddiStatus}</ExecutiveBadge>
                </div>
                <ExecutiveHeading as="h4" className="text-foreground mt-1">
                  {ddi === 'NOT_APPLICABLE' ? 'Não Aplicável' : `${((ddi as number) * 100).toFixed(1)}%`}
                </ExecutiveHeading>
              </div>

              <div className="p-3 bg-muted/20 border border-border/40 rounded-xl">
                <ExecutiveText as="span" variant="caption" className="text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">Dividendos / Lucro Líquido</ExecutiveText>
                <ExecutiveText as="p" variant="bodyStandard" className="font-semibold text-foreground mt-1">
                  {formatCurrency(dividendos)} / {netIncome !== null && netIncome !== undefined ? formatCurrency(netIncome) : 'Não identificado'}
                </ExecutiveText>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold uppercase pt-4 border-t border-border/40 mt-4">
            CGE Fiduciary Rules • v1.0
          </div>
        </ExecutiveSurface>

      </div>

      {/* BLOCO 5 (EAC): Technical Layer (ExecutiveTechnicalEvidenceSection) */}
      <ExecutiveTechnicalEvidenceSection aria-label="Auditoria de Linhagem da Governança de Capital" className="mt-8">
        <ExecutiveSurface variant="default" padding="lg">
          <div className="flex justify-between items-center mb-4">
            <ExecutiveHeading as="h3" className="text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Auditoria de Linhagem da Governança de Capital
            </ExecutiveHeading>
            {hasMismatches && (
              <ExecutiveBadge variant="critical">
                Divergência de Dados Auditada
              </ExecutiveBadge>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-[10px] text-muted-foreground uppercase font-black">
                  <th className="py-3 px-4">Métrica</th>
                  <th className="py-3 px-4">Fonte</th>
                  <th className="py-3 px-4">Consumido (Runtime)</th>
                  <th className="py-3 px-4">Renderizado (UI)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-3 px-4 font-semibold text-foreground">Lucro Líquido</td>
                  <td className="py-3 px-4">DRE</td>
                  <td className="py-3 px-4">{runtimeNetIncome !== null && runtimeNetIncome !== undefined ? formatCurrency(runtimeNetIncome) : 'N/A'}</td>
                  <td className="py-3 px-4">{renderedNetIncome !== null && renderedNetIncome !== undefined ? formatCurrency(renderedNetIncome) : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <ExecutiveBadge variant={renderedNetIncome === runtimeNetIncome ? 'success' : 'critical'}>
                      {renderedNetIncome === runtimeNetIncome ? 'Consistente' : 'Inconsistente'}
                    </ExecutiveBadge>
                  </td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 px-4 font-semibold text-foreground">Capital Social</td>
                  <td className="py-3 px-4">BP</td>
                  <td className="py-3 px-4">{runtimeCapitalSocial !== null && runtimeCapitalSocial !== undefined ? formatCurrency(runtimeCapitalSocial) : 'N/A'}</td>
                  <td className="py-3 px-4">{renderedCapitalSocial !== null && renderedCapitalSocial !== undefined ? formatCurrency(renderedCapitalSocial) : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <ExecutiveBadge variant={renderedCapitalSocial === runtimeCapitalSocial ? 'success' : 'critical'}>
                      {renderedCapitalSocial === runtimeCapitalSocial ? 'Consistente' : 'Inconsistente'}
                    </ExecutiveBadge>
                  </td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 px-4 font-semibold text-foreground">Preservação Patrimonial</td>
                  <td className="py-3 px-4">CGE</td>
                  <td className="py-3 px-4">{runtimePreservation !== null && runtimePreservation !== undefined ? `${runtimePreservation.toFixed(2)}%` : 'N/A'}</td>
                  <td className="py-3 px-4">{renderedPreservation !== null && renderedPreservation !== undefined ? `${renderedPreservation.toFixed(2)}%` : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <ExecutiveBadge variant={renderedPreservation === runtimePreservation ? 'success' : 'critical'}>
                      {renderedPreservation === runtimePreservation ? 'Consistente' : 'Inconsistente'}
                    </ExecutiveBadge>
                  </td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="py-3 px-4 font-semibold text-foreground">Integridade Patrimonial</td>
                  <td className="py-3 px-4">CGE</td>
                  <td className="py-3 px-4">{runtimeIntegrity !== null && runtimeIntegrity !== undefined ? `${runtimeIntegrity.toFixed(0)}` : 'N/A'}</td>
                  <td className="py-3 px-4">{renderedIntegrity !== null && renderedIntegrity !== undefined ? `${renderedIntegrity.toFixed(0)}` : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <ExecutiveBadge variant={renderedIntegrity === runtimeIntegrity ? 'success' : 'critical'}>
                      {renderedIntegrity === runtimeIntegrity ? 'Consistente' : 'Inconsistente'}
                    </ExecutiveBadge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">Resiliência de Capital</td>
                  <td className="py-3 px-4">CGE</td>
                  <td className="py-3 px-4">{runtimeResilience !== null && runtimeResilience !== undefined ? `${runtimeResilience.toFixed(0)}` : 'N/A'}</td>
                  <td className="py-3 px-4">{renderedResilience !== null && renderedResilience !== undefined ? `${renderedResilience.toFixed(0)}` : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <ExecutiveBadge variant={renderedResilience === runtimeResilience ? 'success' : 'critical'}>
                      {renderedResilience === runtimeResilience ? 'Consistente' : 'Inconsistente'}
                    </ExecutiveBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ExecutiveSurface>
      </ExecutiveTechnicalEvidenceSection>

      {/* Linha de Trajetória Patrimonial Timeline */}
      <ExecutiveSurface variant="default" padding="lg" className="mt-8">
        <ExecutiveHeading as="h3" className="text-foreground mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Linha de Trajetória Patrimonial
        </ExecutiveHeading>

        <div className="relative pl-6 border-l border-border/40 space-y-6 my-4">
          {trajectoryTimeline.map(item => {
            const isActive = trajectory.toUpperCase() === item.state;
            return (
              <div key={item.state} className="relative">
                {/* Timeline Dot */}
                <div className={cn("absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all",
                  isActive ? "bg-primary border-primary ring-4 ring-primary/20" : "bg-card border-border"
                )}>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                </div>
                
                {/* Content */}
                <div className={cn("p-4 border rounded-2xl transition-all duration-300",
                  isActive ? item.color : "border-border/40 text-muted-foreground bg-muted/10"
                )}>
                  <div className="flex justify-between items-center">
                    <ExecutiveText as="span" variant="caption" className="font-bold uppercase tracking-widest">{item.state}</ExecutiveText>
                    {isActive && <ExecutiveBadge variant="info">Estado Atual</ExecutiveBadge>}
                  </div>
                  <ExecutiveText as="div" variant="bodyStandard" className="mt-1">{item.label}</ExecutiveText>
                </div>
              </div>
            );
          })}
        </div>
      </ExecutiveSurface>

    </ExecutivePageTemplate>
  );
}
