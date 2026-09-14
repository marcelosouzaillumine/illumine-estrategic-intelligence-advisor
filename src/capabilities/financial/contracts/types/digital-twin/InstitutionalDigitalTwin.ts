import { InstitutionalObject } from '../../../../../types/intelligence/InstitutionalObject';

export interface InstitutionalDigitalTwin extends InstitutionalObject {
  // References to other core systems
  currentSnapshotId?: string;
  timelineId?: string;
  graphId?: string;
}
