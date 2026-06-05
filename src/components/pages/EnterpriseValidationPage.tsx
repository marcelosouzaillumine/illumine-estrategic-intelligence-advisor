import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { PageHeader } from '../Common';
import { RealDataValidationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { RealDataValidationPanel } from '../enterprise-validation/RealDataValidationPanel';
import { EnterpriseReadinessDashboard } from '../enterprise-validation/EnterpriseReadinessDashboard';
import { InstitutionalUXInsights } from '../enterprise-validation/InstitutionalUXInsights';
import { PilotReadinessPanel } from '../enterprise-validation/PilotReadinessPanel';
import { OperationalPlaybookViewer } from '../enterprise-validation/OperationalPlaybookViewer';
import { CommercialPackagingViewer } from '../enterprise-validation/CommercialPackagingViewer';
import { RuntimeIntegrityStatus } from '../enterprise-validation/RuntimeIntegrityStatus';
import { InstitutionalDeploymentMap } from '../enterprise-validation/InstitutionalDeploymentMap';

export function EnterpriseValidationPage() {
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Enterprise Validation & Go-To-Market"
        subtitle="Hardening Institucional: Validação de dados reais, UX Executiva e Prontidão Comercial."
        icon={ShieldCheck}
        transparent
      />

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
    </div>
  );
}
