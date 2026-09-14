import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InstitutionalMemoryRecord,
  PatternSignal,
  RecommendationContinuity,
  InstitutionalMemoryIntegrity,
  InstitutionalHistoricalConfidence
} from '../../../runtime/institutional-memory/types';
import { InstitutionalMemoryRegistry } from '../../../runtime/institutional-memory/InstitutionalMemoryRegistry';
import { InstitutionalPatternRecognitionEngine } from '../../../runtime/institutional-memory/InstitutionalPatternRecognitionEngine';
import { AdvisoryContinuityEngine } from '../../../runtime/institutional-memory/AdvisoryContinuityEngine';
import { GovernanceTimelineEngine, TimelinePhase } from '../../../runtime/institutional-memory/GovernanceTimelineEngine';

interface InstitutionalMemoryContextType {
  records: InstitutionalMemoryRecord[];
  memoryTimeline: TimelinePhase[];
  recurrenceSignals: PatternSignal[];
  advisoryContinuity: RecommendationContinuity[];
  historicalConfidence: InstitutionalHistoricalConfidence;
  lineageIntegrity: InstitutionalMemoryIntegrity;
  appendRecord: (record: Omit<InstitutionalMemoryRecord, 'memoryId'>) => InstitutionalMemoryRecord;
  loadMemoryForTenant: (tenantId: string) => void;
  activeTenantId: string;
}

const InstitutionalMemoryContext = createContext<InstitutionalMemoryContextType>({
  records: [],
  memoryTimeline: [],
  recurrenceSignals: [],
  advisoryContinuity: [],
  historicalConfidence: 'LOW',
  lineageIntegrity: 'VERIFIED',
  appendRecord: () => ({} as any),
  loadMemoryForTenant: () => {},
  activeTenantId: ''
});

export const useInstitutionalMemory = () => useContext(InstitutionalMemoryContext);

export function InstitutionalMemoryProvider({ children, initialTenantId }: { children: React.ReactNode, initialTenantId?: string }) {
  const [activeTenantId, setActiveTenantId] = useState<string>(initialTenantId || 'demo-tenant-turnaround');
  const [records, setRecords] = useState<InstitutionalMemoryRecord[]>([]);
  const [memoryTimeline, setMemoryTimeline] = useState<TimelinePhase[]>([]);
  const [recurrenceSignals, setRecurrenceSignals] = useState<PatternSignal[]>([]);
  const [advisoryContinuity, setAdvisoryContinuity] = useState<RecommendationContinuity[]>([]);
  const [historicalConfidence, setHistoricalConfidence] = useState<InstitutionalHistoricalConfidence>('LOW');
  const [lineageIntegrity, setLineageIntegrity] = useState<InstitutionalMemoryIntegrity>('VERIFIED');

  const loadMemoryForTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
  };

  // Main evaluation logic runs on tenant change or record update
  useEffect(() => {
    const rawRecords = InstitutionalMemoryRegistry.getRecords(activeTenantId);
    setRecords(rawRecords);

    // 1. Audit integrity and lineage to enforce fail-closed cognitive boundaries
    let integrity: InstitutionalMemoryIntegrity = 'VERIFIED';
    let hasCorrupted = false;

    rawRecords.forEach(r => {
      // Lineage integrity checks
      if (!r.lineageHash || r.lineageHash.trim() === '') {
        hasCorrupted = true;
      }
      if (r.integrityStatus === 'FAIL_CLOSED') {
        hasCorrupted = true;
      }
    });

    if (hasCorrupted) {
      integrity = 'FAIL_CLOSED';
    } else if (rawRecords.some(r => r.integrityStatus === 'DEGRADED')) {
      integrity = 'DEGRADED';
    } else if (rawRecords.some(r => r.integrityStatus === 'PARTIAL')) {
      integrity = 'PARTIAL';
    }

    setLineageIntegrity(integrity);

    // 2. Derive historical confidence
    const recordCount = rawRecords.length;
    let confidence: InstitutionalHistoricalConfidence = 'LOW';
    if (recordCount >= 5) {
      confidence = 'VERIFIED';
    } else if (recordCount >= 3) {
      confidence = 'HIGH';
    } else if (recordCount === 2) {
      confidence = 'MODERATE';
    }
    setHistoricalConfidence(confidence);

    // If fail-closed activated, restrict timeline outputs
    if (integrity === 'FAIL_CLOSED') {
      setMemoryTimeline([]);
      setRecurrenceSignals([]);
      setAdvisoryContinuity([]);
    } else {
      // 3. Process engines
      setMemoryTimeline(GovernanceTimelineEngine.buildTimeline(rawRecords));
      setRecurrenceSignals(InstitutionalPatternRecognitionEngine.detectPatterns(rawRecords));
      setAdvisoryContinuity(AdvisoryContinuityEngine.traceContinuity(rawRecords));
    }

  }, [activeTenantId]);

  const appendRecord = (record: Omit<InstitutionalMemoryRecord, 'memoryId'>): InstitutionalMemoryRecord => {
    const newRecord = InstitutionalMemoryRegistry.append(record);
    // Reload state after append
    const rawRecords = InstitutionalMemoryRegistry.getRecords(activeTenantId);
    setRecords(rawRecords);
    return newRecord;
  };

  return (
    <InstitutionalMemoryContext.Provider value={{
      records,
      memoryTimeline,
      recurrenceSignals,
      advisoryContinuity,
      historicalConfidence,
      lineageIntegrity,
      appendRecord,
      loadMemoryForTenant,
      activeTenantId
    }}>
      {children}
    </InstitutionalMemoryContext.Provider>
  );
}
