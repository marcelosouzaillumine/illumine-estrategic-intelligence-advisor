import { InstitutionalContextProfile } from '../../../capabilities/runtime/institutional-context/types';
import { DomainPresenceStatus, UnifiedDisclosureEngine } from './UnifiedDisclosureEngine';
import { CrossDomainCausalityResolver, DomainSignals } from './CrossDomainCausalityResolver';
import { InstitutionalConsistencyGuard } from './InstitutionalConsistencyGuard';
import { InstitutionalViewContract } from './InstitutionalViewContract';
import { InstitutionalInterpretationBoundary } from './InstitutionalInterpretationBoundary';
import { InstitutionalDecisionLedger } from '../../../capabilities/runtime/institutional-memory/InstitutionalDecisionLedger';
import { InstitutionalContinuityResolver, ContinuityStatus } from '../../../capabilities/runtime/institutional-memory/InstitutionalContinuityResolver';
import { RecommendationPersistenceTracker } from '../../../capabilities/runtime/institutional-memory/RecommendationPersistenceTracker';
import { InstitutionalBehaviorPatternEngine } from '../../../capabilities/runtime/institutional-memory/InstitutionalBehaviorPatternEngine';
import { FiduciaryEvolutionEngine } from '../../../capabilities/runtime/institutional-memory/FiduciaryEvolutionEngine';
import { ExecutiveResolutionTracker } from '../../../capabilities/runtime/institutional-memory/ExecutiveResolutionTracker';
import { ExecutiveMemoryNarrativeEngine } from '../../../capabilities/runtime/institutional-memory/ExecutiveMemoryNarrativeEngine';

export type OrchestratorPayload = {
  ctx: InstitutionalContextProfile;
  presence: DomainPresenceStatus;
  signals: DomainSignals;
  ledger?: InstitutionalDecisionLedger;
};

export class InstitutionalFinancialDomainOrchestrator {
  /**
   * Ponto único e soberano de geração do InstitutionalViewContract.
   * Centraliza Prudência, Causalidade, Disclosures e Narrativa.
   */
  public static orchestrate(payload: OrchestratorPayload): InstitutionalViewContract {
    const { ctx, presence, signals, ledger } = payload;
    const historicalCyclesCount = presence.historicalCycles;
    
    // Process Memory
    let continuityStatus: ContinuityStatus = 'INCONCLUSIVO';
    let continuityNarrative = '';
    let persistentRecommendations: any[] = [];
    let patterns: any[] = [];
    let isTrueTurnaround = false;
    let turnaroundReason = '';
    let resolutions: any[] = [];

    if (ledger) {
      const continuity = InstitutionalContinuityResolver.resolve(ledger, historicalCyclesCount);
      continuityStatus = continuity.status;
      continuityNarrative = continuity.narrative;
      persistentRecommendations = RecommendationPersistenceTracker.track(ledger);
      patterns = InstitutionalBehaviorPatternEngine.detect(ledger);
      const turnaround = FiduciaryEvolutionEngine.validateTurnaround(ledger, signals.dreMarginExpansion, historicalCyclesCount);
      isTrueTurnaround = turnaround.isTrueTurnaround;
      turnaroundReason = turnaround.reason;
      resolutions = ExecutiveResolutionTracker.track(ledger, []); // Assuming currentIssues is passed or inferred
      continuityNarrative = ExecutiveMemoryNarrativeEngine.generateNarrative(
        continuityStatus,
        isTrueTurnaround,
        turnaroundReason,
        persistentRecommendations.filter(r => r.status === 'CRITICAL_IGNORANCE').length
      );
    }

    const persistentIgnoranceCount = persistentRecommendations.filter(r => r.status === 'CRITICAL_IGNORANCE').length;

    // 1. Unified Disclosure Engine
    const disclosures = UnifiedDisclosureEngine.resolve(presence, ctx, continuityStatus, persistentIgnoranceCount);
    const isFailClosedActive = disclosures.isCritical;

    // 2. Cross Domain Causality
    const rawCausality = CrossDomainCausalityResolver.resolve(signals, ctx, isFailClosedActive, continuityStatus);

    // 3. Institutional Consistency Enforcement
    const enforcedInsight = InstitutionalConsistencyGuard.enforce(
      rawCausality.executiveInsight,
      ctx,
      isFailClosedActive
    );

    // 4. Interpretation Boundaries (Optimism Leakage mitigation)
    const safePrimaryEvent = InstitutionalInterpretationBoundary.evaluateNarrativeSafety(
      rawCausality.primaryEvent,
      ctx
    );

    // 5. Severity Calibration
    let levelLabel = 'ESTÁVEL';
    let colorClass = 'text-emerald-500';

    if (disclosures.isCritical) {
      levelLabel = 'SENSÍVEL';
      colorClass = 'text-red-500';
    } else if (signals.dfcCashBurn || signals.bpWorkingCapitalPressure) {
      levelLabel = 'ALERTA';
      colorClass = 'text-amber-500';
    }

    return {
      disclosures: disclosures,
      causality: {
        primaryEvent: safePrimaryEvent,
        rootCause: rawCausality.rootCause,
        systemicPropagation: rawCausality.systemicPropagation,
        executiveInsight: enforcedInsight
      },
      maturity: {
        stageLabel: ctx.institutionalMaturity.label,
        historicalDensityLabel: ctx.legacy?.historicalDensity === 'LOW_HISTORICAL_DENSITY' ? 'Baixa Densidade' : 'Consolidada',
        canShowEvolution: presence.historicalCycles > 1
      },
      severity: {
        colorClass,
        levelLabel
      },
      narrative: {
        header: isFailClosedActive ? 'Métricas Indisponíveis' : 'Síntese Executiva',
        executiveSummary: disclosures.primaryDisclosure || 'Operação estabilizada com visibilidade fiduciária atestada.'
      },
      telemetry: {
        bpConfidence: presence.hasBP ? 100 : 0,
        dreConfidence: presence.hasDRE ? 100 : 0,
        dfcConfidence: presence.hasDFC ? 100 : 0,
        isFailClosedActivated: isFailClosedActive
      },
      memory: ledger ? {
        continuityStatus,
        continuityNarrative,
        persistentRecommendations,
        resolutions,
        patterns,
        isTrueTurnaround,
        turnaroundReason
      } : undefined
    };
  }
}
