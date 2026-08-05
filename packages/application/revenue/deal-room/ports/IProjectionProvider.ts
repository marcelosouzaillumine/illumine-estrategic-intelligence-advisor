import { DealRoomSnapshot } from '../snapshots/DealRoomSnapshot';

export interface IProjectionProvider {
  /**
   * Retrieves the current state of a projection.
   * Can return the snapshot or throw/return null if it's still INITIALIZING or FAILED.
   */
  getDealRoomProjection(tenantId: string, opportunityId: string): Promise<DealRoomSnapshot | null>;
}
