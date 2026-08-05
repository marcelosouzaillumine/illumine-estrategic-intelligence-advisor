import React, { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { useQuadroPessoalAdapter } from '../../../adapters/ui/useQuadroPessoalAdapter';
import { PageHeader, StatusBadge } from '../../Common';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { EmployeeManager } from '../../EmployeeManager';
import { DashboardSkeleton } from '../../ui/skeletons';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';
import { useQuadroPessoalPageViewModel } from '../../../viewmodels/useQuadroPessoalPageViewModel';

interface QuadroPessoalPageProps {
  clientId: string;
}

export function QuadroPessoalPage({ clientId }: QuadroPessoalPageProps) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useQuadroPessoalPageViewModel({ clientId });
  const { loading, employees } = useQuadroPessoalAdapter(clientId);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!clientId) {
    return (
      <ExecutivePageTemplate header={{ title: "Quadro de Pessoal", description: "Selecione uma empresa no topo da página." }}>
        <ExecutiveSurface padding="xl" radius="xl" className="text-center py-20 bg-card border border-border">
          <Users size={48} className="mx-auto mb-4 text-primary" />
          <ExecutiveHeading as="h3" className="text-foreground mb-2">Nenhuma Empresa Selecionada</ExecutiveHeading>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-md mx-auto">
            Selecione uma empresa no seletor de cliente ativo no topo da tela para gerenciar o quadro de pessoal.
          </ExecutiveText>
        </ExecutiveSurface>
      </ExecutivePageTemplate>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Quadro de Pessoal",
      description: "Gestão, headcount e cadastro de colaboradores da empresa.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE CAPITAL HUMANO) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Quadro Mapeado', variant: 'success' }}
          question="Como gerenciar a folha de pagamento, encargos e a eficiência do headcount corporativo?"
          opinion="O comitê fiduciário homologa a alocação de pessoal, o dimensionamento de headcount e o controle de despesas salariais."
          driver="Headcount total, folha salarial bruta, encargos trabalhistas e organograma por unidade."
          implication="Eficiência operacional, previsibilidade de custos com capital humano e conformidade trabalhista."
          executiveQuestion="Revisar o dimensionamento do headcount e os índices de turnover a cada início de trimestre."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2 & 3: DIRETORIA & CAMADA TÉCNICA DE COLABORADORES --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Gestão de Colaboradores"
          subtitle="Gerenciador de Headcount e Cadastro de Colaboradores"
          description="Controle analítico de cargos, proventos, centro de custos e vínculos contratuais."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <EmployeeManager clientId={clientId} clientConfig={{}} />
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
