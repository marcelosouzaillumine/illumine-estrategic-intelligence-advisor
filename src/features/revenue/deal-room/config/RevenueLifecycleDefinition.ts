import { LifecycleStageDefinition } from '@/core/executive-workspace/types/ExecutiveWorkspaceMetadata';

export const RevenueLifecycleStages: LifecycleStageDefinition[] = [
  {
    id: 'qualification',
    order: 1,
    titleKey: 'dealRoom.stages.qualification.title',
    descriptionKey: 'dealRoom.stages.qualification.desc',
    workspaceResolver: 'QualificationWorkspace',
  },
  {
    id: 'discovery',
    order: 2,
    titleKey: 'dealRoom.stages.discovery.title',
    descriptionKey: 'dealRoom.stages.discovery.desc',
    workspaceResolver: 'DiscoveryWorkspace',
  },
  {
    id: 'solutionDesign',
    order: 3,
    titleKey: 'dealRoom.stages.solutionDesign.title',
    descriptionKey: 'dealRoom.stages.solutionDesign.desc',
    workspaceResolver: 'ExecutiveSolutionStudio',
  },
  {
    id: 'proposal',
    order: 4,
    titleKey: 'dealRoom.stages.proposal.title',
    descriptionKey: 'dealRoom.stages.proposal.desc',
    workspaceResolver: 'ProposalWorkspace', // Can be mapped to PricingSimulator, etc. via a sub-stepper or tabs if needed.
  },
  {
    id: 'negotiation',
    order: 5,
    titleKey: 'dealRoom.stages.negotiation.title',
    descriptionKey: 'dealRoom.stages.negotiation.desc',
    workspaceResolver: 'NegotiationWorkspace',
  },
  {
    id: 'contract',
    order: 6,
    titleKey: 'dealRoom.stages.contract.title',
    descriptionKey: 'dealRoom.stages.contract.desc',
    workspaceResolver: 'ContractWorkspace',
  },
  {
    id: 'billing',
    order: 7,
    titleKey: 'dealRoom.stages.billing.title',
    descriptionKey: 'dealRoom.stages.billing.desc',
    workspaceResolver: 'BillingWorkspace',
  },
  {
    id: 'provisioning',
    order: 8,
    titleKey: 'dealRoom.stages.provisioning.title',
    descriptionKey: 'dealRoom.stages.provisioning.desc',
    workspaceResolver: 'ProvisioningWorkspace',
  },
  {
    id: 'completed',
    order: 9,
    titleKey: 'dealRoom.stages.completed.title',
    descriptionKey: 'dealRoom.stages.completed.desc',
    workspaceResolver: 'CompletedWorkspace',
  }
];
