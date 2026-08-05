import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RevenueOfficeLayout } from '../layout/RevenueOfficeLayout';
import { RevenueCommandCenterPage } from '../pages/RevenueCommandCenterPage';
import { ExecutiveProposalWorkspacePage } from '../pages/ExecutiveProposalWorkspacePage';
import { CommercialPipelinePage } from '../pages/CommercialPipelinePage';
import { OpportunityDealRoomPage } from '../deal-room/pages/OpportunityDealRoomPage';
import { ContractManagementPage } from '../pages/ContractManagementPage';
import { SubscriptionIntelligencePage } from '../pages/SubscriptionIntelligencePage';
import { BillingOperationsPage } from '../pages/BillingOperationsPage';
import { LicenseEntitlementPage } from '../pages/LicenseEntitlementPage';
import { TenantOperationsPage } from '../pages/TenantOperationsPage';
import { RevenueRuntimePage } from '../pages/RevenueRuntimePage';
import { RevenueIntelligencePage } from '../pages/RevenueIntelligencePage';
import { PartnerNetworkPage } from '../pages/PartnerNetworkPage';
import { CertifiedAdvisorNetworkPage } from '../pages/CertifiedAdvisorNetworkPage';
import { ExecutivePartnerNetworkPage } from '../pages/ExecutivePartnerNetworkPage';

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
        <Route path="intelligence" element={<RevenueIntelligencePage />} />
        <Route path="partners">
          <Route index element={<PartnerNetworkPage />} />
          <Route path="advisors" element={<CertifiedAdvisorNetworkPage />} />
          <Route path="institutions" element={<ExecutivePartnerNetworkPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
