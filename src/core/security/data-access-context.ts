import { OfficialRole, OfficialAction, VisibilityPolicy, EntityScopeEvaluationInput } from './types';

export interface DataAccessContext {
  actorId: string;
  tenantId: string;
  role: OfficialRole;
  permissions: OfficialAction[];
  entityScope: EntityScopeEvaluationInput;
  requestedAction: OfficialAction;
  resourceType: string;
  resourceTenantId: string;
  resourceOwnerId?: string;
  visibilityPolicy?: VisibilityPolicy;
  approvalState?: string;
  auditRequirement?: boolean;
  
  // Fiduciary Requirements
  lineageHash?: string;
  inputHash?: string;
  scenarioHash?: string;

  // SYSTEM Requirements
  requestSource?: string;
  operation?: string;
  correlationId?: string;
  sessionId?: string;
}
