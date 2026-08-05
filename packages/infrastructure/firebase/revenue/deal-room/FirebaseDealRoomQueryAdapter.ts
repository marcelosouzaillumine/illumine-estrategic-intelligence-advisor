import { IDealRoomQueryPort } from '../../../../application/revenue/deal-room/ports/IDealRoomQueryPort';
import { DealRoomSnapshot } from '../../../../application/revenue/deal-room/snapshots/DealRoomSnapshot';
import { IProjectionProvider } from '../../../../application/revenue/deal-room/ports/IProjectionProvider';

export class FirebaseDealRoomQueryAdapter implements IDealRoomQueryPort {
  constructor(private readonly projectionProvider: IProjectionProvider) {}

  async getDealRoomSnapshot(opportunityId: string): Promise<DealRoomSnapshot> {
    // Attempt to load from the Projection Provider
    const snapshot = await this.projectionProvider.getDealRoomProjection('stark-global', opportunityId);
    
    if (!snapshot) {
      throw new Error(`Deal Room Projection not found or not READY for ${opportunityId}`);
    }

    return snapshot;
  }
}
