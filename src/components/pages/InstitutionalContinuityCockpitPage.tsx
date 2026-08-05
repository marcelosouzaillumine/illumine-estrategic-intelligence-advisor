import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Loader2, Milestone, Server, Shield, CheckCircle2, AlertTriangle, AlertOctagon, HeartPulse } from 'lucide-react';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalLifecycleSurface } from '../institutional-continuity/InstitutionalLifecycleSurface';
import { FiduciaryContinuityPanel } from '../institutional-continuity/FiduciaryContinuityPanel';
import { RecoveryRegressionTimeline } from '../institutional-continuity/RecoveryRegressionTimeline';
import { ResilienceAntifragilityRadar } from '../institutional-continuity/ResilienceAntifragilityRadar';
import { FiduciaryRestrictionOverlay } from '../institutional-continuity/FiduciaryRestrictionOverlay';
import { InstitutionalTrajectoryGraph } from '../institutional-continuity/InstitutionalTrajectoryGraph';
import { ExecutiveContinuityNarrativePanel } from '../institutional-continuity/ExecutiveContinuityNarrativePanel';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useInstitutionalContinuityCockpitPageViewModel } from '../../viewmodels/useInstitutionalContinuityCockpitPageViewModel';
import { useExecutivePage } from '../../hooks/useExecutivePage';

interface CockpitProps {
  clientId?: string;
  selectedYear?: number;
  selectedMonth?: number;
}

export function InstitutionalContinuityCockpitPage({ clientId, selectedYear, selectedMonth }: CockpitProps) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalContinuityCockpitPageViewModel({ clientId: clientId || '' });
  const filterYear = selectedYear || new Date().getFullYear();

  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE } = useAnnualFinancialData(clientId || '', filterYear, 'DRE');
  const { dbData: dbDataBP, loading: loadingBP } = useAnnualFinancialData(clientId || '', filterYear, 'BP');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId || '');

  const loading = loadingDRE || loadingBP || loadingHistory;

  useExecutivePage({
    domain: 'Governance',
    module: 'Institutional Continuity',
    capability: 'Cockpit de Continuidade de Negócios & Resiliência',
    title: 'Cockpit de Continuidade de Negócios & Resiliência',
    description: 'Monitoramento de ciclos de vida institucional, antifragilidade e proteção contra interrupções.',
    breadcrumbs: ['Governance', 'Institutional Continuity', 'Cockpit'],
    companyId: clientId,
    period: filterYear.toString(),
    filters: { year: filterYear }
  });

  if (!clientId) {
    return (
      <ExecutivePageTemplate header={{ title: "Cockpit de Continuidade", description: "Selecione uma empresa para carregar." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="text-center py-20 bg-card border border-border">
          <HeartPulse size={48} className="mx-auto mb-4 text-primary" />
          <ExecutiveHeading as="h3" className="text-foreground mb-2">Selecione uma Empresa</ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-md mx-auto">
            Selecione uma organização fiduciária ativa no topo da página para carregar o cockpit de continuidade.
          </ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Cockpit de Continuidade de Negócios & Resiliência",
      description: "Monitoramento de ciclos de vida institucional, antifragilidade e proteção contra interrupções.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CONTINUIDADE DE NEGÓCIOS) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Continuidade Homologada', variant: 'success' }}
          question="Como está o nível de resiliência e a proteção contra interrupções fiduciárias ou operacionais?"
          opinion="O comitê fiduciário homologa o plano de continuidade de negócios, validando o nível de antifragilidade e as travas de recuperação de desastres."
          driver="Índice de resiliência, modo de sobrevivência ativo, tempo estimado de recuperação e travas fiduciárias."
          implication="Garantia de perpetuidade do negócio mesmo sob choques sistêmicos graves."
          executiveQuestion="Executar testes de simulação de failover e recuperação a cada semestre."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & RADAR DE RESILIÊNCIA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Modo de Sobrevivência"
            value="Normal / Estável"
            statusBadge={<ExecutiveBadge variant="success">Operacional</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Sem Travas Ativas</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Score de Antifragilidade"
            value="Estável"
            statusBadge={<ExecutiveBadge variant="info">Fiduciário</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Capacidade de Absorção de Choque</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E TRAJETÓRIA LONGIUTDINAL --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Linhagem e Failover"
          subtitle="Linha do Tempo de Regressão e Diagnóstico de Resiliência"
          description="Controle analítico de evidências contábeis e recuperação estrutural."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <ExecutiveHeading as="h4" className="text-foreground mb-2">Trilha de Rastreio e Linha do Tempo</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Toda alteração nos indicadores de continuidade é envelopada e auditada pelo barramento fiduciário.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="animate-spin w-8 h-8 text-primary mb-3" />
      <span className="text-xs font-bold uppercase tracking-wider">Avaliando Linhagem e Continuidade...</span>
    </div>
  );
}
