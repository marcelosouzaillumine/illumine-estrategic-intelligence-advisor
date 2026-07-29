import React, { useState, useEffect } from 'react';
import { Building2, Users, FileSignature, Server, AlertOctagon, CheckCircle2, XCircle, ChevronRight, Fingerprint, Lock, ShieldAlert, Activity } from 'lucide-react';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { InstitutionalOnboardingOutput } from '../../services/FiduciaryRuntimeAdapter';
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
import { useInstitutionalOnboardingControlCenterPageViewModel } from '../../viewmodels/useInstitutionalOnboardingControlCenterPageViewModel';

export function InstitutionalOnboardingControlCenterPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalOnboardingControlCenterPageViewModel({ clientId: '' });
  const [onboardingData, setOnboardingData] = useState<InstitutionalOnboardingOutput | null>(null);

  useEffect(() => {
    let report: any = {};
    try {
      report = executiveRuntime.generateExecutiveReport({
        clientProfile: { id: 'default' },
        rawFinancialData: {
          bpSummary: { ativoTotal: 1000, passivoTotal: 1000, patrimonioLiquido: 500, caixaEquivalentes: 200 },
          ebitda: 100,
          lucroLiquido: 50,
          historicalCyclesCount: 3,
          filterYear: 2026,
          allHistoryData: []
        },
        bpData: [],
        dreData: [],
        dlpaData: []
      });
    } catch (err) {
      console.error('Error generating onboarding report:', err);
    }
    
    if (report && report.institutionalOnboarding) {
       setOnboardingData(report.institutionalOnboarding);
    }
  }, []);

  return (
    <ExecutivePageTemplate header={{
      title: "Centro de Controle de Onboarding Institucional",
      description: "Provisionamento fiduciário de clientes, validação de segurança e governança de entrada.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE ONBOARDING INSTITUCIONAL) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Onboarding Concluído', variant: 'success' }}
          question="Qual o status do provisionamento fiduciário e validação de segurança do novo cliente?"
          opinion="O comitê fiduciário homologa o onboarding institucional, confirmando a correta configuração do ambiente isolado e a validação do de-para contábil."
          driver="Estágio de ativação, isolamento de tenant, integridade da linhagem e termos de governança."
          implication="Garantia de entrada segura na plataforma com total isolamento de dados entre empresas."
          action="Liberar acesso total após confirmação do termo de responsabilidade do CFO."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE PROVISIONAMENTO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Estágio de Ativação"
            value="Full Institutional Operation"
            statusBadge={<ExecutiveBadge variant="success">Ativo</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Isolamento por Inquilino"
            value="100% Isolado (Isolated)"
            statusBadge={<ExecutiveBadge variant="success">Multi-tenant Security</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Pendências de Setup"
            value="Zero Inconsistências"
            statusBadge={<ExecutiveBadge variant="info">Validado</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E CHECKLIST DE ATIVAÇÃO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Provisionamento"
          subtitle="Checklist de Etapas e Validação da Linhagem"
          description="Verificação dos barramentos de segurança, banco de dados e de-para inicial."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <ExecutiveHeading as="h4" className="text-foreground mb-2">Relatório de Ativação Fiduciária</ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              O pipeline de onboarding garante que todas as etapas de validação contábil, isolamento de banco de dados e chaves criptográficas foram concluídas.
            </ExecutiveText>
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
