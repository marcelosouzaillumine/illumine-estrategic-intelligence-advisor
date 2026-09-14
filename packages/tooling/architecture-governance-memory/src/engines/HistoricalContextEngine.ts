import { MemoryRecord } from '../models/MemoryRecord';

export class HistoricalContextEngine {
  getContextAt(timestamp: string, records: MemoryRecord[]): MemoryRecord[] {
    // Returns the active architecture context at a specific point in time
    return records.filter(r => new Date(r.timestamp) <= new Date(timestamp));
  }
}
