export type CapabilityStatus =
  | 'AVAILABLE'
  | 'NOT_YET_IMPLEMENTED'
  | 'UNAVAILABLE';

export interface CapabilityState {
  status: CapabilityStatus;
  reason?: string;
  data?: any;
}
