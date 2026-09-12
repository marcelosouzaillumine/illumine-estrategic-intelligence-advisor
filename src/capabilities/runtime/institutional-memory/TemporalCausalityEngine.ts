import { 
  HistoricalReplayIndexEntry, 
  TemporalCausalityOutput, 
  TemporalEvidence, 
  CausalChain 
} from './types';
import { InstitutionalDeteriorationModel } from './InstitutionalDeteriorationModel';
import { ExecutiveResponsivenessEngine, ActionMarker } from './ExecutiveResponsivenessEngine';
import { GovernanceFatigueDetection } from './GovernanceFatigueDetection';
import { PredictiveRecurrenceEngine } from './PredictiveRecurrenceEngine';
import { TemporalEscalationEngine } from './TemporalEscalationEngine';
import { TemporalGovernanceScoring } from './TemporalGovernanceScoring';
import { InstitutionalEarlyWarningSystem } from './InstitutionalEarlyWarningSystem';
import { DataAccessContext } from './ReplayMetadataRegistry';
import { sha256 } from '../executive/types';

export class TemporalCausalityEngine {
  public static evaluateLongitudinalCausality(
    context: DataAccessContext,
    history: HistoricalReplayIndexEntry[],
    anomalyCount: number,
    ignoredRecommendationsCount: number,
    actionMarkers: ActionMarker[],
    unresolvedWorkflowCount: number,
    isVolumeHigh: boolean
  ): TemporalCausalityOutput | null {
    // 7. Fail-Closed obrigatório
    if (!context.tenantId || !context.entityScope || context.entityScope.length === 0) {
      return null;
    }

    if (!history || history.length < 3) {
      return null; // INSUFFICIENT_HISTORY
    }

    // Tenant isolation verification explicitly on the history
    for (const entry of history) {
      if (entry.tenantId !== context.tenantId) {
        throw new Error('CROSS_TENANT_BLOCKED');
      }
      if (!context.entityScope.includes(entry.entityScope)) {
        throw new Error('OUT_OF_SCOPE');
      }
      if (!entry.lineageHash || !entry.correlationId) {
        return null; // Missing mandatory causality identifiers
      }
    }

    // Step A Engines
    const deterioration = InstitutionalDeteriorationModel.evaluate(history, anomalyCount, ignoredRecommendationsCount);
    const responsiveness = ExecutiveResponsivenessEngine.evaluate(actionMarkers);
    const fatigue = GovernanceFatigueDetection.evaluate(ignoredRecommendationsCount, unresolvedWorkflowCount, isVolumeHigh);
    
    const anomalyLineageHashes = history
      .filter(h => h.anomalyReferences && h.anomalyReferences.length > 0)
      .map(h => h.lineageHash);
    const recurrence = PredictiveRecurrenceEngine.evaluate(anomalyLineageHashes, history.length);

    const isTreasuryStress = deterioration.deteriorationScore > 50;
    const isGovernanceFailure = fatigue.fatigueScore > 50;
    const escalation = TemporalEscalationEngine.evaluate(
      recurrence.recurrenceSeverity, 
      isTreasuryStress, 
      isGovernanceFailure, 
      recurrence.recurrenceLineage
    );

    // Step B Engines
    const scoring = TemporalGovernanceScoring.evaluate(deterioration, responsiveness, fatigue, recurrence);
    
    // Most recent history acts as anchor
    const latestEntry = history[history.length - 1];
    const lineageHash = latestEntry.lineageHash;
    const correlationId = latestEntry.correlationId;

    const earlyWarnings = InstitutionalEarlyWarningSystem.evaluate(
      recurrence,
      fatigue,
      deterioration,
      escalation,
      lineageHash
    );

    const temporalEvidence: TemporalEvidence[] = history.map(h => ({
      timestamp: h.timestamp,
      evidenceId: h.replayId,
      sourceContext: 'HistoricalReplayIndex',
      description: `Replay index evidence for ${h.period}`
    }));

    // Generate causal chain preserving sequence
    const causalChain: CausalChain = {
      chainId: `chain-${correlationId}`,
      links: history.map(h => h.lineageHash),
      rootCauseId: history[0].lineageHash
    };

    const auditReference = `causality-${sha256(lineageHash + correlationId).substring(0, 8)}`;

    return {
      temporalGovernanceScore: scoring,
      earlyWarnings,
      deteriorationState: deterioration,
      responsivenessMetrics: responsiveness,
      fatigueState: fatigue,
      predictiveRecurrence: recurrence,
      escalationState: escalation,
      causalChain,
      lineageHash,
      correlationId,
      tenantId: context.tenantId,
      entityScope: context.entityScope[0],
      temporalEvidence,
      confidenceState: {
        level: recurrence.recurrenceConfidence,
        justification: `Based on ${history.length} proven cycles of historical evidence.`
      },
      auditReference
    };
  }
}
