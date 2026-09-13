


import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { RealDataValidationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { RealDataValidationPanel } from '../../../../components/enterprise-validation/RealDataValidationPanel';
import { EnterpriseReadinessDashboard } from '../../../../components/enterprise-validation/EnterpriseReadinessDashboard';
import { InstitutionalUXInsights } from '../../../../components/enterprise-validation/InstitutionalUXInsights';
import { PilotReadinessPanel } from '../../../../components/enterprise-validation/PilotReadinessPanel';
import { OperationalPlaybookViewer } from '../../../../components/enterprise-validation/OperationalPlaybookViewer';
import { CommercialPackagingViewer } from '../../../../components/enterprise-validation/CommercialPackagingViewer';
import { RuntimeIntegrityStatus } from '../../../../components/enterprise-validation/RuntimeIntegrityStatus';
import { InstitutionalDeploymentMap } from '../../../../components/enterprise-validation/InstitutionalDeploymentMap';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useEnterpriseValidationPageViewModel } from '../../../../viewmodels/useEnterpriseValidationPageViewModel';

export function EnterpriseValidationPage() {
  // Adapter: useEnterpriseValidationPageAdapter
  // ViewModel: useEnterpriseValidationPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useEnterpriseValidationPageViewModel();
  const portal = createPortal;
  const tenantId = 'TENANT-GOLDEN-VALIDATION';
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    RealDataValidationEngine.clearSandbox(tenantId);
    
    // Inicia simulação com Golden Dataset
    RealDataValidationEngine.initializeValidation(tenantId);
    setInitialized(true);

    return () => {
      RealDataValidationEngine.clearSandbox(tenantId);
    };
  }, [tenantId]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-body-sm font-medium uppercase tracking-widest">Inicializando Enterprise Validation Sandbox...</span>
      </div>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Hardening Institucional",
      description: "Validação de dados reais em sandbox, observabilidade de UX Executiva e prontidão comercial.",
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE VALIDAÇÃO ENTERPRISE) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Hardening Concluído', variant: 'success' }}
        question="Qual o grau de maturidade e prontidão da infraestrutura corporativa?"
        opinion="O comitê fiduciário homologa os testes de integridade, atestando a robustez do ambiente sandbox enterprise."
        driver="Integridade de dados reais, UX executiva, telemetria de negócios e mapa de implantação."
        implication="Garantia de operação em ambiente de produção com zero fricção técnica."
        executiveQuestion="Autorizar a transição do ambiente de sandbox para produção plena."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Validação Habilitada" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Prontidão e Hardening"
        subtitle="Analise os testes de integridade operacional e telemetria de negócios."
        variant="analytics"
        defaultExpanded
      >

      <EnterpriseReadinessDashboard tenantId={tenantId} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RealDataValidationPanel tenantId={tenantId} />
        <RuntimeIntegrityStatus tenantId={tenantId} />
        <InstitutionalUXInsights tenantId={tenantId} />
        
        <PilotReadinessPanel tenantId={tenantId} />
        <OperationalPlaybookViewer tenantId={tenantId} />
        <CommercialPackagingViewer tenantId={tenantId} />
      </div>

      <InstitutionalDeploymentMap tenantId={tenantId} />
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
