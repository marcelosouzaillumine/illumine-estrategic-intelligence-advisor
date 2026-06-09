import { InstitutionalObject } from '../intelligence/InstitutionalObject';

export interface WarRoomSession extends InstitutionalObject {
  organizationId: string;
  advisorId: string;
  activeScenarioId?: string;
}
