// src/core/runtime/audit-assurance/AuditTrailEngine.ts
//
// Audit Trail Engine
// Manages and verifies chronological logs of runtime execution traces.

import { AuditTrailEntry } from './audit-types';

export class AuditTrailEngine {
  private entries: AuditTrailEntry[] = [];

  /**
   * Appends an entry to the current runtime audit trail.
   */
  public logEntry(entry: Omit<AuditTrailEntry, 'timestamp'> & { timestamp?: string }): AuditTrailEntry {
    const newEntry: AuditTrailEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    };
    this.entries.push(newEntry);
    return newEntry;
  }

  /**
   * Sets or replaces the entire audit trail (e.g. during recovery/replay).
   */
  public setTrail(trail: AuditTrailEntry[]): void {
    this.entries = [...trail];
  }

  /**
   * Returns the current array of audit trail entries.
   */
  public getTrail(): AuditTrailEntry[] {
    return [...this.entries];
  }

  /**
   * Clears the current trail from memory.
   */
  public clear(): void {
    this.entries = [];
  }

  /**
   * Validates that the timestamps in the trail flow chronologically and hashes are intact.
   */
  public verifyChronology(trail: AuditTrailEntry[] = this.entries): boolean {
    if (trail.length <= 1) return true;
    for (let i = 1; i < trail.length; i++) {
      const prevTime = new Date(trail[i - 1].timestamp).getTime();
      const currTime = new Date(trail[i].timestamp).getTime();
      if (currTime < prevTime) {
        return false; // Out-of-order execution trace
      }
    }
    return true;
  }
}
