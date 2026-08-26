export interface DataCollection<T> {
  available: boolean;
  items: T[];
  missingReason?: string;
  availabilityReason?: any;
}
