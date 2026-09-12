// src/core/runtime/executive-timeline/ExecutiveTimelineEngine.ts

import { HistoricalRuntimeCycle, ExecutiveTimelineOutput, TrajectoryClassification, AccelerationState, TimelineConfidence, TimelineEvent, TimelineInflectionPoint } from './executive-timeline-types';
import { TrajectoryClassificationEngine } from './engines/TrajectoryClassificationEngine';
import { TimelineAccelerationEngine } from './engines/TimelineAccelerationEngine';
import { TimelineEventDetectionEngine } from './engines/TimelineEventDetectionEngine';
import { TimelineConfidenceEngine } from './engines/TimelineConfidenceEngine';

export class ExecutiveTimelineEngine {

  public static parseCycle(cycle: any): HistoricalRuntimeCycle {
    if (!cycle) {
      throw new Error('Historical cycle data is empty.');
    }

    // 1. Resolve period reference
    const cycleReference = String(
      cycle.cycleReference || 
      cycle.period || 
      cycle.metadata?.cycleReference || 
      cycle.institutionalContext?.currentCycle || 
      cycle.year || 
      ''
    );

    // 2. Resolve scores
    const compositeScore = Number(
      cycle.compositeScore ?? 
      cycle.scores?.composite ?? 
      cycle.score ?? 
      0
    );

    // 3. Resolve metrics
    const ebitda = Number(
      cycle.ebitda ?? 
      cycle.cashSustainabilityReport?.ebitda ?? 
      cycle.metrics?.ebitda ?? 
      0
    );

    const netIncome = Number(
      cycle.netIncome ?? 
      cycle.cashSustainabilityReport?.netIncome ?? 
      cycle.metrics?.netIncome ?? 
      0
    );

    const ocf = Number(
      cycle.ocf ?? 
      cycle.cashSustainabilityReport?.ocf ?? 
      cycle.metrics?.financialMetrics?.ocf ?? 
      0
    );

    const cashEquivalents = Number(
      cycle.cashEquivalents ?? 
      cycle.cashSustainabilityReport?.cashEquivalents ?? 
      cycle.metrics?.financialMetrics?.caixaEquivalentes ?? 
      cycle.cashValue ??
      0
    );

    const equity = Number(
      cycle.equity ?? 
      cycle.rawFinancialData?.bpSummary?.patrimonioLiquido ?? 
      cycle.bpSummary?.patrimonioLiquido ?? 
      cycle.pl ??
      0
    );

    const totalDebt = Number(
      cycle.totalDebt ?? 
      cycle.rawFinancialData?.bpSummary?.passivoTotal ?? 
      cycle.bpSummary?.passivoTotal ?? 
      cycle.debt ??
      0
    );

    const workingCapital = Number(
      cycle.workingCapital ?? 
      cycle.metrics?.financialMetrics?.workingCapital ??
      0
    );

    // 4. Resolve classifications and states
    const fiduciaryClassification = String(
      cycle.fiduciaryClassification || 
      cycle.severity?.level || 
      'HEALTHY'
    );

    const lineageHash = String(
      cycle.lineageHash || 
      cycle.metadata?.lineageHash || 
      'N/A'
    );

    const isQuarantined = Boolean(
      cycle.isQuarantined || 
      cycle.status === 'CONSTITUTIONAL_QUARANTINE' || 
      cycle.quarantineMode || 
      false
    );

    const isRestricted = Boolean(
      cycle.isRestricted || 
      cycle.status === 'RESTRICTED' || 
      false
    );

    return {
      cycleReference,
      compositeScore,
      ebitda,
      netIncome,
      ocf,
      cashEquivalents,
      equity,
      totalDebt,
      workingCapital,
      fiduciaryClassification,
      lineageHash,
      isQuarantined,
      isRestricted
    };
  }

  public static generate(rawData: any, currentReport: any): ExecutiveTimelineOutput {
    // 1. Gather historical input cycles and current cycle
    const rawHistory = rawData.historicalCycles || rawData.runtimeHistory || [];
    const parsedCycles: HistoricalRuntimeCycle[] = [];

    // Parse and normalise each historical cycle
    for (const item of rawHistory) {
      try {
        parsedCycles.push(this.parseCycle(item));
      } catch (err) {
        console.error('[ExecutiveTimelineEngine] Error parsing history item:', err);
      }
    }

    // Parse and normalise current cycle
    if (currentReport) {
      try {
        parsedCycles.push(this.parseCycle(currentReport));
      } catch (err) {
        console.error('[ExecutiveTimelineEngine] Error parsing current report:', err);
      }
    }

    // Deduplicate cycles by cycleReference to avoid duplicate current report if already present
    const uniqueCyclesMap: Record<string, HistoricalRuntimeCycle> = {};
    for (const cycle of parsedCycles) {
      if (cycle.cycleReference) {
        uniqueCyclesMap[cycle.cycleReference] = cycle;
      }
    }

    // Sort chronologically by cycleReference (older first, newer last)
    const sortedCycles = Object.values(uniqueCyclesMap).sort((a, b) => 
      a.cycleReference.localeCompare(b.cycleReference)
    );

    // 2. Delegate to ETE Sub-Engines
    const trajectoryClassification = TrajectoryClassificationEngine.classify(sortedCycles);
    const accelerationState = TimelineAccelerationEngine.evaluate(sortedCycles);
    const confidenceLevel = TimelineConfidenceEngine.determine(sortedCycles);
    const inflectionPoints = TimelineEventDetectionEngine.detectInflectionPoints(sortedCycles);
    const timelineEvents = TimelineEventDetectionEngine.detectEvents(sortedCycles);

    // 3. Generate deterministic explainable narrative
    const executiveNarrative = this.composeNarrative(
      trajectoryClassification,
      accelerationState,
      confidenceLevel,
      timelineEvents
    );

    // 4. Cryptographic lineage propagation
    const combinedLineages = sortedCycles.map(c => c.lineageHash).join('|');
    const lineageHash = `timeline_${this.simpleHash(combinedLineages)}`;

    return {
      trajectoryClassification,
      accelerationState,
      confidenceLevel,
      inflectionPoints,
      timelineEvents,
      executiveNarrative,
      lineageHash
    };
  }

  private static composeNarrative(
    trajectory: TrajectoryClassification,
    acceleration: AccelerationState,
    confidence: TimelineConfidence,
    events: TimelineEvent[]
  ): string {
    if (confidence === 'FAIL_CLOSED') {
      return 'Análise de linha do tempo fiduciária suspensa por insuficiência de dados ou quarentena constitucional.';
    }

    let statement = `A trajetória institucional foi classificada como ${trajectory.replace(/_/g, ' ')}`;
    statement += ` com aceleração classificada como ${acceleration.replace(/_/g, ' ')}.`;

    if (events.length > 0) {
      const criticalCount = events.filter(e => e.severity === 'CRITICAL' || e.severity === 'RESTRICTIVE').length;
      if (criticalCount > 0) {
        statement += ` Foram detectados ${criticalCount} eventos críticos fiduciários ao longo do histórico longitudinal.`;
      } else {
        statement += ` Foram observadas evoluções e marcos de transição estrutural ao longo dos ciclos.`;
      }
    } else {
      statement += ` Nenhuma ocorrência de anomalia fiduciária ou desvio de conformidade contábil foi registrada nos ciclos analisados.`;
    }

    return statement;
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}
