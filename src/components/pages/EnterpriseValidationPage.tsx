import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { RealDataValidationEngine } from '../../core/runtime/enterprise-validation/RealDataValidationEngine';
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
    return <div className="p-8">Inicializando Enterprise Validation Sandbox...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Enterprise Validation & Go-To-Market
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hardening Institucional: Validação de dados reais, UX Executiva e Prontidão Comercial.
          </p>
        </div>
      </div>

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
