import { DealRoomSnapshot } from '../snapshots/DealRoomSnapshot';

export interface IDealRoomQueryPort {
  getDealRoomSnapshot(opportunityId: string): Promise<DealRoomSnapshot>;
}
