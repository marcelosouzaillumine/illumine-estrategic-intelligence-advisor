export type InstitutionalWorkspaceType = 
  | 'DIGITAL_TWIN'
  | 'INVESTIGATION'
  | 'TIME_MACHINE'
  | 'ADVISOR'
  | 'WAR_ROOM'
  | 'INTELLIGENCE_FABRIC'
  | 'MEMORY'
  | 'EXECUTIVE_HOME'
  | 'HUB';

export interface InstitutionalNavigationReference {
  sourceWorkspace: InstitutionalWorkspaceType;
  targetWorkspace: InstitutionalWorkspaceType;
  sourceObjectId?: string;
  targetObjectId?: string;
  tenantId: string;
  correlationId?: string;
}
