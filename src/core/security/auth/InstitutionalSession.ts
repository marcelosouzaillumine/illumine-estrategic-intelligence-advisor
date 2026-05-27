import { OfficialRole, OfficialAction, VisibilityPolicy } from '../types';
import { CommercialPlanId } from '../../commercial/CommercialPlanEngine';

export type SessionState = 
  | 'UNAUTHENTICATED'
  | 'AUTHENTICATED_PENDING_TENANT'
  | 'TENANT_SELECTION_REQUIRED'
  | 'READY'
  | 'DENIED';

export interface AvailableTenant {
  tenantId: string;
  name: string;
  role: OfficialRole;
}

export interface InstitutionalSession {
  actorId: string;
  tenantId: string;
  role: OfficialRole;
  permissions: OfficialAction[];
  entityScope: string[];
  groupScope?: string[];
  consolidatedScope?: boolean;
  visibilityPolicies: VisibilityPolicy[];
  sessionId: string;
  authenticatedAt: string;
  requestSource: string;
  sessionState: SessionState;
  
  // Para Multi-Tenant
  selectedTenantId?: string;
  availableTenants: AvailableTenant[];
  
  planId?: CommercialPlanId;
}
