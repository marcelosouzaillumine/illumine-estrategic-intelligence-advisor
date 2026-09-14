import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RevenueOfficeLayout } from '../../../../features/revenue/layout/RevenueOfficeLayout';
import { RevenueCommandCenterPage } from '../../../../features/revenue/pages/RevenueCommandCenterPage';
import { ExecutiveProposalWorkspacePage } from '../../../../features/revenue/pages/ExecutiveProposalWorkspacePage';
import { CommercialPipelinePage } from '../../../../features/revenue/pages/CommercialPipelinePage';
import { OpportunityDealRoomPage } from '../../../../features/revenue/deal-room/pages/OpportunityDealRoomPage';
import { ContractManagementPage } from '../../../../features/revenue/pages/ContractManagementPage';
import { SubscriptionIntelligencePage } from '../../../../features/revenue/pages/SubscriptionIntelligencePage';
import { BillingOperationsPage } from '../../../../features/revenue/pages/BillingOperationsPage';
import { LicenseEntitlementPage } from '../../../../features/revenue/pages/LicenseEntitlementPage';
import { TenantOperationsPage } from '../../../../features/revenue/pages/TenantOperationsPage';
import { RevenueRuntimePage } from '../../../../features/revenue/pages/RevenueRuntimePage';
import { RevenueIntelligencePage } from '../../../../features/revenue/pages/RevenueIntelligencePage';
import { PartnerNetworkPage } from '../../../../features/revenue/pages/PartnerNetworkPage';
import { CertifiedAdvisorNetworkPage } from '../../../../features/revenue/pages/CertifiedAdvisorNetworkPage';
import { ExecutivePartnerNetworkPage } from '../../../../features/revenue/pages/ExecutivePartnerNetworkPage';

export const RevenueRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RevenueOfficeLayout />}>
        {/* /executive/revenue */}
        <Route index element={<RevenueCommandCenterPage />} />
        <Route path="proposals/:id" element={<ExecutiveProposalWorkspacePage />} />
        <Route path="pipeline" element={<CommercialPipelinePage />} />
        <Route path="contracts" element={<ContractManagementPage />} />
        <Route path="subscriptions" element={<SubscriptionIntelligencePage />} />
        <Route path="billing" element={<BillingOperationsPage />} />
        <Route path="access" element={<LicenseEntitlementPage />} />
        <Route path="tenants" element={<TenantOperationsPage />} />
        <Route path="runtime" element={<RevenueRuntimePage />} />
        <Route path="governance" element={<RevenueIntelligencePage />} />
        <Route path="partners">
          <Route index element={<PartnerNetworkPage />} />
          <Route path="advisors" element={<CertifiedAdvisorNetworkPage />} />
          <Route path="institutions" element={<ExecutivePartnerNetworkPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
