import { InstitutionalMemoryRecord } from './types';

export interface TimelinePhase {
  timestamp: string;
  category: string;
  severity: string;
  title: string;
  summary: string;
  lineageHash: string;
  runtimeId: string;
  isFiduciary: boolean;
}

export class GovernanceTimelineEngine {
  /**
   * Sorts and maps historical records into a clean, parsed chronology structure.
   */
  public static buildTimeline(records: InstitutionalMemoryRecord[]): TimelinePhase[] {
    // Sort chronologically ascending
    const sorted = [...records].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sorted.map(record => {
      const isFiduciary = 
        record.governanceCategory?.toLowerCase().includes('fiduci') ||
        record.executiveUrgency?.includes('BOARD_INTERVENTION') ||
        record.executiveUrgency?.includes('EXECUTIVE_INTERVENTION');

      return {
        timestamp: record.timestamp,
        category: record.governanceCategory,
        severity: record.severityLevel,
        title: record.causalSummary || 'Registro de Evento no Runtime',
        summary: record.narrativeSnapshot,
        lineageHash: record.lineageHash,
        runtimeId: record.runtimeReferenceId,
        isFiduciary: !!isFiduciary
      };
    });
  }
}
