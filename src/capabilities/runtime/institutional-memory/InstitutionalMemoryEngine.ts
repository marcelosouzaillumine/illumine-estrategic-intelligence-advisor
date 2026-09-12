import { sha256 } from '../../../workspace/runtime/executive/types';
import { InstitutionalMemoryProfile, HistoricalCycleData } from './types';
import { RecommendationPersistenceTracker } from './RecommendationPersistenceTracker';
import { GovernanceRecurrenceEngine } from './GovernanceRecurrenceEngine';
import { InstitutionalBehaviorAnalyzer } from './InstitutionalBehaviorAnalyzer';
import { PatternRecurrenceResolver } from './PatternRecurrenceResolver';

export class InstitutionalMemoryEngine {
  public static buildMemory(runtimeHistory: HistoricalCycleData[]): InstitutionalMemoryProfile {
    // 1. Fail-closed: check if history is sufficient (cycles >= 3)
    if (!runtimeHistory || runtimeHistory.length < 3) {
      return {
        recurrencePatterns: [],
        ignoredRecommendations: [],
        governanceHistory: [],
        deteriorationSignals: ['Histórico insuficiente para inferência evolutiva.'],
        operationalRecurrence: [],
        decisionPatterns: [],
        confidenceEvolution: (runtimeHistory || []).map(c => ({
          period: c.year,
          dataConfidence: c.confidenceLevel || 'LOW_CONFIDENCE',
          strategicConfidence: 'LIMITED_CONTEXT'
        })),
        institutionalTimeline: (runtimeHistory || []).map(c => ({
          period: c.year,
          events: ['Histórico insuficiente para inferência evolutiva.']
        })),
        structuralPersistence: [],
        recurrenceSeverity: 'LOW_RECURRENCE',
        evidenceIntegrityHash: 'EMPTY-HASH',
        memoryLineageHash: 'EMPTY-HASH',
        recurrenceConfidence: 'LOW',
        historicalDensityRequirement: 'INSUFFICIENT'
      };
    }

    const sorted = [...runtimeHistory].sort((a, b) => a.year - b.year);

    // 2. Execute tracking modules
    const ignoredRecommendations = RecommendationPersistenceTracker.trackIgnored(sorted);
    
    const govResult = GovernanceRecurrenceEngine.evaluate(sorted);
    
    const behaviorPatterns = InstitutionalBehaviorAnalyzer.analyze(
      sorted,
      ignoredRecommendations,
      govResult.structuralPersistence
    );

    const resolvedPatterns = PatternRecurrenceResolver.resolve(sorted, govResult.recurrenceSeverity);

    // 3. Populate confidence evolution & timeline
    const confidenceEvolution = sorted.map(c => ({
      period: c.year,
      dataConfidence: c.confidenceLevel || 'MEDIUM_CONFIDENCE',
      strategicConfidence: c.year === sorted[sorted.length - 1].year ? 'HIGH_CONTEXT' : 'MEDIUM_CONTEXT'
    }));

    const institutionalTimeline = sorted.map(c => {
      const events: string[] = [];
      if (c.violations && c.violations.length > 0) {
        c.violations.forEach(v => events.push(`Violação: [${v.severity}] ${v.message}`));
      }
      if (c.recommendations && c.recommendations.length > 0) {
        c.recommendations.forEach(r => events.push(`Recomendação: ${r}`));
      }
      if (events.length === 0) {
        events.push('Nenhum evento registrado.');
      }
      return {
        period: c.year,
        events
      };
    });

    const governanceHistory = sorted.flatMap(c => {
      const history: Array<{ timestamp: string; eventType: string; description: string }> = [];
      if (c.decisions && c.decisions.length > 0) {
        c.decisions.forEach(d => {
          history.push({
            timestamp: d.timestamp,
            eventType: d.decisionType,
            description: `Decisão de aprovação: ${d.approvalState}`
          });
        });
      }
      return history;
    });

    // 4. Generate Lineage Hashes (Immutable auditability)
    const lineageData = sorted.map(c => c.lineageHash || `${c.year}-hash`).join('|');
    const memoryLineageHash = sha256(lineageData);

    const evidenceData = JSON.stringify({
      violations: sorted.map(c => c.violations || []),
      recommendations: sorted.map(c => c.recommendations || []),
      decisions: sorted.map(c => c.decisions || [])
    });
    const evidenceIntegrityHash = sha256(evidenceData);

    // 5. Final Profile Compilation
    return {
      recurrencePatterns: resolvedPatterns,
      ignoredRecommendations,
      governanceHistory,
      deteriorationSignals: govResult.deteriorationSignals,
      operationalRecurrence: govResult.operationalRecurrence,
      decisionPatterns: behaviorPatterns,
      confidenceEvolution,
      institutionalTimeline,
      structuralPersistence: govResult.structuralPersistence,
      recurrenceSeverity: govResult.recurrenceSeverity,
      evidenceIntegrityHash,
      memoryLineageHash,
      recurrenceConfidence: govResult.recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE' ? 'LOW' : 'HIGH',
      historicalDensityRequirement: 'SUFFICIENT'
    };
  }
}
