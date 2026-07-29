import React from 'react';
import { Compass, ShieldCheck, AlertTriangle, TrendingUp, Activity, CheckCircle2, Target } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { ExecutiveDecisionOutput } from '../../services/ExecutiveRuntimeAdapter';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { useExecutiveDecisionCenterViewModel } from '../../viewmodels/useExecutiveDecisionCenterViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

interface ExecutiveDecisionCenterProps {
  executionIntelligence: any;
  executiveDecision: ExecutiveDecisionOutput | null;
  scenarioComparisons: any[];
}

export function ExecutiveDecisionCenter({ executionIntelligence, executiveDecision, scenarioComparisons }: ExecutiveDecisionCenterProps) {
  const { state, computed, actions } = useExecutiveDecisionCenterViewModel({ clientId: '' });
  
  return (
    <ExecutivePageTemplate header={{
      title: "Centro de Decisão Executiva (War Room)",
      description: "Síntese automatizada de recomendação fiduciária e arbitragem de cenários estratégicos.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DO CENTRO DE DECISÃO) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Decisão Pronta (Decision Ready)', variant: 'success' }}
          question="Qual o cenário estratégico recomendado com maior retorno ajustado ao risco fiduciário?"
          opinion="O comitê fiduciário homologa a recomendação executiva do War Room, indicando o cenário de expansão controlada como a diretiva soberana."
          driver="Valor de empresa (Enterprise Value), nível de confiança estatística, trade-offs e requisitos de capital."
          implication="Maximização da criação de valor patrimonial com controle rigoroso de riscos operacionais."
          action="Pautar a aprovação do plano de investimento no Conselho de Administração."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE DECISÃO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Cenário Recomendado"
            value={executiveDecision?.recommendedScenario || 'Base Recomendada'}
            statusBadge={<ExecutiveBadge variant="success">Recomendação Diretiva</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Nível de Confiança"
            value={executiveDecision?.confidenceLevel || 'Alta'}
            statusBadge={<ExecutiveBadge variant="info">Estatístico</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Valor Econômico Gerado"
            value={formatCurrency(12500000)}
            statusBadge={<ExecutiveBadge variant="warning">Enterprise Value</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E RANKEAMENTO DE CENÁRIOS --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Matriz de Trade-offs e Rankeamento"
          subtitle="Análise Comparativa de Cenários e Regras EFOS"
          description="Detalhamento de ganhos esperados, requisitos e justificativa de escolha do algoritmo."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
            <ExecutiveHeading as="h4" className="text-foreground mb-2">Narrativa Executiva de Decisão</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-relaxed">
              {executiveDecision?.executiveSummary || 'A síntese de recomendação fiduciária avalia a maximização do retorno livre de risco com base nos limites de capital de giro.'}
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
