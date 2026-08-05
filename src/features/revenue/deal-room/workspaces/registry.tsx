import React from 'react';
import { WorkspaceRegistry } from '@/core/executive-workspace/registry/WorkspaceRegistry';
import { QualificationWorkspace } from './QualificationWorkspace';

// Mocks for workspaces
const ExecutiveSolutionStudio = () => <div className="p-8">Executive Solution Studio Workspace</div>;
const ProposalWorkspace = () => <div className="p-8">Proposal Workspace</div>;

export function registerDealRoomWorkspaces() {
  WorkspaceRegistry.register({ id: 'QualificationWorkspace', component: QualificationWorkspace });
  WorkspaceRegistry.register({ id: 'DiscoveryWorkspace', component: () => <div className="p-8">Discovery Workspace</div> });
  WorkspaceRegistry.register({ id: 'ExecutiveSolutionStudio', component: ExecutiveSolutionStudio });
  WorkspaceRegistry.register({ id: 'ProposalWorkspace', component: ProposalWorkspace });
  WorkspaceRegistry.register({ id: 'NegotiationWorkspace', component: () => <div className="p-8">Negotiation Workspace</div> });
  WorkspaceRegistry.register({ id: 'ContractWorkspace', component: () => <div className="p-8">Contract Workspace</div> });
  WorkspaceRegistry.register({ id: 'BillingWorkspace', component: () => <div className="p-8">Billing Workspace</div> });
  WorkspaceRegistry.register({ id: 'ProvisioningWorkspace', component: () => <div className="p-8">Provisioning Workspace</div> });
  WorkspaceRegistry.register({ id: 'CompletedWorkspace', component: () => <div className="p-8">Completed Workspace</div> });
}
