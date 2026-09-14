export interface AdvisorWorkspace {
  workspaceId: string;
  advisorId: string;
  tenantId: string; // O tenant primário do Advisor/Firma
  
  activeOrganizationId?: string;
  activeDomainId?: string;
  activeInvestigationId?: string;
  activeTimelineId?: string;
  
  // O tipo de visão institucional ativa
  activeWorkspaceMode: 'OVERVIEW' | 'INVESTIGATION' | 'HISTORICAL' | 'PORTFOLIO';

  createdAt: string;
  updatedAt: string;
}
