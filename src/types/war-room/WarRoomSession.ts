import { InstitutionalObject } from '../intelligence/InstitutionalObject';

export interface WarRoomSession extends InstitutionalObject {
  /** @deprecated use tenantId instead */
  organizationId: string;
  advisorId: string;
  activeScenarioId?: string;
}
