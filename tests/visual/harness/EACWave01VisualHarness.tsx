import React from 'react';
import { BalanceSheetTechnicalLayerSection } from '../../../src/components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';
import { WarningEvidenceViewer } from '../../../src/components/early-warning/WarningEvidenceViewer';
import { RuntimeLineageViewer } from '../../../src/components/executive-interaction/RuntimeLineageViewer';
import { GovernanceAuditCorrelationPanel } from '../../../src/components/governance-command-center/GovernanceAuditCorrelationPanel';
import { ProductAccessAuditFeed } from '../../../src/components/product-governance/ProductAccessAuditFeed';
import { ClientLoginAudit } from '../../../src/components/ClientLoginAudit';
import { GovernanceCommandCenterProvider } from '../../../src/context/governance-command-center/GovernanceCommandCenterProvider';

// Mock context for the components
export default function EACWave01VisualHarness() {
  let target = '';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    target = params.get('target') || '';
  }

  const renderTarget = () => {
    switch (target) {
      case 'balance-sheet':
        return <BalanceSheetTechnicalLayerSection viewModel={{ families: [{ familyName: 'Test', indicators: [{ label: 'Ind 1', value: '100' }] }] }} />;
      case 'warning-evidence':
        return <WarningEvidenceViewer tenantId="test-tenant" />;
      case 'runtime-lineage':
        return <RuntimeLineageViewer />;
      case 'audit-correlation':
        return (
          <GovernanceCommandCenterProvider>
            <GovernanceAuditCorrelationPanel />
          </GovernanceCommandCenterProvider>
        );
      case 'product-access':
        return <ProductAccessAuditFeed tenantId="test-tenant" />;
      case 'client-login':
        return <ClientLoginAudit clientId="test-client" />;
      default:
        return <div>Target not found: {target}</div>;
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {renderTarget()}
      </div>
    </div>
  );
}
