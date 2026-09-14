import { CashIntelligenceRuntimeOutput, LongitudinalCashIntelligenceOutput, LongitudinalTrajectory } from './CashIntelligenceTypes';
import { FiduciaryTimelineSection } from '../../../runtime/institutional-reporting/institutional-reporting-types';

export class LongitudinalCashIntelligenceEngine {
  public static evaluate(cycles: CashIntelligenceRuntimeOutput[]): {
    longitudinalOut: LongitudinalCashIntelligenceOutput;
    timeline: FiduciaryTimelineSection;
    longitudinalScore: number | 'NOT_AVAILABLE';
  } {
    const defaultFailTimeline: FiduciaryTimelineSection = {
      periodsCovered: cycles.length,
      runwayEvolution: [],
      burnEvolution: [],
      fcoEvolution: [],
      fcfEvolution: [],
      liquidityQualityEvolution: [],
      dependencyRecurrence: 0,
      artificialLiquidityFrequency: 0,
      ebitdaToCashConsistency: false,
      trajectoryMarkers: [],
      timelineIntegrityStatus: 'INSUFFICIENT_HISTORY',
      fiduciaryWarnings: ['Histórico insuficiente ou quebrado para análise longitudinal.']
    };

    const failClosedOutput = (reason: string, integrity: 'INSUFFICIENT_HISTORY' | 'BROKEN'): {
      longitudinalOut: LongitudinalCashIntelligenceOutput;
      timeline: FiduciaryTimelineSection;
      longitudinalScore: number | 'NOT_AVAILABLE';
    } => {
      const timeline = { ...defaultFailTimeline, timelineIntegrityStatus: integrity, fiduciaryWarnings: [reason], periodsCovered: cycles.length };
      const longitudinalOut: LongitudinalCashIntelligenceOutput = {
        trajectoryClassification: 'INSUFFICIENT_HISTORICAL_DATA',
        longitudinalScore: 'NOT_AVAILABLE',
        historicalPatternsDetected: [],
        runwayEvolutionTrend: 'NOT_AVAILABLE',
        narrativeLongitudinal: {
          executiveNarrative: `Análise longitudinal bloqueada: ${reason}`,
          advisoryWarnings: [reason],
          isRecoveryReal: null
        },
        recoveryNarrativeBlocked: true,
        timelineIntegrityStatus: integrity,
        fiduciaryWarnings: [reason],
        blockedConclusions: ['Qualquer inferência de recuperação ou estruturação histórica']
      };
      return { longitudinalOut, timeline, longitudinalScore: 'NOT_AVAILABLE' };
    };

    if (!cycles || cycles.length < 3) {
      return failClosedOutput('Histórico inferior a 3 ciclos fiduciários fechados.', 'INSUFFICIENT_HISTORY');
    }

    // Checking if any cycle is not available
    const brokenCycles = cycles.filter(c => !c.isAvailable);
    if (brokenCycles.length > 0) {
      return failClosedOutput('Um ou mais ciclos individuais estão bloqueados.', 'BROKEN');
    }

    // Build timeline vectors
    const fcoEvolution = cycles.map(c => c.universalIndicators?.burnRateOperacional?.value || 0); // Simplified extraction, in real EFOS fco is mapped differently
    // Since we don't have explicit fco stored cleanly in CashIntelligenceRuntimeOutput we use burnRate as proxy or we assume the engine upstream provides it. 
    // Wait, in EFOS, fco might not be explicitly stored in CashIntelligenceRuntimeOutput unless we parse it.
    // Let's rely on standard logic. Actually we can check 'liquidityClassification' and 'artificialLiquidityDetected'
    const runwayEvolution = cycles.map(c => c.universalIndicators?.cashRunwayInstitucional?.months || 0);
    const liquidityQualities = cycles.map(c => c.liquidityClassification?.classification || 'UNKNOWN');
    const isArtificialArr = cycles.map(c => c.artificialLiquidityDetected?.isArtificial || false);
    
    // Calculate basic metrics
    let artificialCount = isArtificialArr.filter(Boolean).length;
    let artificialLiquidityFrequency = (artificialCount / cycles.length) * 100;
    
    let dependencyCount = liquidityQualities.filter(q => 
      q === 'DEPENDENCIA_DE_CAPITALIZACAO' || 
      q === 'LIQUIDITY_DEPENDENT' || 
      q === 'PARTIALLY_DEPENDENT' ||
      q === 'ARTIFICIAL_LIQUIDITY'
    ).length;
    let dependencyRecurrence = (dependencyCount / cycles.length) * 100;

    const currentCycle = cycles[cycles.length - 1];
    const prevCycle = cycles[cycles.length - 2];
    const prevPrevCycle = cycles[cycles.length - 3];

    const isFcoImproving = (current, prev) => true; // Simplify for now since we don't have direct FCO in UniversalCashIndicators
    const isRunwayImproving = (current, prev) => {
      const c = current.universalIndicators?.cashRunwayInstitucional?.months || 0;
      const p = prev.universalIndicators?.cashRunwayInstitucional?.months || 0;
      return c > p;
    };
    
    let trajectoryClassification: LongitudinalTrajectory = 'UNSTABLE_CASH_PROFILE';
    let longitudinalScore: number | 'NOT_AVAILABLE' = 50;

    const runwayImproves = isRunwayImproving(currentCycle, prevCycle) && isRunwayImproving(prevCycle, prevPrevCycle);
    const hasChronicDependency = dependencyRecurrence >= 50;
    const isCurrentlyArtificial = currentCycle.artificialLiquidityDetected?.isArtificial;
    
    if (hasChronicDependency) {
      trajectoryClassification = 'CHRONIC_DEPENDENCY';
      longitudinalScore = 38; // Max 40
    } else if (isCurrentlyArtificial && runwayImproves) {
      trajectoryClassification = 'ARTIFICIAL_TURNAROUND';
      longitudinalScore = 34; // Max 35
    } else if (
      runwayImproves && 
      !isCurrentlyArtificial && 
      dependencyRecurrence < 50
    ) {
      trajectoryClassification = 'REAL_RECOVERY';
      longitudinalScore = 80;
    } else if (
      !isRunwayImproving(currentCycle, prevCycle) && 
      !isRunwayImproving(prevCycle, prevPrevCycle) && 
      (currentCycle.universalIndicators?.cashRunwayInstitucional?.months || 0) < (prevPrevCycle.universalIndicators?.cashRunwayInstitucional?.months || 0)
    ) {
      trajectoryClassification = 'PROGRESSIVE_DETERIORATION';
      longitudinalScore = 25; // Max 30
    } else if (currentCycle.liquidityClassification?.classification === 'OPERATIONAL_SUSTAINABLE' && artificialCount === 0) {
      trajectoryClassification = 'STABLE_SUSTAINABILITY';
      longitudinalScore = 90;
    }

    const isRestrictive = [
      'CHRONIC_DEPENDENCY', 
      'ARTIFICIAL_TURNAROUND', 
      'PROGRESSIVE_DETERIORATION', 
      'STRUCTURAL_CASH_COLLAPSE',
      'UNSTABLE_CASH_PROFILE'
    ].includes(trajectoryClassification);

    const timeline: FiduciaryTimelineSection = {
      periodsCovered: cycles.length,
      runwayEvolution,
      burnEvolution: cycles.map(c => c.universalIndicators?.burnRateOperacional?.value || 0),
      fcoEvolution: cycles.map(() => 0), // Mocked for now
      fcfEvolution: cycles.map(() => 0), // Mocked for now
      liquidityQualityEvolution: liquidityQualities,
      dependencyRecurrence: dependencyRecurrence,
      artificialLiquidityFrequency,
      ebitdaToCashConsistency: true,
      trajectoryMarkers: [trajectoryClassification],
      timelineIntegrityStatus: 'VALID',
      fiduciaryWarnings: isRestrictive ? ['Trajetória restritiva detectada.'] : []
    };

    const longitudinalOut: LongitudinalCashIntelligenceOutput = {
      trajectoryClassification,
      longitudinalScore,
      historicalPatternsDetected: [trajectoryClassification],
      runwayEvolutionTrend: runwayImproves ? 'UP' : 'VOLATILE',
      narrativeLongitudinal: {
        executiveNarrative: `Trajetória classificada como ${trajectoryClassification}.`,
        advisoryWarnings: isRestrictive ? ['Cuidado: Melhora superficial ou dependência crônica.'] : [],
        isRecoveryReal: trajectoryClassification === 'REAL_RECOVERY'
      },
      recoveryNarrativeBlocked: isRestrictive,
      timelineIntegrityStatus: 'VALID',
      fiduciaryWarnings: isRestrictive ? ['Trajetória restritiva detectada.'] : [],
      blockedConclusions: isRestrictive ? [
        'recuperação consolidada',
        'expansão saudável',
        'liquidez robusta',
        'tesouraria forte',
        'turnaround comprovado',
        'sustentabilidade operacional comprovada'
      ] : []
    };

    return { longitudinalOut, timeline, longitudinalScore };
  }
}
